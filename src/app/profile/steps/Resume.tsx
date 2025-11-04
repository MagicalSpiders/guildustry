import { useFormContext } from "react-hook-form";
import { useState } from "react";

export function ResumeStep() {
  const { setValue, watch } = useFormContext();
  const fileName = watch("resumeFileName");
  const [hover, setHover] = useState(false);

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
          if (file) setValue("resumeFileName", file.name, { shouldDirty: true });
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
            if (file) setValue("resumeFileName", file.name, { shouldDirty: true });
          }}
        />
        <label htmlFor="resume-input" className="cursor-pointer text-main-accent">
          Click to upload or drag and drop
        </label>
        <p className="mt-2 text-xs text-main-light-text">PDF or DOC</p>
        {fileName && <p className="mt-3 text-sm">Selected: {fileName}</p>}
      </div>
    </div>
  );
}


