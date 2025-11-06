"use client";

import { useState, useEffect } from "react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { FileText, Lock, Plus, Minus, AlarmClock } from "lucide-react";
import Heading from "./Heading";
import { weeks } from "@/lib/constants";
import { useToast } from "@/hooks/use-toast";
import { DialogTitle } from "@radix-ui/react-dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Checkbox } from "./ui/checkbox";

interface Question {
  question: string;
  options: string[];
  correct: number;
}

interface Lesson {
  title: string;
  locked?: boolean;
  description: string;
  time?: string;
  questions?: Question[];
}

export default function CourseProgress() {
  const { toast } = useToast();
  const [progress, setProgress] = useState<number>(0);
  const [answeredCount, setAnsweredCount] = useState<number>(0);
  const [totalQuestions, setTotalQuestions] = useState<number>(0);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [accordionType, setAccordionType] = useState<"single" | "multiple">(
    "single"
  );
  const [defaultValue, setDefaultValue] = useState<string | string[]>("week-0");
  const [timer, setTimer] = useState<number>(0);

  // Count total questions on mount
  useEffect(() => {
    let count = 0;
    weeks.forEach((week) =>
      week.lessons.forEach((lesson) => {
        if (lesson.questions) count += lesson.questions.length;
      })
    );
    setTotalQuestions(count);
  }, []);

  // Load progress and completed lessons from sessionStorage
  useEffect(() => {
    const savedCompleted = sessionStorage.getItem("completedLessons");
    type LessonAnswers = Record<string, number[]>;
    const savedLessonAnswers: LessonAnswers = JSON.parse(
      sessionStorage.getItem("lessonAnswers") || "{}"
    );

    if (savedCompleted) setCompletedLessons(JSON.parse(savedCompleted));

    let count = 0;
    Object.entries(savedLessonAnswers).forEach(([lessonKey, lessonAns]) => {
      const lesson = weeks
        .flatMap((w) => w.lessons)
        .find((l) => getLessonKey(l.title, l.title) === lessonKey);

      if (lesson && lesson.questions) {
        lessonAns.forEach((ans: number, idx: number) => {
          if (ans === lesson.questions![idx].correct) count++;
        });
      }
    });
    setAnsweredCount(count);
  }, []);

  // Update progress
  useEffect(() => {
    if (totalQuestions > 0) {
      const percent = (answeredCount / totalQuestions) * 100;
      setProgress(percent);
      sessionStorage.setItem("courseProgress", percent.toString());
    }
  }, [answeredCount, totalQuestions]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setAccordionType("multiple");
        setDefaultValue(["week-0", "week-1", "week-2"]);
      } else {
        setAccordionType("single");
        setDefaultValue("week-0");
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!openDialog) return;

    const countdown = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(countdown);
          setOpenDialog(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdown);
  }, [openDialog]);

  // Unique key for each lesson
  const getLessonKey = (weekTitle: string, lessonTitle: string) =>
    `${weekTitle}-${lessonTitle}`;

  // When user opens a lesson
  const handleLessonClick = (lesson: Lesson) => {
    if (!lesson.questions) return;

    setSelectedLesson(lesson);
    setAnswers(new Array(lesson.questions.length).fill(-1));
    setOpenDialog(true);

    // Extract the actual time from the text
    if (lesson.time) {
      const match = lesson.time.match(/(\d+)\s*MINUTES?/i);
      if (match) {
        const minutes = parseInt(match[1], 10);
        setTimer(minutes * 60);
      } else {
        setTimer(0);
      }
    } else {
      setTimer(0);
    }
  };

  // When user answers a question
  const handleAnswer = (qIndex: number, optionIndex: number) => {
    if (!selectedLesson || !selectedLesson.questions) return;

    const lessonKey = getLessonKey(selectedLesson.title, selectedLesson.title);
    const savedLessonAnswers = JSON.parse(
      sessionStorage.getItem("lessonAnswers") || "{}"
    );
    const lessonAnswers: number[] = savedLessonAnswers[lessonKey] || [];

    const isAlreadyCorrect =
      lessonAnswers[qIndex] === selectedLesson.questions[qIndex].correct;

    lessonAnswers[qIndex] = optionIndex;
    savedLessonAnswers[lessonKey] = lessonAnswers;
    sessionStorage.setItem("lessonAnswers", JSON.stringify(savedLessonAnswers));

    setAnswers((prev) => {
      const updated = [...prev];
      updated[qIndex] = optionIndex;
      return updated;
    });

    const correct = selectedLesson.questions[qIndex].correct;

    if (optionIndex === correct) {
      toast({
        title: "Success! 🎉",
        description: "🎉 Great job! That’s the correct answer!",
        className: "bg-green-100 text-green-700",
      });

      if (!isAlreadyCorrect) {
        setAnsweredCount((prev) => prev + 1);
      }
    } else {
      toast({
        title: "Wrong answer",
        description: "😅 Not quite right. Keep trying — you’re learning!",
        className: "bg-red-100 text-red-700",
      });
    }

    if (
      selectedLesson.questions.every((_, i) => lessonAnswers[i] !== undefined)
    ) {
      if (!completedLessons.includes(lessonKey)) {
        const updatedCompleted = [...completedLessons, lessonKey];
        setCompletedLessons(updatedCompleted);
        sessionStorage.setItem(
          "completedLessons",
          JSON.stringify(updatedCompleted)
        );
      }
    }
  };

  // Render Accordion for a week
  const renderAccordionContent = (
    weekIndex: number,
    week: (typeof weeks)[number]
  ) => (
    <AccordionItem
      key={weekIndex}
      value={`week-${weekIndex}`}
      className="group"
    >
      <AccordionTrigger className="flex items-center justify-between text-lg font-semibold hover:no-underline !outline-none !border-none focus:outline-none">
        <div>
          <h2 className="text-gray-800 mb-2">{week.title}</h2>
          <p className="text-sm text-muted-foreground font-normal hidden md:block">
            {week.subtitle}
          </p>
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

  return (
    <div className="flex flex-col gap-8">
      {/* Progress Section */}
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

      {/* Lessons Accordion */}
      <div className="border rounded shadow-sm p-4 bg-white hover:shadow-md transition-all">
        {accordionType === "single" ? (
          <Accordion
            type="single"
            collapsible
            defaultValue={defaultValue as string}
            className="space-y-2"
          >
            {weeks.map((week, idx) => renderAccordionContent(idx, week))}
          </Accordion>
        ) : (
          <Accordion
            type="multiple"
            defaultValue={defaultValue as string[]}
            className="space-y-2"
          >
            {weeks.map((week, idx) => renderAccordionContent(idx, week))}
          </Accordion>
        )}
      </div>

      {/* Popup Dialog for Questions */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="fixed z-50 sm:max-w-md w-[90%] max-h-[550px] rounded-2xl shadow-2xl p-0 bg-blue-700 overflow-auto flex flex-col space-y-3 py-3">
          <VisuallyHidden>
            <DialogTitle>Lesson Questions</DialogTitle>
          </VisuallyHidden>

          {/* Timer */}
          <div className="flex items-center gap-3 mx-auto w-fit bg-yellow-400 text-white px-5 py-2 rounded-md text-base font-semibold shadow-md">
            <AlarmClock className="h-5 w-5" />
            {timer > 0
              ? new Date(timer * 1000).toISOString().substr(14, 5)
              : "--:--"}
          </div>

          {/* Question Section */}
          {selectedLesson && selectedLesson.questions && (
            <QuestionStepper
              questions={selectedLesson.questions}
              answers={answers}
              onAnswer={handleAnswer}
              onClose={() => setOpenDialog(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface QuestionStepperProps {
  questions: Question[];
  answers: number[];
  onAnswer: (qIndex: number, optIndex: number) => void;
  onClose: () => void;
}

function QuestionStepper({
  questions,
  answers,
  onAnswer,
  onClose,
}: QuestionStepperProps) {
  const [current, setCurrent] = useState(0);
  const q = questions[current];

  const handleNext = () => {
    if (current < questions.length - 1) {
      setCurrent((prev) => prev + 1);
    } else {
      onClose();
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-between">
      {/* Top numbered buttons */}
      <div className="flex justify-center gap-3 mt-2 mb-3">
        {questions.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-10 h-10 flex items-center justify-center rounded-full focus:outline-none text-sm font-semibold border-2 border-white transition-all ${
              i === current
                ? "bg-white text-blue-700 scale-110"
                : "bg-transparent text-white  hover:bg-blue-700 hover:text-white"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* Question content */}
      <div className="px-5 pb-6 mt-6 ">
        <div className=" shadow-md rounded-xl p-4 border border-gray-100 flex flex-col gap-4 bg-gray-50">
          <p className="font-semibold text-gray-800 mb-3 text-base">
            {current + 1}. {q.question}
          </p>

          {q.options.map((opt, optIndex) => {
            const isSelected = answers[current] === optIndex;
            const isAnswered = answers[current] !== -1;
            const isCorrect = optIndex === q.correct;

            return (
              <label
                key={optIndex}
                className={`relative flex items-center gap-4 border shadow-lg rounded-lg p-4 mb-2 cursor-pointer transition-all ${
                  isSelected
                    ? isCorrect
                      ? "bg-blue-700  text-white shadow-inner"
                      : "bg-red-100 border-red-500 text-red-700 shadow-inner"
                    : "hover:bg-blue-700 hover:text-white border-gray-200"
                } ${isAnswered ? "cursor-not-allowed" : ""}`}
              >
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={() =>
                    !isAnswered && onAnswer(current, optIndex)
                  }
                  disabled={isAnswered}
                  className={`border-2  ${
                    isSelected
                      ? isCorrect
                        ? "border-white"
                        : "border-red-600 "
                      : "border-gray-400"
                  }`}
                />

                <div className="before:content-[''] before:absolute before:left-12 before:top-0  before:w-[2px] before:!h-full before:bg-gray-200" />

                <span className="text-xs sm:text-sm font-medium">{opt}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Bottom "Next" button */}
      <div className="px-5 pb-5">
        <button
          onClick={handleNext}
          className="w-full bg-blue-950 text-white rounded-md py-2 font-medium  shadow-md"
        >
          {current === questions.length - 1 ? "Finish" : "Next"}
        </button>
      </div>
    </div>
  );
}
