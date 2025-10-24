import { courses } from "@/lib/constants";
import Heading from "./Heading";

export default function CourseMaterials() {
  return (
    <>
      <Heading title="Course Materials" className="mt-10 mb-5" />

      <div className="grid md:gap-6 md:grid-cols-2 shadow-lg">
        {[1, 2].map((col) => (
          <div key={col} className="rounded-lg p-6 flex flex-col gap-3">
            {courses.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between border-b last:border-none pb-2 last:pb-0"
              >
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <item.icon className="h-4 w-4 text-gray-800" />

                  <span>{item.label}:</span>
                </div>
                <span className="font-medium text-sm text-gray-700">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}
