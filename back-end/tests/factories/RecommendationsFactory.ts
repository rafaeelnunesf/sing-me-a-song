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
export async function generateRecommendations() {
  await prisma.recommendation.createMany({
    data: [
      {
        name: "10 HORAS DE MELÔ DO JONAS (PRA VOCÊ DANÇAR POR VÁRIAS HORAS)",
        youtubeLink: "https://www.youtube.com/watch?v=Jg7A017cm3Q",
        score: faker.datatype.number(10),
      },
      {
        name: "MC POZE NOS ANOS 80 por 10 HORAS",
        youtubeLink: "https://www.youtube.com/watch?v=QeHpB-Nhzdo",
        score: faker.datatype.number(10),
      },
      {
        name: "É na sola da bota é na palma da bota 10 horas",
        youtubeLink: "https://www.youtube.com/watch?v=rxCs1fGxloI&t=10s",
        score: faker.datatype.number(10),
      },
      {
        name: "10 HORAS DE O DEDO DO TREM BALA GIRANDO",
        youtubeLink: "https://www.youtube.com/watch?v=lFigTUL320Q",
        score: faker.datatype.number(10),
      },
    ],
  });
}
