import { useFormContext } from "react-hook-form";
import { useState } from "react";

export function ResumeStep() {
  const { setValue, watch } = useFormContext();
  const resumeUrl = watch("resume_file_url");
  const [hover, setHover] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    // Store the file temporarily - will be uploaded when form is submitted
    setValue("resumeFile", file, { shouldDirty: true });
  };

  return (
    <div>
      <label className="block text-sm font-medium mb-2 text-main-light-text">Resume</label>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setHover(true);
        }}
        onDragLeave={() => setHover(false)}
        onDrop={(e) => {
          e.preventDefault();
          setHover(false);
          const file = e.dataTransfer.files?.[0];
          if (file) handleFileSelect(file);
        }}
        className={`rounded-2xl border border-dashed ${
          hover ? "border-main-accent" : "border-subtle"
        } bg-light-bg p-8 text-center`}
      >
        <input
          id="resume-input"
          type="file"
          accept=".pdf,.doc,.docx"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFileSelect(file);
          }}
        />
        <label htmlFor="resume-input" className="cursor-pointer text-main-accent">
          Click to upload or drag and drop
        </label>
        <p className="mt-2 text-xs text-main-light-text">PDF, DOC, or DOCX (max 5MB)</p>
        {selectedFile && (
          <p className="mt-3 text-sm text-main-text">Selected: {selectedFile.name}</p>
        )}
        {resumeUrl && !selectedFile && (
          <p className="mt-3 text-sm text-main-accent">✓ Resume uploaded</p>
        )}
      </div>
    </div>
  );
}


