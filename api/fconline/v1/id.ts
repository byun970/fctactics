import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { nickname } = req.query;
  const apiKey = process.env.VITE_NEXON_API_KEY; // Vercel 환경변수

  try {
    const response = await fetch(
      `https://open.api.nexon.com/fconline/v1/id?nickname=${nickname}`,
      {
        headers: {
          "x-nxopen-api-key": apiKey || "",
        },
      },
    );
    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
