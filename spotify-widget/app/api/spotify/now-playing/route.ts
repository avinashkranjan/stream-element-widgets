import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { serialize } from "cookie";

export async function GET(req: NextRequest) {
  let at = req.cookies.get("sp_at")?.value;
  const rt = req.cookies.get("sp_rt")?.value;
  if (!at)
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  try {
    const resp = await axios.get(
      "https://api.spotify.com/v1/me/player/currently-playing",
      {
        headers: { Authorization: `Bearer ${at}` },
      }
    );
    return NextResponse.json(resp.data);
  } catch (err: any) {
    if (err.response?.status === 401 && rt) {
      const creds = Buffer.from(
        `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
      ).toString("base64");
      const tokenResp = await axios.post(
        "https://accounts.spotify.com/api/token",
        new URLSearchParams({
          grant_type: "refresh_token",
          refresh_token: rt,
        }),
        { headers: { Authorization: `Basic ${creds}` } }
      );

      const newAt = tokenResp.data.access_token;
      const expires = tokenResp.data.expires_in;

      const newData = await axios.get(
        "https://api.spotify.com/v1/me/player/currently-playing",
        {
          headers: { Authorization: `Bearer ${newAt}` },
        }
      );

      const response = NextResponse.json(newData.data);
      response.headers.append(
        "Set-Cookie",
        serialize("sp_at", newAt, {
          httpOnly: true,
          secure: true,
          path: "/",
          maxAge: expires,
        })
      );
      return response;
    }
    return NextResponse.json(
      { error: "Spotify fetch error" },
      { status: err.response?.status || 500 }
    );
  }
}
