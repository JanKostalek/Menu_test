export default async function handler(req, res) {
  const apiKey = process.env.USDA_API_KEY;
  const query = (req.query.query || "").toString();

  if (!apiKey) {
    return res.status(500).json({ error: "Missing USDA_API_KEY env var" });
  }
  if (!query) {
    return res.status(400).json({ error: "Missing query parameter" });
  }

  try {
    // 1) Search for foods
    const searchResp = await fetch(
      "https://api.nal.usda.gov/fdc/v1/foods/search?" +
        new URLSearchParams({
          query,
          pageSize: "1",
          api_key: apiKey,
        })
    );

    const searchData = await searchResp.json();
    const first = searchData?.foods?.[0];

    if (!first?.fdcId) {
      return res.status(404).json({ error: "No food found" });
    }

    // 2) Get details (nutrients)
    const detailResp = await fetch(
      `https://api.nal.usda.gov/fdc/v1/food/${first.fdcId}?` +
        new URLSearchParams({ api_key: apiKey })
    );
    const detail = await detailResp.json();

    const nutrients = detail?.foodNutrients || [];

    const pick = (name) => {
      const n = nutrients.find((x) => x?.nutrient?.name === name);
      return n?.amount ?? null;
    };

    // Common names in USDA:
    const calories = pick("Energy");
    const protein = pick("Protein");
    const fat = pick("Total lipid (fat)");
    const carbs = pick("Carbohydrate, by difference");

    return res.status(200).json({
      description: detail?.description ?? first.description ?? query,
      calories,
      protein,
      fat,
      carbs,
      fdcId: first.fdcId,
    });
  } catch (e) {
    return res.status(500).json({ error: e.message || "USDA request failed" });
  }
}