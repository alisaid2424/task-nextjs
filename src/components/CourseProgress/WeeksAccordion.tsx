"use client";

import { Accordion } from "@/components/ui/accordion";
import { useEffect, useState } from "react";
import { Week, Lesson } from "@/types";
import renderAccordionContent from "./renderAccordionContent";

interface WeeksAccordionProps {
  weeks: Week[];
  completedLessons: string[];
  handleLessonClick: (lesson: Lesson) => void;
  getLessonKey: (weekTitle: string, lessonTitle: string) => string;
}

export function WeeksAccordion({
  weeks,
  completedLessons,
  handleLessonClick,
  getLessonKey,
}: WeeksAccordionProps) {
  const [accordionType, setAccordionType] = useState<"single" | "multiple">(
    "single"
  );

  const [defaultValue, setDefaultValue] = useState<string | string[]>("week-0");

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

  return (
    <div className="border rounded shadow-sm p-4 bg-white hover:shadow-md transition-all">
      {accordionType === "single" ? (
        <Accordion
          type="single"
          collapsible
          defaultValue={defaultValue as string}
          className="space-y-2"
        >
          {weeks.map((week, idx) =>
            renderAccordionContent({
              idx,
              week,
              completedLessons,
              handleLessonClick,
              getLessonKey,
            })
          )}
        </Accordion>
      ) : (
        <Accordion
          type="multiple"
          defaultValue={defaultValue as string[]}
          className="space-y-2"
        >
          {weeks.map((week, idx) =>
            renderAccordionContent({
              idx,
              week,
              completedLessons,
              handleLessonClick,
              getLessonKey,
            })
          )}
        </Accordion>
      )}
    </div>
  );
}
