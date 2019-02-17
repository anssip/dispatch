const { expect } = require("chai");
const projectContainer = require("../src/models/ProjectContainer");

describe("project container", () => {
    describe("load recent files", () => {
        it("Should load the recent files", async () => {

            const files = projectContainer.loadRecentFiles();
            expect(files).to.be.undefined;
        })
    })
})