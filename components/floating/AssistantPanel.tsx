"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, SendHorizontal, X } from "lucide-react";
import { answer, GREETING, type AssistantReply } from "@/lib/assistant/answer";

interface Message {
  id: number;
  from: "bot" | "user";
  text: string;
  links?: AssistantReply["links"];
  suggestions?: AssistantReply["suggestions"];
}

const isExternal = (href: string) => /^(https?:|tel:|mailto:)/.test(href);

/** The logo's "A" with the tick, on a white disc */
export function AssistantAvatar({ size = 36 }: { size?: number }) {
  return (
    <span
      className="flex shrink-0 items-center justify-center rounded-full bg-white shadow-[0_4px_14px_-6px_rgba(16,64,44,0.5)] ring-1 ring-brand-500/25"
      style={{ width: size, height: size }}
    >
      <Image
        src="/images/logo-mark.png"
        alt=""
        width={166}
        height={130}
        className="h-auto"
        style={{ width: size * 0.62 }}
      />
    </span>
  );
}

/**
 * AssistantPanel — the chat window. Replies come from lib/assistant/answer,
 * which answers from the site's own content. State lives in the parent so the
 * conversation survives closing the panel and moving between pages.
 */
export default function AssistantPanel({
  messages,
  setMessages,
  onClose,
}: {
  messages: Message[];
  setMessages: (update: (prev: Message[]) => Message[]) => void;
  onClose: () => void;
}) {
  const [draft, setDraft] = useState("");
  const [typing, setTyping] = useState(false);
  const logRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const nextId = useRef(messages.length + 1);
  const timer = useRef<ReturnType<typeof setTimeout>>();

  // Focus the input on open; Escape closes
  useEffect(() => {
    inputRef.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      clearTimeout(timer.current);
    };
  }, [onClose]);

  // Keep the newest message in view
  useEffect(() => {
    const log = logRef.current;
    if (log) log.scrollTo({ top: log.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  const ask = (text: string) => {
    const question = text.trim();
    if (!question || typing) return;
    setMessages((prev) => [...prev, { id: nextId.current++, from: "user", text: question }]);
    setDraft("");
    setTyping(true);
    // a short beat so the reply reads as a response, not a flicker
    timer.current = setTimeout(() => {
      const reply = answer(question);
      setMessages((prev) => [...prev, { id: nextId.current++, from: "bot", ...reply }]);
      setTyping(false);
    }, 650);
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    ask(draft);
  };

  const lastBot = [...messages].reverse().find((m) => m.from === "bot");

  return (
    <div
      role="dialog"
      aria-label="AuditExpert assistant"
      className="glass-strong fixed inset-x-3 bottom-3 z-[95] flex max-h-[min(82svh,640px)] flex-col overflow-hidden rounded-3xl border border-fg-50/10 sm:inset-x-auto sm:bottom-6 sm:right-6 sm:w-[390px]"
      style={{ animation: "dialog-in 0.45s cubic-bezier(0.22, 1, 0.36, 1) both", transformOrigin: "bottom right" }}
    >
      {/* Header */}
      <div className="flex shrink-0 items-center gap-3 bg-gradient-to-r from-brand-600 to-brand-700 px-5 py-4 text-white">
        <AssistantAvatar size={40} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">AuditExpert Assistant</p>
          <p className="flex items-center gap-1.5 text-[11px] text-white/85">
            <span className="h-1.5 w-1.5 animate-pulse-soft rounded-full bg-brand-200" aria-hidden="true" />
            Answers from this website
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close chat"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 transition-colors hover:bg-white/25"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      {/* Conversation */}
      <div ref={logRef} role="log" aria-live="polite" className="min-h-0 flex-1 space-y-3 overflow-y-auto overscroll-contain px-4 py-4">
        {messages.map((m) =>
          m.from === "user" ? (
            <div key={m.id} className="flex justify-end">
              <p className="max-w-[82%] rounded-2xl rounded-br-md bg-brand-600 px-4 py-2.5 text-sm leading-relaxed text-white">
                {m.text}
              </p>
            </div>
          ) : (
            <div key={m.id} className="flex items-end gap-2">
              <AssistantAvatar size={26} />
              <div className="max-w-[86%] space-y-2">
                <p className="whitespace-pre-line rounded-2xl rounded-bl-md border border-fg-50/10 bg-white px-4 py-2.5 text-sm leading-relaxed text-fg-100">
                  {m.text}
                </p>
                {m.links && (
                  <div className="flex flex-wrap gap-1.5">
                    {m.links.map((l) =>
                      isExternal(l.href) ? (
                        <a
                          key={l.href}
                          href={l.href}
                          target={l.href.startsWith("http") ? "_blank" : undefined}
                          rel={l.href.startsWith("http") ? "noopener noreferrer" : undefined}
                          className="inline-flex items-center gap-1 rounded-full bg-brand-100 px-3 py-1.5 text-xs font-semibold text-accent transition-colors hover:bg-brand-200"
                        >
                          {l.label}
                          <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
                        </a>
                      ) : (
                        <Link
                          key={l.href}
                          href={l.href}
                          className="inline-flex items-center gap-1 rounded-full bg-brand-100 px-3 py-1.5 text-xs font-semibold text-accent transition-colors hover:bg-brand-200"
                        >
                          {l.label}
                          <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
                        </Link>
                      )
                    )}
                  </div>
                )}
              </div>
            </div>
          )
        )}

        {typing && (
          <div className="flex items-end gap-2" aria-label="Assistant is typing">
            <AssistantAvatar size={26} />
            <p className="flex gap-1 rounded-2xl rounded-bl-md border border-fg-50/10 bg-white px-4 py-3.5">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="h-1.5 w-1.5 animate-bounce rounded-full bg-brand-500"
                  style={{ animationDelay: `${i * 0.14}s` }}
                />
              ))}
            </p>
          </div>
        )}
      </div>

      {/* Quick replies for the latest answer */}
      {!typing && lastBot?.suggestions && (
        <div className="no-scrollbar flex shrink-0 gap-1.5 overflow-x-auto border-t border-fg-50/10 px-4 py-2.5">
          {lastBot.suggestions.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => ask(s)}
              className="shrink-0 rounded-full border border-brand-500/35 bg-white px-3 py-1.5 text-xs font-medium text-fg-100 transition-colors hover:border-brand-500 hover:text-accent"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Composer */}
      <form onSubmit={onSubmit} className="flex shrink-0 items-center gap-2 border-t border-fg-50/10 bg-white/70 p-3">
        <label htmlFor="assistant-input" className="sr-only">
          Ask a question
        </label>
        <input
          id="assistant-input"
          ref={inputRef}
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Ask about plans, pricing, process…"
          autoComplete="off"
          maxLength={300}
          className="min-w-0 flex-1 rounded-full border border-fg-50/15 bg-white px-4 py-2.5 text-sm text-fg-50 outline-none transition-colors placeholder:text-fg-400/70 focus:border-brand-500"
        />
        <button
          type="submit"
          disabled={!draft.trim() || typing}
          aria-label="Send"
          className="btn-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
        >
          <SendHorizontal className="h-4 w-4" aria-hidden="true" />
        </button>
      </form>
    </div>
  );
}

export type { Message };
export const INITIAL_MESSAGES: Message[] = [{ id: 0, from: "bot", ...GREETING }];
