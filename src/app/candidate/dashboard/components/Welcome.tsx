import { ReactNode } from "react";

export function Welcome({ name = "John" }: { name?: string }) {
  return (
    <div className="mb-8">
      <h1 className="text-3xl sm:text-4xl font-title font-bold">
        Welcome back, <span className="text-main-accent">{name}</span>!
      </h1>
      <p className="mt-2 text-main-light-text">
        Here's an overview of your job search progress
      </p>
    </div>
  );
}
