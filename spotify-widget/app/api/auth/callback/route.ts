import { NextResponse, NextRequest } from "next/server";
import axios from "axios";
import { serialize } from "cookie";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const creds = Buffer.from(
    `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
  ).toString("base64");

  const resp = await axios.post(
    "https://accounts.spotify.com/api/token",
    new URLSearchParams({
      grant_type: "authorization_code",
      code: code!,
      redirect_uri: process.env.SPOTIFY_REDIRECT_URI!,
    }),
    { headers: { Authorization: `Basic ${creds}` } }
  );

  const { access_token, refresh_token, expires_in } = resp.data;

  const response = NextResponse.redirect(new URL("/widget", req.url));
  const cookieParams = { httpOnly: true, secure: true, path: "/" };

  response.headers.append(
    "Set-Cookie",
    serialize("sp_at", access_token, { ...cookieParams, maxAge: expires_in })
  );
  response.headers.append(
    "Set-Cookie",
    serialize("sp_rt", refresh_token, {
      ...cookieParams,
      maxAge: 60 * 60 * 24 * 30,
    })
  );
  return response;
}
