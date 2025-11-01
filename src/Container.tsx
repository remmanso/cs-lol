import { ReactNode } from "react";

export const Container = ({ children }: { children: ReactNode }) => {
  return <section className="h-screen w-screen bg-gray-800 font-medium text-white">
    {children}
  </section>
}