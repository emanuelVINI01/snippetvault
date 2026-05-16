import { auth } from "@/src/auth";
import HomeClient from "@/src/components/main/HomeClient";

export default async function HomePage() {
  const session = await auth();

  return <HomeClient isAuthenticated={Boolean(session?.user)} />;
}
