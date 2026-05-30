import React from 'react';

interface StepperTitleProps {
  step: number;
  title: string;
  description: string;
  className?: string;
}

export function StepperTitle({ step, title, description, className = '' }: StepperTitleProps) {
  return (
    <div className={`pb-2 border-b border-slate-50 ${className}`}>
      <h3 className="text-md font-bold text-slate-800">Step {step}: {title}</h3>
      <p className="text-xs text-slate-400">{description}</p>
    </div>
  );
}
