import { Button } from "@/src/components/Button";

export function StepControls({
  canBack,
  canNext,
  isLast,
  onBack,
  onNext,
}: {
  canBack: boolean;
  canNext: boolean;
  isLast: boolean;
  onBack: () => void;
  onNext: () => void;
}) {
  return (
    <div className="mt-6 flex items-center justify-between">
      <Button variant="outline" size="sm" onClick={onBack} disabled={!canBack}>
        Back
      </Button>
      <Button variant="accent" size="sm" onClick={onNext} disabled={!canNext}>
        {isLast ? "Save Profile" : "Continue"}
      </Button>
    </div>
  );
}


