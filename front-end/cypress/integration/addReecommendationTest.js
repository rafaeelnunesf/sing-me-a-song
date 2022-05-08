import faker from "@faker-js/faker";
describe("Add Recommendation", () => {
  it("should add a reommendation successfully", () => {
    cy.visit("http://localhost:3000");

    const recommendation = {
      // name: faker.lorem.word(1),
      name: faker.fake.name,
      youtubeLink: "https://www.youtube.com/watch?v=5qap5aO4i9A",
    };

    cy.get("#name").type(recommendation.name);
    cy.get("#youtubelink").type(recommendation.youtubeLink);

    cy.intercept("POST", "/recommendations").as("postRecommendation");
    cy.get("#submitButton").click();
    cy.wait("@postRecommendation");

    cy.contains(recommendation.name).should("be.visible");

    // cy.url().should("equal", "http://localhost:3000/pagina-protegida");
  });
});
