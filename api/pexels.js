export default async function handler(req, res) {
  const PEXELS_API_KEY = process.env.PEXELS_API_KEY; // Stored securely in Vercel
  const { query } = req.query; // Get search query from request

  if (!query) {
    return res.status(400).json({ error: "Missing search query" });
  }

  try {
    const response = await fetch(
      `https://api.pexels.com/v1/search?query=${query}`,
      {
        headers: {
          Authorization: PEXELS_API_KEY,
        },
      }
    );
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch images" });
  }
}
