import faker from "@faker-js/faker";
describe("Add Recommendation", () => {
  const votes = 0;
  const recommendation = {
    name: faker.fake.name,
    youtubeLink: "https://www.youtube.com/watch?v=5qap5aO4i9A",
  };

  it("should add a recommendation successfully", () => {
    cy.visit("http://localhost:3000");

    cy.get("#name").type(recommendation.name);
    cy.get("#youtubelink").type(recommendation.youtubeLink);

    cy.intercept("POST", "/recommendations").as("postRecommendation");
    cy.get("#submitButton").click();
    cy.wait("@postRecommendation");

    cy.contains(recommendation.name).should("be.visible");
  });

  it("should upvote a video successfuly", () => {
    cy.get("#upvote").click();
    cy.contains(`${votes + 1}`).should("not.be.undefined");
    cy.get("#downvote").click();
  });

  it("should downvote a video successfuly", () => {
    cy.get("#downvote").click();
    cy.contains(`${votes - 1}`).should("not.be.undefined");
  });

  it("should delete the recommendation when the score goes below -5", () => {
    cy.get("#downvote").click();
    cy.get("#downvote").click();
    cy.get("#downvote").click();
    cy.get("#downvote").click();
    cy.get("#downvote").click();

    cy.contains("No recommendations yet! Create your own :)").should(
      "be.visible"
    );
  });
});
