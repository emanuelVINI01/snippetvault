import { NextResponse } from "next/server";
import { ZodError } from "zod";

export const unauthorizedResponse = () => new NextResponse("Unauthorized", { status: 401 });
export const notFoundResponse = () => new NextResponse("Not Found", { status: 404 });
export const internalErrorResponse = () => new NextResponse("Internal Server Error", { status: 500 });
export const noContentResponse = () => new NextResponse(null, { status: 204 });

export function validationErrorResponse(error: ZodError) {
  return NextResponse.json({ errors: error.issues }, { status: 400 });
}

export function handleApiError(error: unknown) {
  if (error instanceof ZodError) return validationErrorResponse(error);
  return internalErrorResponse();
}
