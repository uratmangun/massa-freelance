import type { Metadata } from "next";
import DashboardClient from "./DashboardClient";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Massa freelance – Dashboard",
};

export default function DashboardPage() {
  return <DashboardClient />;
}
