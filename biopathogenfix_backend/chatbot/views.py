import logging
import os

from django.conf import settings
from django.core.mail import send_mail
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.utils.html import strip_tags

from ai.answer import answer_chat_request

from ai.intake import build_assay_intake_email_html
from .models import PathogenPanelLookup, normalize_lookup_text
from services.emailService import send_graph_email

logger = logging.getLogger(__name__)


class ChatView(APIView):
    def post(self, request):
        user_text = request.data.get("userText", "")
        history = request.data.get("history", [])

        if not user_text:
            return Response({"reply": "Please type a message."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            reply, _docs, intake_form = answer_chat_request(user_text, history)
            return Response(
                {"reply": reply, "intakeForm": intake_form},
                status=status.HTTP_200_OK,
            )
        except Exception as exc:
            return Response(
                {"reply": "Sorry - AI service failed.", "error": str(exc)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


def _score_pathogen_lookup(name: str, normalized_query: str, tokens: list[str]) -> int:
    if not name or not normalized_query:
        return 0

    score = 0

    if name == normalized_query:
        score += 400
    if name.startswith(normalized_query):
        score += 260
    if normalized_query in name:
        score += 180

    token_matches = sum(1 for token in tokens if token in name)
    score += token_matches * 35

    if len(tokens) > 1 and token_matches == len(tokens):
        score += 100

    return score


class PathogenLookupSearchView(APIView):
    def post(self, request):
        query = str(request.data.get("query") or "").strip()
        if not query:
            return Response({"matched": False, "matches": []}, status=status.HTTP_400_BAD_REQUEST)

        normalized_query = normalize_lookup_text(query)
        tokens = [token for token in normalized_query.split() if token]

        ranked = []
        for entry in PathogenPanelLookup.objects.filter(is_active=True):
            score = _score_pathogen_lookup(entry.normalized_name, normalized_query, tokens)
            if score <= 0:
                continue
            ranked.append((score, entry))

        ranked.sort(key=lambda item: (-item[0], item[1].pathogen_target))

        matches = [
            {
                "pathogenTarget": entry.pathogen_target,
                "panelCount": entry.panel_count,
                "panels": entry.panels,
            }
            for score, entry in ranked[:8]
            if score >= 80
        ]

        return Response(
            {
                "matched": len(matches) > 0,
                "query": query,
                "matches": matches,
            },
            status=status.HTTP_200_OK,
        )


class AssayIntakeCreateView(APIView):
    def post(self, request):
        data = request.data

        assay_type = (data.get("assayType") or "").strip()
        name = (data.get("name") or "").strip()
        email = (data.get("email") or "").strip()
        phone = (data.get("phone") or "").strip()
        contact_preference = (data.get("contactPreference") or "").strip()
        reason = (data.get("reason") or "").strip()

        if not name or not email or not reason:
            return Response(
                {"message": "Name, Email, and Reason are required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if contact_preference == "call" and not phone:
            return Response(
                {"message": "Phone is required when preferred contact is call."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        subject = f"New Assay Intake: {assay_type or 'N/A'}"
        html_body = build_assay_intake_email_html(
            assay_type=assay_type or "N/A",
            name=name,
            email=email,
            phone=phone or "N/A",
            contact_preference=contact_preference or "N/A",
            reason=reason,
        )

        recipients_raw = os.environ.get("SALES_TO_EMAIL") or getattr(settings, "SALES_TO_EMAIL", "")
        recipients = [email.strip() for email in recipients_raw.split(",") if email.strip()]
        if not recipients:
            recipients = ["info@biopathogenix.com"]

        try:
            if getattr(settings, "GRAPH_ENABLED", False):
                send_graph_email(
                    recipients,
                    subject,
                    html_body=html_body,
                    text_body=strip_tags(html_body),
                    from_email=getattr(settings, "DEFAULT_FROM_EMAIL", None),
                )
            else:
                send_mail(
                    subject=subject,
                    message=strip_tags(html_body),
                    from_email=getattr(settings, "DEFAULT_FROM_EMAIL", None),
                    recipient_list=recipients,
                    html_message=html_body,
                    fail_silently=False,
                )
        except Exception as exc:
            logger.exception("Failed to send assay intake email")
            return Response(
                {"message": "Failed to send email", "error": str(exc)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        return Response(
            {"message": "Submitted and emailed successfully"},
            status=status.HTTP_201_CREATED,
        )
