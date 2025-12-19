import React from 'react';
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
interface Step {
  title: string;
}
interface StepsProps {
  steps: Step[];
  currentStep: number;
  className?: string;
}
export function Steps({ steps, currentStep, className }: StepsProps) {
  return (
    <div className={cn("flex items-center justify-between w-full max-w-md mx-auto mb-8", className)}>
      {steps.map((step, idx) => {
        const isCompleted = idx < currentStep;
        const isActive = idx === currentStep;
        return (
          <React.Fragment key={idx}>
            <div className="flex flex-col items-center relative group">
              <div
                className={cn(
                  "w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-300",
                  isCompleted ? "bg-primary border-primary text-primary-foreground" :
                  isActive ? "border-primary text-primary font-bold scale-110 shadow-sm" :
                  "border-muted text-muted-foreground"
                )}
              >
                {isCompleted ? <Check className="w-5 h-5" /> : idx + 1}
              </div>
              <span className={cn(
                "absolute -bottom-6 text-[10px] font-medium whitespace-nowrap transition-colors",
                isActive ? "text-primary" : "text-muted-foreground"
              )}>
                {step.title}
              </span>
            </div>
            {idx < steps.length - 1 && (
              <div className={cn(
                "flex-1 h-[2px] mx-2 transition-colors duration-500",
                idx < currentStep ? "bg-primary" : "bg-muted"
              )} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}