import type { VercelRequest, VercelResponse } from "@vercel/node";

const NEXON_BASE_URL = "https://open.api.nexon.com/fconline/v1";

// 프록시 허용 경로와 경로별 Vercel CDN 캐시 정책
const CACHE_POLICY: Record<string, string> = {
  id: "public, s-maxage=600, stale-while-revalidate=3600",
  "user/match": "public, s-maxage=30, stale-while-revalidate=60",
  "user/maxdivision": "public, s-maxage=300, stale-while-revalidate=3600",
  // 종료된 경기 정보는 변하지 않음
  "match-detail": "public, s-maxage=31536000, immutable",
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const apiKey = process.env.NEXON_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ message: "API 키가 설정되지 않았습니다." });
  }

  const { path, ...query } = req.query;
  const endpoint = Array.isArray(path) ? path.join("/") : (path ?? "");
  const cacheControl = CACHE_POLICY[endpoint];

  if (req.method !== "GET" || !cacheControl) {
    return res.status(404).json({ message: "Not Found" });
  }

  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    for (const v of Array.isArray(value) ? value : [value]) {
      if (v !== undefined) params.append(key, v);
    }
  }

  const upstream = await fetch(`${NEXON_BASE_URL}/${endpoint}?${params}`, {
    headers: { "x-nxopen-api-key": apiKey },
  });

  res.status(upstream.status);
  res.setHeader(
    "Content-Type",
    upstream.headers.get("content-type") ?? "application/json",
  );
  if (upstream.ok) res.setHeader("Cache-Control", cacheControl);
  return res.send(await upstream.text());
}
