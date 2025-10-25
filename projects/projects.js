// projects/projects.js
import { fetchJSON, renderProjects } from "../global.js";

async function main() {

  const projects = await fetchJSON("../lib/projects.json");

  const container = document.querySelector(".projects");

  renderProjects(projects, container, "h2");

  const title = document.querySelector("h1");
  if (title) {
    title.textContent += ` (${projects.length})`;
  }
}

main();
