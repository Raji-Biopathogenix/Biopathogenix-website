from __future__ import annotations

import html
import re
from typing import TypedDict


class IntakeFormPayload(TypedDict):
    assayType: str
    title: str
    subtitle: str
    confirmation: str


SUPPORT_INTENT_PATTERN = re.compile(
    r"(quote|quotes|quotation|bulk(?:\s+price|\s+pricing)?|bulck(?:\s+price|\s+pricing)?|"
    r"volume\s+pricing|customer\s+support|customer\s+service|support|service|contact\s*form|"
    r"sales\s+team|assay\s+team|extraction\s+team|talk(?:\s+direct(?:ly)?)?\s+to\s+"
    r"(?:a\s+)?(?:person|human|agent|representative)|human\s+(?:agent|support)|"
    r"need\s+assistance|direct\s+person|sales|pricing)",
    re.IGNORECASE,
)

SALES_INTENT_PATTERN = re.compile(
    r"(quote|quotes|quotation|bulk(?:\s+price|\s+pricing)?|bulck(?:\s+price|\s+pricing)?|"
    r"volume\s+pricing|sales\s+team|sales|pricing)",
    re.IGNORECASE,
)

ASSAY_TEAM_INTENT_PATTERN = re.compile(r"(assay\s+team|extraction\s+team)", re.IGNORECASE)


def get_intake_form_intent(text: str) -> IntakeFormPayload | None:
    normalized = text.strip()
    if not normalized or not SUPPORT_INTENT_PATTERN.search(normalized):
        return None

    if SALES_INTENT_PATTERN.search(normalized):
        return {
            "assayType": "standard",
            "title": "Sales and Quote Request",
            "subtitle": "Share your details and our sales team will contact you within 24 hours.",
            "confirmation": (
                "I understand. Please fill out this contact form and our sales team will "
                "reach out with pricing details."
            ),
        }

    if ASSAY_TEAM_INTENT_PATTERN.search(normalized):
        return {
            "assayType": "custom",
            "title": "Assay and Extraction Team Request",
            "subtitle": "Share your details and our assay team will contact you within 24 hours.",
            "confirmation": (
                "Sure. Please fill out this contact form and I will connect you with the "
                "assay/extraction team."
            ),
        }

    return {
        "assayType": "standard",
        "title": "Customer Support Request",
        "subtitle": "Share your details and our support team will contact you within 24 hours.",
        "confirmation": (
            "Of course. Please fill out this contact form and a team member will reach you directly."
        ),
    }


def build_assay_intake_email_html(
    assay_type: str,
    name: str,
    email: str,
    phone: str,
    contact_preference: str,
    reason: str,
) -> str:
    assay_type = html.escape(assay_type)
    name = html.escape(name)
    email = html.escape(email)
    phone = html.escape(phone)
    contact_preference = html.escape(contact_preference)
    reason = html.escape(reason)

    return f"""
<div style="background:#f6f8fb;padding:20px;font-family:Arial,sans-serif;color:#1f2937;">
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:680px;margin:0 auto;background:#ffffff;border:1px solid #dbe4f0;border-radius:10px;overflow:hidden;">
    <tr>
      <td style="background:#0f4c81;color:#ffffff;padding:16px 20px;font-size:20px;font-weight:700;">
        New Assay Intake Submission
      </td>
    </tr>
    <tr>
      <td style="padding:20px;">
        <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;">
          <tr>
            <td style="padding:10px 0;border-bottom:1px solid #e8eef6;width:220px;font-weight:600;color:#0b3a63;">Assay Type</td>
            <td style="padding:10px 0;border-bottom:1px solid #e8eef6;">{assay_type}</td>
          </tr>
          <tr>
            <td style="padding:10px 0;border-bottom:1px solid #e8eef6;font-weight:600;color:#0b3a63;">Name</td>
            <td style="padding:10px 0;border-bottom:1px solid #e8eef6;">{name}</td>
          </tr>
          <tr>
            <td style="padding:10px 0;border-bottom:1px solid #e8eef6;font-weight:600;color:#0b3a63;">Email</td>
            <td style="padding:10px 0;border-bottom:1px solid #e8eef6;">{email}</td>
          </tr>
          <tr>
            <td style="padding:10px 0;border-bottom:1px solid #e8eef6;font-weight:600;color:#0b3a63;">Phone</td>
            <td style="padding:10px 0;border-bottom:1px solid #e8eef6;">{phone}</td>
          </tr>
          <tr>
            <td style="padding:10px 0;border-bottom:1px solid #e8eef6;font-weight:600;color:#0b3a63;">Preferred Contact</td>
            <td style="padding:10px 0;border-bottom:1px solid #e8eef6;">{contact_preference}</td>
          </tr>
        </table>

        <div style="margin-top:18px;padding:14px;background:#f8fbff;border:1px solid #e3edf9;border-radius:8px;">
          <div style="font-weight:600;color:#0b3a63;margin-bottom:6px;">What they are looking for</div>
          <div style="white-space:pre-wrap;line-height:1.55;">{reason}</div>
        </div>
      </td>
    </tr>
  </table>
</div>
"""
