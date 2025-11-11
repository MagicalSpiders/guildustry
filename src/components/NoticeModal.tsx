import { Icon } from "@iconify/react";
import React, { useEffect, useState } from "react";

type NoticeVariant = "success" | "error" | "info";

interface NoticeModalProps {
	open: boolean;
	title: string;
	description?: string;
	variant?: NoticeVariant;
	primaryAction?: { label: string; onClick: () => void };
	secondaryAction?: { label: string; onClick: () => void };
	onClose: () => void;
}

const variantIcon: Record<NoticeVariant, string> = {
	success: "lucide:check-circle-2",
	error: "lucide:alert-triangle",
	info: "lucide:info",
};

export function NoticeModal({
	open,
	title,
	description,
	variant = "info",
	primaryAction,
	secondaryAction,
	onClose,
}: NoticeModalProps) {
	const [isVisible, setIsVisible] = useState(false);
	const [shouldRender, setShouldRender] = useState(false);

	// Handle mount/unmount with fade transitions
	useEffect(() => {
		if (open) {
			setShouldRender(true);
			// Small delay to trigger fade-in after render
			setTimeout(() => setIsVisible(true), 10);
		} else {
			setIsVisible(false);
			// Wait for fade-out animation before unmounting
			const timer = setTimeout(() => setShouldRender(false), 200);
			return () => clearTimeout(timer);
		}
	}, [open]);

	if (!shouldRender) return null;

	return (
		<div className="fixed inset-0 z-[60] flex items-center justify-center">
			{/* Backdrop */}
			<div
				className={`absolute inset-0 bg-black/60 transition-opacity duration-200 ${
					isVisible ? "opacity-100" : "opacity-0"
				}`}
				aria-hidden="true"
				onClick={onClose}
			/>

			{/* Modal */}
			<div
				className={`relative z-[61] w-full max-w-md rounded-2xl border border-subtle bg-surface p-6 shadow-elevated transition-all duration-200 ${
					isVisible
						? "opacity-100 scale-100"
						: "opacity-0 scale-95"
				}`}
			>
				<div className="flex items-start gap-3">
					<div className="flex-shrink-0 mt-0.5">
						<span className="inline-flex items-center justify-center rounded-lg bg-main-accent/10 text-main-accent p-2">
							<Icon icon={variantIcon[variant]} className="w-5 h-5" />
						</span>
					</div>
					<div className="flex-1 min-w-0">
						<h3 className="text-lg font-title font-bold text-main-text">
							{title}
						</h3>
						{description ? (
							<p className="mt-2 text-sm text-main-light-text">{description}</p>
						) : null}
					</div>
				</div>

				<div className="mt-6 flex items-center justify-end gap-3">
					{secondaryAction ? (
						<button
							type="button"
							onClick={secondaryAction.onClick}
							className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-subtle bg-surface hover:border-main-accent hover:text-main-accent transition-colors text-sm font-medium"
						>
							{secondaryAction.label}
						</button>
					) : (
						<button
							type="button"
							onClick={onClose}
							className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-subtle bg-surface hover:border-main-accent hover:text-main-accent transition-colors text-sm font-medium"
						>
							Close
						</button>
					)}

					{primaryAction ? (
						<button
							type="button"
							onClick={primaryAction.onClick}
							className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-main-accent text-neutral-900 font-medium hover:opacity-90 transition-opacity"
						>
							{primaryAction.label}
						</button>
					) : null}
				</div>
			</div>
		</div>
	);
}


