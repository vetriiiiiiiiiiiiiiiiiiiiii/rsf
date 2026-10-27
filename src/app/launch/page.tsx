import type { Metadata } from "next";
import { LaunchStage } from "./launch-stage";

export const metadata: Metadata = {
  title: "Website Launch",
  robots: { index: false, follow: false },
};

export default function LaunchPage() {
  return <LaunchStage />;
}
