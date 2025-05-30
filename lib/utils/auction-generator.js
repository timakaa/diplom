import { getRandomCar } from "../data/cars.js";
import { db } from "../db/index.js";
import { auctions } from "../db/schema.js";

// Array of random car images
const carImages = [
  "/car1.jpg",
  "/car2.jpg",
  "/car3.webp",
  "/car4.jpg",
  "/car5.jpg",
  "/car6.webp",
  "/car7.jpg",
  "/car8.jpg",
  "/car9.webp",
  "/car10.jpg",
];

function getRandomCarImage() {
  return carImages[Math.floor(Math.random() * carImages.length)];
}

export async function generateRandomAuction() {
  const car = getRandomCar();
  const now = new Date();
  const endDate = new Date(now.getTime() + 5 * 60 * 1000); // 5 minutes from now

  const auction = {
    title: `${car.year} ${car.brand} ${car.model}`,
    description: car.description,
    startingPrice: car.startingPrice,
    currentPrice: car.startingPrice,
    startDate: now,
    endDate: endDate,
    status: "active",
    brand: car.brand,
    model: car.model,
    year: car.year,
    mileage: car.mileage,
    imageUrl: getRandomCarImage(),
  };

  try {
    const [newAuction] = await db.insert(auctions).values(auction).returning();
    console.log("Generated new auction:", newAuction);
    return newAuction;
  } catch (error) {
    console.error("Error generating auction:", error);
    throw error;
  }
}

export async function generateRandomAuctions(count = 3) {
  const auctions = [];
  for (let i = 0; i < count; i++) {
    try {
      const auction = await generateRandomAuction();
      auctions.push(auction);
    } catch (error) {
      console.error(`Error generating auction ${i + 1}:`, error);
    }
  }
  return auctions;
}
