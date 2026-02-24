import React, { useState } from 'react';

const API_KEY = 'TVŮJ_USDA_API_KEY'; // vlož svůj USDA API klíč

async function fetchNutrition(foodName) {
  try {
    const searchRes = await fetch(
      `https://api.nal.usda.gov/fdc/v1/foods/search?query=${encodeURIComponent(foodName)}&api_key=${API_KEY}`
    );
    const searchData = await searchRes.json();
    if (!searchData.foods || searchData.foods.length === 0) return null;

    const fdcId = searchData.foods[0].fdcId;
    const detailRes = await fetch(
      `https://api.nal.usda.gov/fdc/v1/food/${fdcId}?api_key=${API_KEY}`
    );
    const detailData = await detailRes.json();
    return detailData;
  } catch (err) {
    console.error('USDA API error', err);
    return null;
  }
}

function App() {
  const [restaurants, setRestaurants] = useState([]);
  const [newRestaurantName, setNewRestaurantName] = useState('');
  const [searchDish, setSearchDish] = useState('');
  const [dailyMenu, setDailyMenu] = useState([]);
  const [nutritionInfo, setNutritionInfo] = useState({});

  const addRestaurant = () => {
    if (!newRestaurantName) return;
    setRestaurants([...restaurants, { name: newRestaurantName, menu: [] }]);
    setNewRestaurantName('');
  };

  const addDish = (index) => {
    const dishName = prompt('Název jídla:');
    const dishPrice = prompt('Cena jídla:');
    if (dishName && dishPrice) {
      const newRestaurants = [...restaurants];
      newRestaurants[index].menu.push({ name: dishName, price: parseFloat(dishPrice) });
      setRestaurants(newRestaurants);
    }
  };

  const addToDailyMenu = (dish) => {
    setDailyMenu([...dailyMenu, dish]);
export default App;