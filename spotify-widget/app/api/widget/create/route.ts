import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import dbConnect from "@/lib/mongodb";
import Token from "@/models/token.model";

export async function POST(req: Request) {
  const { type } = await req.json();
  const widgetId = uuidv4();

  await dbConnect();
  await Token.create({
    widgetId,
    type,
    status: "pending",
  });

  const redirectUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/login?widgetId=${widgetId}`;
  return NextResponse.json({ widgetId, redirectUrl });
}
