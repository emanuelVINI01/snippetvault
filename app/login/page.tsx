import { redirect } from "next/navigation";
import { auth, signIn } from "@/src/auth";
import LoginClient from "@/src/components/login/LoginClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Entrar",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function LoginPage() {
  const session = await auth();
  if (session?.user) redirect("/");

  async function signInWithGithub() {
    "use server";
    await signIn("github", { redirectTo: "/" });
  }

  return <LoginClient signInAction={signInWithGithub} />;
}
