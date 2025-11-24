import type { Metadata } from "next";
import HireClient from "./HireClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Massa freelance – Hire",
};

export default function HirePage() {
  return <HireClient />;
}
