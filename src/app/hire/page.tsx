import type { Metadata } from "next";
import HireClient from "./HireClient";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Massa freelance – Hire",
};

export default function HirePage() {
  return <HireClient />;
}
