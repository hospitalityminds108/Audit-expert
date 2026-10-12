"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { MessageCircle, Phone, X } from "lucide-react";
import { siteConfig } from "@/data/site";
import AssistantPanel, { AssistantAvatar, INITIAL_MESSAGES, type Message } from "./AssistantPanel";

function WhatsAppIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}

/** Label beside a button: slides out on hover (desktop); always shown in the open phone dock */
function Label({ children, always = false }: { children: string; always?: boolean }) {
  return (
    <span
      className={`pointer-events-none absolute right-full mr-3 origin-right whitespace-nowrap rounded-full bg-white px-3.5 py-2 text-xs font-semibold text-fg-50 shadow-[0_10px_30px_-14px_rgba(16,64,44,0.6)] ring-1 ring-fg-50/10 transition-all duration-300 ease-premium ${
        always
          ? "xl:translate-x-2 xl:scale-95 xl:opacity-0 xl:group-hover:translate-x-0 xl:group-hover:scale-100 xl:group-hover:opacity-100 xl:group-focus-visible:translate-x-0 xl:group-focus-visible:scale-100 xl:group-focus-visible:opacity-100"
          : "hidden"
      }`}
    >
      {children}
    </span>
  );
}

/**
 * FloatingActions — WhatsApp, call and the site assistant, docked bottom-right.
 *
 * Wide screens (xl+): the three buttons are always visible, sized to fit the
 * page gutter so they never sit over content.
 * Phones, tablets and small laptops: one compact launcher instead of a column;
 * tapping it fans the three actions out with their labels.
 */
export default function FloatingActions() {
  const [chatOpen, setChatOpen] = useState(false);
  const [chatOpened, setChatOpened] = useState(false);
  const [dockOpen, setDockOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const pathname = usePathname();
  const closeChat = useCallback(() => setChatOpen(false), []);

  useEffect(() => {
    if (chatOpen) setChatOpened(true);
  }, [chatOpen]);

  // the phone dock folds away on navigation
  useEffect(() => {
    setDockOpen(false);
  }, [pathname]);

  const openChat = () => {
    setDockOpen(false);
    setChatOpen(true);
  };

  // phone: actions are hidden until the launcher is opened; desktop: always shown
  const actionCls = (delay: string) =>
    `fab group ${dockOpen ? "flex" : "hidden"} xl:flex xl:!h-11 xl:!w-11 min-[1440px]:!h-[3.25rem] min-[1440px]:!w-[3.25rem] ${delay}`;

  return (
    <>
      {chatOpen && <AssistantPanel messages={messages} setMessages={setMessages} onClose={closeChat} />}

      {/* phone: dim the page behind the open dock so the labels read clearly */}
      {dockOpen && (
        <button
          type="button"
          aria-label="Close contact options"
          onClick={() => setDockOpen(false)}
          className="fixed inset-0 z-[74] bg-white/70 backdrop-blur-sm xl:hidden"
          style={{ animation: "scrim-in 0.25s ease-out both" }}
        />
      )}

      <div
        className={`fixed bottom-4 right-3 z-[75] flex flex-col items-end gap-3 transition-all duration-300 xl:bottom-6 xl:right-1.5 min-[1440px]:right-3 2xl:right-6 ${
          chatOpen ? "pointer-events-none translate-y-3 opacity-0" : "opacity-100"
        }`}
        aria-hidden={chatOpen}
      >
        <a
          href={siteConfig.whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Chat on WhatsApp, ${siteConfig.whatsapp}`}
          tabIndex={chatOpen ? -1 : undefined}
          className={`${actionCls("[animation-delay:60ms] xl:[animation-delay:900ms]")} bg-[#25D366] text-white [--fab-glow:rgba(37,211,102,0.55)]`}
        >
          <Label always>WhatsApp us</Label>
          <WhatsAppIcon className="fab-wiggle h-6 w-6" />
        </a>

        <a
          href={siteConfig.phoneHref}
          aria-label={`Call us, ${siteConfig.phone}`}
          tabIndex={chatOpen ? -1 : undefined}
          className={`${actionCls("[animation-delay:30ms] xl:[animation-delay:1020ms]")} bg-[#0B1F3A] text-white [--fab-glow:rgba(11,31,58,0.5)]`}
        >
          <Label always>{`Call ${siteConfig.phone}`}</Label>
          <Phone className="fab-ring h-5 w-5" aria-hidden="true" />
        </a>

        <button
          type="button"
          onClick={openChat}
          aria-label="Open the AuditExpert assistant"
          aria-haspopup="dialog"
          tabIndex={chatOpen ? -1 : undefined}
          className={`${actionCls("xl:[animation-delay:1140ms]")} bg-gradient-to-br from-brand-500 to-brand-700 [--fab-glow:rgba(11,132,85,0.6)]`}
        >
          <Label always>Ask the assistant</Label>
          {!chatOpened && <span className="fab-pulse" aria-hidden="true" />}
          <AssistantAvatar size={34} />
          <span
            className="absolute -right-0.5 -top-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-brand-300"
            aria-hidden="true"
          />
        </button>

        {/* phone launcher */}
        <button
          type="button"
          onClick={() => setDockOpen((o) => !o)}
          aria-label={dockOpen ? "Close contact options" : "Contact options: WhatsApp, call, assistant"}
          aria-expanded={dockOpen}
          tabIndex={chatOpen ? -1 : undefined}
          className="fab flex bg-gradient-to-br from-brand-500 to-brand-700 text-white [--fab-glow:rgba(11,132,85,0.6)] xl:hidden"
        >
          {!dockOpen && !chatOpened && <span className="fab-pulse" aria-hidden="true" />}
          {dockOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <MessageCircle className="h-6 w-6" aria-hidden="true" />}
        </button>
      </div>
    </>
  );
}
