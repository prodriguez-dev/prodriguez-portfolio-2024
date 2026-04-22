import { getPhaseOneMetadata, renderPhaseOnePage } from "@/lib/phase-one-pages";
import { Metadata } from "next";

export default async function Page() {
  return renderPhaseOnePage("contact");
}

export async function generateMetadata(): Promise<Metadata> {
  return getPhaseOneMetadata("contact") || {};
}
