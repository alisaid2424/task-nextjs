"use client";

import { useState, useEffect } from "react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { FileText, Lock, Plus, Minus } from "lucide-react";
import Heading from "./Heading";
import { weeks } from "@/lib/constants";
import { useToast } from "@/hooks/use-toast";

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

  // Unique key for each lesson
  const getLessonKey = (weekTitle: string, lessonTitle: string) =>
    `${weekTitle}-${lessonTitle}`;

  // When user opens a lesson
  const handleLessonClick = (lesson: Lesson) => {
    if (!lesson.questions) return;
    setSelectedLesson(lesson);
    setAnswers(new Array(lesson.questions.length).fill(-1));
    setOpenDialog(true);
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
        className: "bg-green-600 text-white",
      });

      if (!isAlreadyCorrect) {
        setAnsweredCount((prev) => prev + 1);
      }
    } else {
      toast({
        variant: "destructive",
        title: "Wrong answer",
        description: "😅 Not quite right. Keep trying — you’re learning!",
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
      {weeks.map((week, index) => (
        <div
          key={index}
          className="border rounded shadow-sm p-4 bg-white hover:shadow-md transition-all"
        >
          {accordionType === "single" ? (
            <Accordion
              type="single"
              collapsible
              defaultValue={defaultValue as string}
            >
              <AccordionItem value={`week-${index}`} className="group">
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
                          className={`flex justify-between items-center p-2 rounded-md border transition flex-wrap gap-2 ${
                            lesson.locked
                              ? "opacity-50 cursor-not-allowed"
                              : isCompleted
                              ? "opacity-70 bg-green-50 cursor-not-allowed"
                              : "hover:bg-gray-50 cursor-pointer"
                          }`}
                        >
                          <div className="flex items-center space-x-2 ">
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
                            <div className="flex items-center space-x-2">
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
            </Accordion>
          ) : (
            <Accordion type="multiple" defaultValue={defaultValue as string[]}>
              <AccordionItem value={`week-${index}`} className="group">
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
                          className={`flex justify-between items-center p-2 rounded-md border transition flex-wrap gap-2 ${
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
                            <div className="flex items-center space-x-2">
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
            </Accordion>
          )}
        </div>
      ))}

      {/* Popup Dialog for Questions */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-md w-[90%] overflow-y-scroll max-h-[550px]">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              {selectedLesson?.title}
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              {selectedLesson?.description}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 space-y-4">
            {selectedLesson?.questions?.map((q, qIndex) => (
              <div key={qIndex} className="p-3 border rounded-md">
                <p className="font-medium text-gray-700 mb-2">
                  {qIndex + 1}. {q.question}
                </p>
                {q.options.map((opt, optIndex) => (
                  <button
                    key={optIndex}
                    onClick={() => handleAnswer(qIndex, optIndex)}
                    className={`block w-full text-left border rounded-md p-2 mb-2 outline-none text-sm transition ${
                      answers[qIndex] === optIndex
                        ? optIndex === q.correct
                          ? "bg-green-100 border-green-500"
                          : "bg-red-100 border-red-500"
                        : "hover:bg-gray-100"
                    }`}
                    disabled={answers[qIndex] !== -1}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            ))}

            <button
              onClick={() => setOpenDialog(false)}
              className="mt-4 w-full bg-green-500 text-white rounded-md py-2 hover:bg-green-600 transition-colors"
            >
              Close Lesson
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
