import Heading from "../Heading";
import { Progress } from "@/components/ui/progress";

interface ProgressSectionProps {
  progress: number;
  answeredCount: number;
  totalQuestions: number;
}

export function ProgressSection({
  progress,
  answeredCount,
  totalQuestions,
}: ProgressSectionProps) {
  return (
    <div className="w-full">
      <Heading title="Course Progress" className="mb-4" />
      <Progress
        value={progress}
        className="h-3 bg-muted [&>div]:bg-green-500"
      />
      <p className="text-sm text-gray-600 mt-2">
        {answeredCount} / {totalQuestions} Questions Completed
      </p>
    </div>
  );
}
