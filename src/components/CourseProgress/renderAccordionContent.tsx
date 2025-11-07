import {
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Lesson, Week } from "@/types";
import { Plus, Minus, FileText, Lock } from "lucide-react";

interface RenderAccordionContentProps {
  idx: number;
  week: Week;
  completedLessons: string[];
  handleLessonClick: (lesson: Lesson) => void;
  getLessonKey: (weekTitle: string, lessonTitle: string) => string;
}

const renderAccordionContent = ({
  idx,
  week,
  completedLessons,
  handleLessonClick,
  getLessonKey,
}: RenderAccordionContentProps) => {
  return (
    <AccordionItem key={idx} value={`week-${idx}`} className="group">
      <AccordionTrigger className="flex items-center justify-between text-lg font-semibold hover:no-underline !outline-none !border-none focus:outline-none">
        <div>
          <h2 className="text-gray-800 mb-2">{week.title}</h2>
          {week.subtitle && (
            <p className="text-sm text-muted-foreground font-normal hidden md:block">
              {week.subtitle}
            </p>
          )}
        </div>
        <div className="ml-2 text-gray-800 ">
          <Plus className="w-5 h-5 group-data-[state=open]:hidden" />
          <Minus className="w-5 h-5 hidden group-data-[state=open]:block" />
        </div>
      </AccordionTrigger>

      <AccordionContent>
        <div className="mt-3 space-y-2">
          {week.lessons.map((lesson, i) => {
            const lessonKey = getLessonKey(week.title, lesson.title);
            const isCompleted = completedLessons.includes(lessonKey);

            return (
              <div
                key={i}
                onClick={() =>
                  !lesson.locked &&
                  !isCompleted &&
                  lesson.questions &&
                  handleLessonClick(lesson)
                }
                className={`flex justify-between items-center p-2 rounded-md border transition  gap-2 ${
                  lesson.locked
                    ? "opacity-50 cursor-not-allowed"
                    : isCompleted
                    ? "opacity-70 bg-green-50 cursor-not-allowed"
                    : "hover:bg-gray-50 cursor-pointer"
                }`}
              >
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-gray-600" />
                  <span className="text-sm">{lesson.title}</span>
                </div>

                {lesson.locked ? (
                  <Lock className="w-4 h-4 text-gray-400" />
                ) : isCompleted ? (
                  <span className="text-xs bg-green-200 text-green-800 px-2 py-0.5 rounded-md">
                    ✅ Completed
                  </span>
                ) : (
                  <div className="flex flex-col space-y-1">
                    {lesson.questions && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-md">
                        {lesson.questions.length} QUESTION
                      </span>
                    )}
                    {lesson.time && (
                      <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-md">
                        {lesson.time}
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default renderAccordionContent;
