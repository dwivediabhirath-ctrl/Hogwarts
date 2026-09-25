export default async function handler(req, res) {
  try {
    const r = await fetch("https://www.chess.com/club/hogwarts-team", {
      headers: {
        "User-Agent": "Hogwarts-Team-Sidebar/1.0"
      }
    });

    const html = await r.text();

    const match =
      html.match(/([\d,]+)\s*Members/i) ||
      html.match(/"members"\s*:\s*([\d,]+)/i);

    if (!match) throw new Error();

    const members = Number(match[1].replace(/,/g, ""));

    res.setHeader(
      "Cache-Control",
      "s-maxage=60, stale-while-revalidate=300"
    );

    return res.status(200).json({
      members,
      source: "chess.com",
      updatedAt: new Date().toISOString()
    });

  } catch {
    return res.status(200).json({
      members: 107,
      source: "fallback",
      updatedAt: new Date().toISOString()
    });
  }
}
