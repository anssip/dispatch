
import projectContainer from "../src/models/ProjectContainer";

const { expect } = require("chai");

describe("project container", () => {
    describe("load recent files", () => {
        it("Should load the recent files", async () => {
            expect(projectContainer).to.not.be.undefined;
            const settings = await projectContainer.loadSettings();
            console.log(`got settings`, settings);
            expect(settings.files.length).to.be.equal(0);
        })
    })
})