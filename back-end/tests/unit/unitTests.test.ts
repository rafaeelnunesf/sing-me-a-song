import { recommendationService } from "./../../src/services/recommendationsService.js";
import { recommendationRepository } from "../../src/repositories/recommendationRepository.js";
import { prisma } from "../../src/database.js";
import { jest } from "@jest/globals";

async function truncateRecommendations() {
  await prisma.$executeRaw`TRUNCATE TABLE recommendations;`;
}
async function disconnect() {
  await prisma.$disconnect();
}

beforeEach(truncateRecommendations);
afterAll(disconnect);

describe("POST (unitTest) /recommendations/:id/upvote", () => {
  it("should throw error 'not_found' ", async () => {
    jest.spyOn(recommendationRepository, "find").mockReturnValue(null);

    expect(async () => {
      await recommendationService.upvote(1);
    }).rejects.toEqual({
      message: "",
      type: "not_found",
    });
  });
});
describe("GET (unitTest) /recommendations/random", () => {
  it("should throw error 'not_found'", async () => {
    jest.spyOn(recommendationService, "getScoreFilter").mockReturnValue("gt");
    jest.spyOn(recommendationService, "getByScore").mockResolvedValue([]);
    jest.spyOn(recommendationRepository, "findAll").mockResolvedValue([]);

    expect(async () => {
      await recommendationService.getRandom();
    }).rejects.toEqual({
      message: "",
      type: "not_found",
    });
  });
});
