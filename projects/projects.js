import { fetchJSON, renderProjects } from '../global.js';
import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';

let selectedIndex = -1;
let allProjects = [];

async function main() {
  allProjects = await fetchJSON('../lib/projects.json');
  const title = document.querySelector('h1');
  
  if (title) {
    title.textContent = `My Projects (${allProjects.length})`;
  }

  const projectsContainer = document.querySelector('.projects');
  const searchInput = document.querySelector('.searchBar');
  
  // Initial render
  renderProjects(allProjects, projectsContainer, 'h2');
  renderPieChart(allProjects);

  // Search functionality
  searchInput.addEventListener('input', (event) => {
    let query = event.target.value.trim().toLowerCase();

    let filteredProjects = allProjects.filter((project) => {
      let values = Object.values(project).join(' ').toLowerCase();
      return values.includes(query);
    });

    // Reset selection when searching
    selectedIndex = -1;
    
    // Re-render filtered projects + pie chart
    renderProjects(filteredProjects, projectsContainer, 'h2');
    renderPieChart(filteredProjects);
    
    // Update title with filtered count
    if (title) {
      title.textContent = `My Projects (${filteredProjects.length})`;
    }
  });
}

function renderPieChart(projectsGiven) {
  // Clear previous elements
  let newSVG = d3.select('svg');
  newSVG.selectAll('path').remove();

  let newLegend = d3.select('.legend');
  newLegend.selectAll('*').remove();

  // Group projects by year
  let newRolledData = d3.rollups(
    projectsGiven,
    (v) => v.length,
    (d) => d.year
  );

  // Format data for pie chart
  let newData = newRolledData.map(([year, count]) => {
    return { label: year, value: count };
  });

  // Create pie generator
  let newSliceGenerator = d3.pie().value((d) => d.value);
  let newArcData = newSliceGenerator(newData);
  
  // Create arc generator
  let newArc = d3.arc().innerRadius(0).outerRadius(50);
  
  // Color scale
  let colors = d3.scaleOrdinal(d3.schemeTableau10);

  // Get projects container for filtering
  const projectsContainer = document.querySelector('.projects');

  // Create pie chart paths
  newSVG
    .selectAll('path')
    .data(newArcData)
    .join('path')
    .attr('d', newArc)
    .attr('fill', (_, idx) => colors(idx))
    .attr('class', (_, idx) => (idx === selectedIndex ? 'selected' : ''))
    .style('cursor', 'pointer')
    .on('click', (event, d) => {
      selectedIndex = selectedIndex === d.index ? -1 : d.index;
      
      // FILTER PROJECTS BASED ON SELECTION
      filterProjectsBySelection();
      
      // Update visual selection
      renderPieChart(projectsGiven);
    });

  // Create legend
  newLegend
    .selectAll('li')
    .data(newData)
    .join('li')
    .attr('style', (_, idx) => `--color:${colors(idx)}`)
    .attr('class', (_, idx) => `legend-item ${idx === selectedIndex ? 'selected' : ''}`)
    .html(
      (d) => `<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`
    )
    .style('cursor', 'pointer')
    .on('click', (event, d) => {
      selectedIndex = selectedIndex === d.index ? -1 : d.index;
      
      // FILTER PROJECTS BASED ON SELECTION
      filterProjectsBySelection();
      
      // Update visual selection
      renderPieChart(projectsGiven);
    });

  // Helper function to filter projects based on current selection
  function filterProjectsBySelection() {
    const projectsContainer = document.querySelector('.projects');
    const title = document.querySelector('h1');
    
    if (selectedIndex === -1) {
      // Show all projects
      renderProjects(allProjects, projectsContainer, 'h2');
      if (title) {
        title.textContent = `My Projects (${allProjects.length})`;
      }
    } else {
      // Show only projects from selected year
      const selectedYear = newData[selectedIndex].label;
      const filteredProjects = allProjects.filter(project => 
        project.year === selectedYear
      );
      renderProjects(filteredProjects, projectsContainer, 'h2');
      if (title) {
        title.textContent = `My Projects (${filteredProjects.length})`;
      }
    }
  }
}

main();

