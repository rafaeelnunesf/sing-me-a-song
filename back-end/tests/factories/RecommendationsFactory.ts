import faker from "@faker-js/faker";
import supertest from "supertest";
import app from "../../src/app.js";
import { prisma } from "../../src/database.js";

export async function createRecommendationBody() {
  return {
    name: faker.lorem.word(1),
    youtubeLink: "https://www.youtube.com/watch?v=5qap5aO4i9A",
  };
}
export async function createdRecommendation(body) {
  await supertest(app).post("/recommendations").send(body);
  const recommendation = await prisma.recommendation.findUnique({
    where: { name: body.name },
  });
  return recommendation;
}

export async function getRecommendationById(id: number) {
  return await supertest(app).get(`/recommendations/${id}`);
}
export async function getRecommendations() {
  return await supertest(app).get(`/recommendations/`);
}
