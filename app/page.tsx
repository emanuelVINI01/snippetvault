import { auth } from "@/src/auth";
import HomeClient from "@/src/components/main/HomeClient";
import { getHomeJsonLd } from "@/src/lib/home-seo";
import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
};

export default async function HomePage() {
  const session = await auth();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getHomeJsonLd()).replace(/</g, "\\u003c"),
        }}
      />
      <HomeClient isAuthenticated={Boolean(session?.user)} />
    </>
  );
}
