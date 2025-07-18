import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Token from "@/models/token.model";
import axios from "axios";

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  await dbConnect();
  const token = await Token.findOne({ widgetId: id });
  if (!token || !token.access_token) {
    return NextResponse.json({ error: "Token not found" }, { status: 401 });
  }

  try {
    const response = await axios.get(
      "https://api.spotify.com/v1/me/player/currently-playing",
      {
        headers: { Authorization: `Bearer ${token.access_token}` },
      }
    );

    if (response.status === 204) {
      return NextResponse.json({ isPlaying: false });
    }

    return NextResponse.json(response.data);
  } catch (err: any) {
    console.error(err.response?.data || err.message);
    return NextResponse.json(
      { error: "Failed to fetch now playing" },
      { status: 500 }
    );
  }
}
