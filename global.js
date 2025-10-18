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
