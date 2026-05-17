import { auth } from "@/src/auth";

export async function getAuthenticatedUserId() {
  const session = await auth();
  return session?.user?.id ?? null;
}
