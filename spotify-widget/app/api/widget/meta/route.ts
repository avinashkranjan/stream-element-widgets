import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Token from "@/models/token.model";

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "No ID" }, { status: 400 });
  await dbConnect();
  const doc = await Token.findOne({ widgetId: id });
  if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ type: doc.type });
}
