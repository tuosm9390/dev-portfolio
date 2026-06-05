"use client";
// 헤더 ask me 트리거로 열리는 포트폴리오 AI 채팅 팝업이다

import { AnimatePresence, motion } from "framer-motion";
import { FormEvent, ReactNode, useEffect, useRef, useState } from "react";

type ChatMessage = {
  role: "user" | "assistant";
  text: string;
};

type PortfolioAssistantIslandProps = {
  triggerLabel: string;
  triggerClassName?: string;
  triggerDataAttribute?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  renderTrigger?: (open: () => void) => ReactNode;
};

function useControllableOpen(open: boolean | undefined, onOpenChange: ((open: boolean) => void) | undefined) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = open !== undefined;
  const actualOpen = isControlled ? open : internalOpen;

  const setOpen = (nextOpen: boolean) => {
    if (!isControlled) setInternalOpen(nextOpen);
    onOpenChange?.(nextOpen);
  };

  return [actualOpen, setOpen] as const;
}

export default function PortfolioAssistantIsland({
  triggerLabel,
  triggerClassName,
  triggerDataAttribute,
  open,
  onOpenChange,
  renderTrigger,
}: PortfolioAssistantIslandProps) {
  const [isOpen, setIsOpen] = useControllableOpen(open, onOpenChange);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    inputRef.current?.focus();
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [setIsOpen]);

  const openIsland = () => setIsOpen(true);

  async function submitMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const message = input.trim();
    if (!message || isLoading) return;

    setMessages((current) => [...current, { role: "user", text: message }]);
    setInput("");
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      const result = (await response.json()) as { answer?: string; message?: string };

      setMessages((current) => [
        ...current,
        { role: "assistant", text: result.answer || result.message || "응답을 불러오지 못했습니다." },
      ]);
    } catch {
      setError("응답을 불러오지 못했습니다.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      {renderTrigger ? (
        renderTrigger(openIsland)
      ) : (
        <button
          type="button"
          data-assistant-trigger={triggerDataAttribute}
          onClick={openIsland}
          className={triggerClassName}
        >
          {triggerLabel}
        </button>
      )}

      <AnimatePresence>
        {isOpen && (
          <motion.section
            role="dialog"
            aria-label="Portfolio assistant"
            initial={{ opacity: 0, y: -18, width: 220, borderRadius: 999 }}
            animate={{ opacity: 1, y: 0, width: "min(92vw, 520px)", borderRadius: 28 }}
            exit={{ opacity: 0, y: -18, width: 220, borderRadius: 999 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="fixed left-1/2 top-5 z-[70] -translate-x-1/2 overflow-hidden border border-black/10 bg-black text-white shadow-2xl font-mono"
          >
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-3">
              <span className="text-[10px] uppercase tracking-[0.2em] text-white/55">ask me!</span>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-[10px] uppercase tracking-widest text-white/60 hover:text-white"
              >
                Close
              </button>
            </div>

            <div className="max-h-[52vh] min-h-28 space-y-3 overflow-y-auto px-5 py-4 text-xs leading-6" aria-live="polite">
              {messages.length === 0 ? (
                <p className="text-white/55">포트폴리오 프로젝트, 기술 스택, 협업 범위에 대해 물어보세요.</p>
              ) : (
                messages.map((message, index) => (
                  <div
                    key={`${message.role}-${index}`}
                    className={message.role === "user" ? "text-right text-white" : "text-left text-white/75"}
                  >
                    {message.text}
                  </div>
                ))
              )}
              {isLoading && <p className="text-white/45">생성 중...</p>}
              {error && <p className="text-red-200">{error}</p>}
            </div>

            <form onSubmit={submitMessage} className="flex gap-2 border-t border-white/10 p-3">
              <textarea
                ref={inputRef}
                autoFocus
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="포트폴리오에 대해 물어보세요"
                rows={2}
                className="min-h-12 flex-1 resize-none rounded-2xl border border-white/10 bg-white/10 px-3 py-2 text-xs leading-5 text-white outline-none placeholder:text-white/35"
              />
              <div className="flex flex-col gap-2">
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="rounded-full bg-white px-4 py-2 text-[10px] font-semibold uppercase tracking-widest text-black disabled:opacity-30"
                >
                  Send
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMessages([]);
                    setInput("");
                  }}
                  className="text-[10px] uppercase tracking-widest text-white/45 hover:text-white"
                >
                  Clear
                </button>
              </div>
            </form>
          </motion.section>
        )}
      </AnimatePresence>
    </>
  );
}
