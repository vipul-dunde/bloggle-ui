import { NextResponse } from "next/server";

async function gethandler() {
  return NextResponse.redirect("https://appdirect.ai");
}

export const GET = gethandler;
