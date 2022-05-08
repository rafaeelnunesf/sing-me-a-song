import supertest from "supertest";
import app from "../src/app.js";
import { prisma } from "../src/database.js";
import {
  createdRecommendation,
  createRecommendationBody,
  getRecommendationById,
  getRecommendations,
} from "./factories/RecommendationsFactory.js";

async function truncateRecommendations() {
  await prisma.$executeRaw`TRUNCATE TABLE recommendations;`;
}
async function disconnect() {
  await prisma.$disconnect();
}

beforeEach(truncateRecommendations);
afterAll(disconnect);

describe("POST /recommendations", () => {
  it("should return 201 and persist the recommendation given a valid body", async () => {
    const body = await createRecommendationBody();

    const response = await supertest(app).post("/recommendations").send(body);

    expect(response.status).toEqual(201);
  });
  it("should return 422 given a body without a name", async () => {
    // Arrange, Act, Assert
    const body = await createRecommendationBody();
    delete body.name;

    const response = await supertest(app).post("/recommendations").send(body);

    expect(response.status).toEqual(422);
  });
  it("should return 422 given a body without a invalid youtube link", async () => {
    const body = await createRecommendationBody();
    body.youtubeLink = "https://www.google.com";

    const response = await supertest(app).post("/recommendations").send(body);

    expect(response.status).toEqual(422);
  });
});
describe("POST /recommendations/:id/upvote", () => {
  it("should return 200 given a valid id and add 1 to score ", async () => {
    const body = await createRecommendationBody();
    const recommendation = await createdRecommendation(body);

    const { status } = await supertest(app).post(
      `/recommendations/${recommendation.id}/upvote`
    );
    const { body: result } = await getRecommendationById(recommendation.id);
    const score = result.score;

    expect(status).toEqual(200);
    expect(recommendation.score + 1).toEqual(score);
  });
});
describe("POST /recommendations/:id/downvote", () => {
  it("should return 200 given a valid id and remove 1 to score ", async () => {
    const body = await createRecommendationBody();
    const recommendation = await createdRecommendation(body);

    const { status } = await supertest(app).post(
      `/recommendations/${recommendation.id}/downvote`
    );
    const { body: result } = await getRecommendationById(recommendation.id);
    const score = result.score;

    expect(status).toEqual(200);
    expect(recommendation.score - 1).toEqual(score);
  });
  it("should be removed when the score falls below -5 ", async () => {
    const body = await createRecommendationBody();
    const recommendation = await createdRecommendation(body);

    for (let i = 0; i < 7; i++) {
      await supertest(app).post(
        `/recommendations/${recommendation.id}/downvote`
      );
    }
    const { body: result } = await getRecommendationById(recommendation.id);
    const score = result.score;

    expect(score).toBe(undefined);
  });
});
describe("GET /recommendations", () => {
  it("should return status 200 and a list of recommendations", async () => {
    const rec = await createRecommendationBody();
    await createdRecommendation(rec);
    const { status, body: recommendations } = await getRecommendations();

    expect(status).toBe(200);
    expect(recommendations.length).toBeLessThanOrEqual(10);
  });
});
describe("GET /recommendations/:id", () => {
  it("should return status 200 and a recommendation", async () => {
    const body = await createRecommendationBody();
    const { id } = await createdRecommendation(body);

    const result = await getRecommendationById(id);

    const object = {
      id: expect.any(Number),
      name: expect.any(String),
      youtubeLink: expect.any(String),
      score: expect.any(Number),
    };

    expect(result.status).toEqual(200);
    expect(result.body).toEqual(object);
  });
});
