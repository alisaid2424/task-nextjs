import { Dialog, DialogContent } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { DialogTitle } from "@radix-ui/react-dialog";
import { AlarmClock } from "lucide-react";
import { useEffect } from "react";
import { QuestionStepper } from "./QuestionStepper";
import { Lesson } from "@/types";

interface QuestionDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  lesson: Lesson | null;
  timer: number;
  setTimer: React.Dispatch<React.SetStateAction<number>>;
  onAnswer: (qIndex: number, optIndex: number) => void;
  answers: number[];
}

export function QuestionDialog({
  open,
  setOpen,
  lesson,
  timer,
  setTimer,
  onAnswer,
  answers,
}: QuestionDialogProps) {
  useEffect(() => {
    if (!open) return;

    const countdown = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(countdown);
          setOpen(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdown);
  }, [open, setTimer, setOpen]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="fixed z-50 sm:max-w-md w-[90%] max-h-[550px] rounded-2xl shadow-2xl p-0 bg-blue-700 overflow-auto flex flex-col space-y-3 py-3">
        <VisuallyHidden>
          <DialogTitle>Lesson Questions</DialogTitle>
        </VisuallyHidden>
        <div className="flex items-center gap-3 mx-auto w-fit bg-yellow-400 text-white px-5 py-2 rounded-md text-base font-semibold shadow-md">
          <AlarmClock className="h-5 w-5" />
          {timer > 0
            ? new Date(timer * 1000).toISOString().substr(14, 5)
            : "--:--"}
        </div>

        {lesson && lesson.questions && (
          <QuestionStepper
            questions={lesson.questions}
            answers={answers}
            onAnswer={onAnswer}
            onClose={() => setOpen(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
