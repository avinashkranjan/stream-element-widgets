import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const widgetId = url.searchParams.get("widgetId");

  const redirect_uri = `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/callback`;
  const authUrl =
    `https://accounts.spotify.com/authorize?` +
    new URLSearchParams({
      client_id: process.env.SPOTIFY_CLIENT_ID!,
      response_type: "code",
      redirect_uri,
      scope: "user-read-playback-state user-read-currently-playing",
      state: widgetId!,
    }).toString();

  return NextResponse.redirect(authUrl);
}
