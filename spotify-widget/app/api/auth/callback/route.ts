import dbConnect from "@/lib/mongodb";
import Token from "@/models/token.model";
import axios from "axios";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const widgetId = url.searchParams.get("state");

  const redirect_uri = `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/callback`;

  const { data } = await axios.post(
    "https://accounts.spotify.com/api/token",
    new URLSearchParams({
      grant_type: "authorization_code",
      code: code!,
      redirect_uri,
      client_id: process.env.SPOTIFY_CLIENT_ID!,
      client_secret: process.env.SPOTIFY_CLIENT_SECRET!,
    }),
    { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
  );

  const { access_token, refresh_token } = data;

  await dbConnect();
  await Token.updateOne(
    { widgetId },
    {
      access_token,
      refresh_token,
      status: "active",
    }
  );

  return NextResponse.redirect(
    `${process.env.NEXT_PUBLIC_BASE_URL}/widget/${widgetId}`
  );
}
