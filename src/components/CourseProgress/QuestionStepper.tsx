"use client";

import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Question } from "@/types";
import { cn } from "@/lib/utils";

interface QuestionStepperProps {
  questions: Question[];
  answers: number[];
  onAnswer: (qIndex: number, optIndex: number) => void;
  onClose: () => void;
}

export function QuestionStepper({
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
      {/* Navigation buttons */}
      <div className="flex justify-center gap-3 mt-2 mb-3">
        {questions.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-10 h-10 flex items-center justify-center rounded-full text-sm font-semibold border-2 transition-all ${
              i === current
                ? "bg-white text-blue-700 scale-110"
                : "bg-transparent text-white hover:bg-blue-700 hover:text-white"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* Question content */}
      <div className="px-5 pb-6 mt-6">
        <div className="shadow-md rounded-xl p-4 border border-gray-100 flex flex-col gap-4 bg-gray-50">
          <p className="font-semibold text-gray-800 mb-3 text-base">
            {current + 1}. {q.question}
          </p>

          {q.options.map((opt, optIndex) => {
            const isSelected = answers[current] === optIndex;
            const isAnswered = answers[current] !== -1;
            const isCorrect = optIndex === q.correct;

            const labelClass = isSelected
              ? isCorrect
                ? "bg-blue-700 text-white border-white shadow-inner"
                : "bg-red-100 border-red-500 text-red-700 shadow-inner"
              : "hover:bg-blue-700 hover:text-white border-white";

            return (
              <label
                key={optIndex}
                className={`relative flex items-center gap-4 border shadow-lg rounded-lg p-4 mb-2 cursor-pointer transition-all ${labelClass} ${
                  isAnswered ? "cursor-not-allowed" : ""
                }`}
              >
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={() =>
                    !isAnswered && onAnswer(current, optIndex)
                  }
                  disabled={isAnswered}
                  className={cn(
                    "border-2 transition-all duration-150",
                    isSelected
                      ? isCorrect
                        ? "bg-blue-700 border-white"
                        : "bg-red-400 border-red-500"
                      : "border-gray-400 hover:border-white"
                  )}
                />

                <div className="before:content-[''] before:absolute before:left-12 before:top-0 before:w-[2px] before:!h-full before:bg-gray-200" />

                <span className="text-xs sm:text-sm font-medium">{opt}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Next / Finish */}
      <div className="px-5 pb-5">
        <button
          onClick={handleNext}
          className="w-full bg-blue-950 text-white rounded-md py-2 font-medium shadow-md hover:bg-blue-900 transition"
        >
          {current === questions.length - 1 ? "Finish" : "Next"}
        </button>
      </div>
    </div>
  );
}
