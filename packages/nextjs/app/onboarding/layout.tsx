"use client";

import React from "react";

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  // This is a minimal layout for the onboarding page
  // It doesn't include the header or sidebar
  return <div className="flex flex-col min-h-screen">{children}</div>;
}
