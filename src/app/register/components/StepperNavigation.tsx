"use client";

interface StepperNavigationProps {
  step: number;
  totalSteps: number;
  onNext: () => void;
  onBack: () => void;
  onSubmit: () => void;
  loading?: boolean;
}

export default function StepperNavigation({
  step,
  totalSteps,
  onNext,
  onBack,
  onSubmit,
  loading,
}: StepperNavigationProps) {
  return (
    <div className="flex justify-between mt-6">
      {step > 1 && (
        <button
          onClick={onBack}
          className="px-4 py-2 rounded-xl bg-gray-700/50 hover:bg-gray-700/70 transition"
        >
          Back
        </button>
      )}
      {step < totalSteps ? (
        <button
          onClick={onNext}
          className="ml-auto px-4 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white transition"
        >
          Next
        </button>
      ) : (
        <button
          onClick={onSubmit}
          className="ml-auto px-4 py-2 rounded-xl bg-purple-500 hover:bg-purple-600 text-white transition"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      )}
    </div>
  );
}
