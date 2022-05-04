import supertest from "supertest";
import app from "../src/app.js";
import { prisma } from "../src/database.js";
import {
  createdRecommendation,
  createRecommendationBody,
  getRecommendationById,
} from "./factories/RecommendationsFactory.js";

async function truncateRecommendations() {
  await prisma.$executeRaw`TRUNCATE TABLE recommendations;`;
}
async function disconnect() {
  await prisma.$disconnect();
}

describe("POST /recommendations", () => {
  beforeEach(truncateRecommendations);
  afterAll(disconnect);

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
  beforeEach(truncateRecommendations);
  afterAll(disconnect);

  it("should return 200 given a valid id and add 1 to score ", async () => {
    const body = await createRecommendationBody();
    const recommendation = await createdRecommendation(body);

    const { status } = await supertest(app).post(
      `/recommendations/${recommendation.id}/upvote`
    );
    const recomendationAfterUpvote = await getRecommendationById(
      recommendation.id
    );
    const score = recomendationAfterUpvote.body.score;

    expect(status).toEqual(200);
    expect(recommendation.score + 1).toEqual(score);
  });
});
