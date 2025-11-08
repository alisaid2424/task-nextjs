"use client";

import { useState, useEffect } from "react";
import { weeks } from "@/lib/constants";
import { useToast } from "@/hooks/use-toast";
import { ProgressSection } from "./ProgressSection";
import { WeeksAccordion } from "./WeeksAccordion";
import { QuestionDialog } from "./QuestionDialog";
import { Lesson } from "@/types";

export default function CourseProgress() {
  const { toast } = useToast();
  const [progress, setProgress] = useState<number>(0);
  const [answeredCount, setAnsweredCount] = useState<number>(0);
  const [totalQuestions, setTotalQuestions] = useState<number>(0);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [timer, setTimer] = useState<number>(0);

  const getLessonKey = (weekTitle: string, lessonTitle: string) =>
    `${weekTitle}-${lessonTitle}`;

  //Calculate the total number of questions
  useEffect(() => {
    let count = 0;
    weeks.forEach((week) =>
      week.lessons.forEach((lesson) => {
        if (lesson.questions) count += lesson.questions.length;
      })
    );
    setTotalQuestions(count);
  }, []);

  // Load data from sessionStorage
  useEffect(() => {
    const savedCompleted = sessionStorage.getItem("completedLessons");
    const savedLessonAnswers: Record<string, number[]> = JSON.parse(
      sessionStorage.getItem("lessonAnswers") || "{}"
    );

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

    if (savedCompleted) setCompletedLessons(JSON.parse(savedCompleted));

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

  const handleLessonClick = (lesson: Lesson) => {
    if (!lesson.questions) return;
    setSelectedLesson(lesson);
    setAnswers(new Array(lesson.questions.length).fill(-1));
    setOpenDialog(true);

    if (lesson.time) {
      const match = lesson.time.match(/(\d+)\s*MINUTES?/i);
      setTimer(match ? parseInt(match[1], 10) * 60 : 0);
    } else setTimer(0);
  };

  const handleAnswer = (qIndex: number, optionIndex: number) => {
    if (!selectedLesson || !selectedLesson.questions) return;

    const lessonKey = getLessonKey(selectedLesson.title, selectedLesson.title);
    const savedLessonAnswers: Record<string, number[]> = JSON.parse(
      sessionStorage.getItem("lessonAnswers") || "{}"
    );
    const lessonAnswers: number[] = savedLessonAnswers[lessonKey] || [];

    const previousAnswer = lessonAnswers[qIndex];
    const wasCorrectBefore =
      previousAnswer === selectedLesson.questions[qIndex].correct;

    // Update answer
    lessonAnswers[qIndex] = optionIndex;
    savedLessonAnswers[lessonKey] = lessonAnswers;
    sessionStorage.setItem("lessonAnswers", JSON.stringify(savedLessonAnswers));
    setAnswers((prev) => {
      const updated = [...prev];
      updated[qIndex] = optionIndex;
      return updated;
    });

    const isCorrectNow =
      optionIndex === selectedLesson.questions[qIndex].correct;

    // ✅ Only adjust answeredCount if correctness changed
    if (!wasCorrectBefore && isCorrectNow) {
      // Question became correct now
      setAnsweredCount((prev) => prev + 1);
    } else if (wasCorrectBefore && !isCorrectNow) {
      // Question became incorrect now
      setAnsweredCount((prev) => prev - 1);
    }

    toast({
      title: isCorrectNow ? "✅ Correct!" : "❌ Wrong",
      description: isCorrectNow
        ? "Great job! 🎉"
        : "Not quite right. Keep trying! 🙂",
      className: isCorrectNow
        ? "bg-green-100 text-green-700"
        : "bg-red-100 text-red-700",
    });

    // Mark lesson as completed if all questions answered
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
      <ProgressSection
        progress={progress}
        answeredCount={answeredCount}
        totalQuestions={totalQuestions}
      />
      <WeeksAccordion
        weeks={weeks}
        completedLessons={completedLessons}
        handleLessonClick={handleLessonClick}
        getLessonKey={getLessonKey}
      />
      <QuestionDialog
        open={openDialog}
        setOpen={setOpenDialog}
        lesson={selectedLesson}
        timer={timer}
        setTimer={setTimer}
        onAnswer={handleAnswer}
        answers={answers}
      />
    </div>
  );
}
