import LandingPage from "@/components/LandingPage";
import { getLandingPageContent } from "@/lib/shutter";

export default async function Home() {
  const content = await getLandingPageContent();

  return <LandingPage content={content} />;
}
