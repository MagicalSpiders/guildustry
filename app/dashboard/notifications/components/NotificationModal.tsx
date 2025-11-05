"use client";

import { useEffect, useRef } from "react";
import { Icon } from "@iconify/react";
import { Button } from "@/src/components/Button";

export type NotificationKind = "interview" | "message" | "status" | "reminder";

export interface NotificationItemData {
  id: string;
  kind: NotificationKind;
  company: string;
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
}

export function NotificationModal({
  open,
  item,
  onClose,
  onMarkRead,
  onDelete,
}: {
  open: boolean;
  item: NotificationItemData | null;
  onClose: () => void;
  onMarkRead: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open || !item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div
        ref={panelRef}
        className="relative w-full max-w-2xl rounded-2xl border border-subtle bg-surface shadow-elevated p-6"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-title font-bold text-main-text">{item.title}</h2>
              <span className={`text-xs px-2 py-0.5 rounded-full border ${
                item.kind === "interview"
                  ? "border-main-accent text-main-accent"
                  : "border-subtle text-main-light-text"
              }`}>
                {item.kind.charAt(0).toUpperCase() + item.kind.slice(1)}
              </span>
            </div>
            <p className="mt-1 text-sm text-main-light-text">{item.company}</p>
          </div>
          <button
            className="inline-flex items-center justify-center rounded-lg border border-subtle bg-surface p-2 hover:border-main-accent hover:text-main-accent"
            aria-label="Close"
            onClick={onClose}
          >
            <Icon icon="lucide:x" className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4">
          <p className="text-sm leading-relaxed text-main-text whitespace-pre-wrap">{item.body}</p>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          {!item.read && (
            <button
              className="text-sm inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-subtle bg-surface hover:border-main-accent hover:text-main-accent transition-colors"
              onClick={() => onMarkRead(item.id)}
            >
              <Icon icon="lucide:check" className="w-4 h-4" /> Mark as Read
            </button>
          )}
          <button
            className="text-sm inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-subtle bg-surface hover:border-main-accent hover:text-main-accent transition-colors"
            onClick={() => onDelete(item.id)}
          >
            <Icon icon="lucide:trash-2" className="w-4 h-4" /> Delete
          </button>
          <Button variant="accent" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}


