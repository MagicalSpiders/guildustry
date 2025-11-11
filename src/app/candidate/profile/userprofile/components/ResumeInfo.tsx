import { Icon } from "@iconify/react";
import type { ProfileFormValues } from "@/src/app/profile/schema";

interface ResumeInfoProps {
  data: ProfileFormValues;
}

export function ResumeInfo({ data }: ResumeInfoProps) {
  if (!data.resume_file_url) {
    return (
      <div className="rounded-2xl border border-subtle bg-surface p-6 shadow-elevated">
        <h2 className="text-xl font-title font-bold mb-4 flex items-center gap-2">
          <Icon icon="lucide:file-text" className="w-5 h-5 text-main-accent" />
          Resume
        </h2>
        <p className="text-sm text-main-light-text">No resume uploaded.</p>
      </div>
    );
  }

  const fileName = data.resume_file_url.split('/').pop() || 'Resume';

  return (
    <div className="rounded-2xl border border-subtle bg-surface p-6 shadow-elevated">
      <h2 className="text-xl font-title font-bold mb-6 flex items-center gap-2">
        <Icon icon="lucide:file-text" className="w-5 h-5 text-main-accent" />
        Resume
      </h2>
      <div className="flex items-center gap-4 p-4 rounded-lg border border-subtle bg-light-bg">
        <div className="flex-shrink-0">
          <div className="inline-flex items-center justify-center rounded-lg bg-main-accent/10 text-main-accent p-3">
            <Icon icon="lucide:file" className="w-6 h-6" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-main-text mb-1">Resume File</p>
          <p className="text-xs text-main-light-text break-words">{fileName}</p>
        </div>
        <div className="flex-shrink-0">
          <a 
            href={data.resume_file_url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-subtle bg-surface hover:border-main-accent hover:text-main-accent transition-colors text-sm font-medium"
          >
            <Icon icon="lucide:download" className="w-4 h-4" />
            Download
          </a>
        </div>
      </div>
    </div>
  );
}

