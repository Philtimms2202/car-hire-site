import { buildMetadata } from "@/app/metadata";
import EsimsPageClient from "./EsimsPageClient";

export function generateMetadata() {
  return buildMetadata({
    title: "eSIMs for International Travel | Timms Travel",
    description:
      "Get affordable mobile data in 150+ countries with a Timms eSIM. No roaming charges, no physical SIM card, instant activation.",
    openGraph: {
      url: "https://timmstravel.com/other-services/esims",
    },
    alternates: {
      canonical: "https://timmstravel.com/other-services/esims",
    },
  });
}

export default function EsimsPage() {
  return <EsimsPageClient />;
}