import { NextResponse } from "next/server";

// TODO: add authentication (Next-auth if private api, otherwise JWT strat)
export async function GET(req: Request) {
  return new NextResponse("Success", { status: 200 });
}
