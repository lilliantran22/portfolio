console.log("IT’S ALIVE!");

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

let navLinks = $$("nav a");
let currentLink = navLinks.find(
  (a) => a.host === location.host && a.pathname === location.pathname
);
currentLink?.classList.add("current");


// label and drop down
const label = document.createElement("label");
label.className = "color-scheme";
label.innerHTML = `
  Theme:
  <select>
    <option value="light dark">Automatic</option>
    <option value="light">Light</option>
    <option value="dark">Dark</option>
  </select>
`;
document.body.prepend(label);

const select = label.querySelector("select");

select.addEventListener("input", (event) => {
  const value = event.target.value;
  document.documentElement.dataset.theme = value;
  document.documentElement.style.setProperty("color-scheme", value);
  localStorage.colorScheme = value;
});

const saved = localStorage.colorScheme;
if (saved) {
  document.documentElement.dataset.theme = saved;
  document.documentElement.style.setProperty("color-scheme", saved);
  select.value = saved;
}


const form = document.querySelector("form");
if (form) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const params = new URLSearchParams(data);
    location.href = form.action + "?" + params.toString();
  });
}

// LAB 4 fetch
export async function fetchJSON(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch projects: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching or parsing JSON data:', error);
  }
}

// lab 4 render proj
export function renderProjects(projects, containerElement, headingLevel = 'h2') {
  if (!containerElement) return;
  containerElement.innerHTML = ''; // clear old content

  for (const project of projects) {
    const article = document.createElement('article');
    article.innerHTML = `
      <${headingLevel}>${project.title}</${headingLevel}>
      <img src="${project.image}" alt="${project.title}">
      <p>${project.description}</p>
    `;
    containerElement.appendChild(article);
  }
}



