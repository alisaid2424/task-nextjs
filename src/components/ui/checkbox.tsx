"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Circle } from "lucide-react";
import { cn } from "@/lib/utils";

export const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, checked, onCheckedChange, ...props }, ref) => {
  const [localChecked, setLocalChecked] = React.useState(!!checked);

  React.useEffect(() => {
    setLocalChecked(!!checked);
  }, [checked]);

  const handleChange = (value: boolean) => {
    setLocalChecked(value);
    onCheckedChange?.(value);
  };

  return (
    <CheckboxPrimitive.Root
      ref={ref}
      checked={localChecked}
      onCheckedChange={handleChange}
      className={cn(
        "grid place-content-center h-4 w-4 shrink-0 rounded-sm border-2 transition-all duration-150",
        className
      )}
      {...props}
    >
      {localChecked && (
        <CheckboxPrimitive.Indicator className="grid place-content-center">
          <Circle
            className="h-2 w-2 rounded-full"
            fill="white"
            stroke="white"
          />
        </CheckboxPrimitive.Indicator>
      )}
    </CheckboxPrimitive.Root>
  );
});

Checkbox.displayName = "Checkbox";
