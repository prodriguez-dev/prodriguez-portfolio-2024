import { getPhaseOneContent, getPhaseOneMetadata, getPhaseOneStaticParams, renderPhaseOnePage } from "@/lib/phase-one-pages";
import { Metadata } from "next";
import { notFound } from "next/navigation";

type Params = { uid: string };

export default async function Page({ params }: { params: Params }) {
  const page = getPhaseOneContent(params.uid);

  if (!page) {
    notFound();
  }

  return renderPhaseOnePage(params.uid);
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  return getPhaseOneMetadata(params.uid) || {};
}

export async function generateStaticParams() {
  return getPhaseOneStaticParams();
}
