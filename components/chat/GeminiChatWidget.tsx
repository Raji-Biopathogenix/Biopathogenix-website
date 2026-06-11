"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";

type ChatMessage = {
  role: "user" | "assistant";
  text: string | undefined;
};

function renderMessageWithLinks(message: string) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const exactUrlRegex = /^https?:\/\/[^\s]+$/;
  const parts = message.split(urlRegex);

  return parts.map((part, index) => {
    if (exactUrlRegex.test(part)) {
      return (
        <a
          key={`link-${index}`}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="break-all text-[#0b76d1] underline"
        >
          {part}
        </a>
      );
    }

    return <span key={`text-${index}`}>{part}</span>;
  });
}

export default function GeminiChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      text:
        "Hello! I am the BioPathogenix assistant. I can help with products, services, and documentation, or connect you with our team.",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagePanelRef = useRef<HTMLDivElement | null>(null);

  const quickActions = useMemo(
    () => [
      { label: "Shop products", text: "Share the shop link." },
      { label: "Contact support", text: "How can I contact support?" },
      { label: "Quality control", text: "Show quality control resources." },
      { label: "FAQs", text: "Where can I find FAQs?" },
    ],
    []
  );

  useEffect(() => {
    if (!messagePanelRef.current) {
      return;
    }
    messagePanelRef.current.scrollTop = messagePanelRef.current.scrollHeight;
  }, [messages, isLoading]);

  const sendMessage = async (messageText: string) => {
    const trimmed = messageText.trim();
    if (!trimmed || isLoading) {
      return;
    }

    const nextMessages: ChatMessage[] = [...messages, { role: "user", text: trimmed }];
    setMessages(nextMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/gemini-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const data = (await response.json()) as { reply?: string };
      if (!data.reply) {
        throw new Error("No reply returned from Gemini");
      }

      setMessages((prev) => [...prev, { role: "assistant", text: data.reply },]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "I could not respond right now. Please try again in a moment or contact support.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void sendMessage(input);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {isOpen ? (
        <div className="bpx-chat-panel w-[360px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-3xl border border-[#d5e3f2] bg-white shadow-[0_24px_60px_rgba(10,40,70,0.22)]">
          <div className="flex items-center justify-between border-b border-[#e1edf8] bg-[linear-gradient(120deg,#f2f7fc_0%,#ffffff_70%)] px-4 py-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#2a4c6b]">
                BioPathogenix
              </p>
              <div className="mt-1 flex items-center gap-2 text-xs text-[#5a748d]">
                <span className="h-2 w-2 rounded-full bg-[#1f9d55]" aria-hidden />
                Available to help
              </div>
            </div>
            <button
              type="button"
              aria-label="Close chat"
              onClick={() => setIsOpen(false)}
              className="rounded-full border border-transparent bg-[#e7f1fb] px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#2a4c6b] transition hover:border-[#cbdff1]"
            >
              Close
            </button>
          </div>

          <div className="border-b border-[#eef4fb] bg-white px-4 py-3">
            <p className="text-xs text-[#6a7f94]">Quick actions</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {quickActions.map((action) => (
                <button
                  key={action.label}
                  type="button"
                  onClick={() => void sendMessage(action.text)}
                  disabled={isLoading}
                  className="rounded-full border border-[#d5e3f2] bg-white px-3 py-1.5 text-xs font-medium text-[#2a4c6b] transition hover:border-[#0b2e4f] hover:text-[#0b2e4f] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {action.label}
                </button>
              ))}
            </div>
          </div>

          <div
            ref={messagePanelRef}
            className="h-80 space-y-3 overflow-y-auto bg-[linear-gradient(180deg,#fbfdff_0%,#f5f9ff_100%)] px-4 py-4"
          >
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-[0_10px_30px_rgba(15,45,75,0.06)] ${
                  message.role === "user"
                    ? "ml-auto bg-[#0b2e4f] text-white"
                    : "mr-auto border border-[#d5e3f2] bg-white text-[#21364b]"
                }`}
              >
                {message?.text && <div className="whitespace-pre-wrap">{renderMessageWithLinks(message?.text)}</div>}
              </div>
            ))}
            {isLoading ? (
              <div className="mr-auto max-w-[85%] rounded-2xl border border-[#d5e3f2] bg-white px-4 py-2.5 text-sm text-[#59738d]">
                Thinking...
              </div>
            ) : null}
          </div>

          <form onSubmit={handleSubmit} className="flex gap-2 border-t border-[#e1edf8] bg-white px-4 py-4">
            <div className="flex-1">
              <label htmlFor="bpx-chat-input" className="sr-only">
                Message
              </label>
              <input
                id="bpx-chat-input"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Ask about products, services, or orders..."
                className="w-full rounded-2xl border border-[#d5e3f2] bg-[#f8fbff] px-4 py-2 text-sm text-[#21364b] outline-none transition focus:border-[#0b2e4f]"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="rounded-2xl bg-[#0b2e4f] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#11406b] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Send
            </button>
          </form>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="rounded-full border border-[#d5e3f2] bg-[linear-gradient(120deg,#0b2e4f_0%,#1b4c79_100%)] px-5 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-white shadow-[0_18px_40px_rgba(11,46,79,0.35)] transition hover:translate-y-[-1px] hover:shadow-[0_22px_44px_rgba(11,46,79,0.35)]"
        >
          Chat with BPX
        </button>
      )}
    </div>
  );
}
