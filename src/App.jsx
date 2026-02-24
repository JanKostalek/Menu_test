import React, { useState } from "react";

function App() {
  const [food, setFood] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const searchFood = async () => {
    if (!food) return;

    try {
      setError("");
      setResult(null);

      const response = await fetch(
        `/api/usda?query=${encodeURIComponent(food)}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Chyba při načítání dat");
      }

      setResult(data);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ padding: "40px", fontFamily: "Arial" }}>
      <h1>USDA Nutrition Search</h1>

      <input
        type="text"
        value={food}
        onChange={(e) => setFood(e.target.value)}
        placeholder="Zadej potravinu (např. apple)"
        style={{ padding: "8px", width: "300px" }}
      />

      <button
        onClick={searchFood}
        style={{ marginLeft: "10px", padding: "8px 16px" }}
      >
        Hledat
      </button>

      {error && (
        <p style={{ color: "red", marginTop: "20px" }}>{error}</p>
      )}

      {result && (
        <div style={{ marginTop: "20px" }}>
          <h2>{result.description}</h2>
          <p>Kalorie: {result.calories} kcal</p>
          <p>Bílkoviny: {result.protein} g</p>
          <p>Tuky: {result.fat} g</p>
          <p>Sacharidy: {result.carbs} g</p>
        </div>
      )}
    </div>
  );
}

export default App;
