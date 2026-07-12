import { NextResponse } from "next/server";

export async function GET() {
  const response = NextResponse.json(
    { message: "Logout Successfully..." },
    { status: 200 }
  );

  response.cookies.delete("token");

  return response;
}