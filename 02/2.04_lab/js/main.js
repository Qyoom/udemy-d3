/*
*    main.js
*    Mastering Data Visualization with D3.js
*    2.4_lab - Selecting SVGs with D3
*/

const svg = d3.select("#chart-area").append("svg")
  .attr("width", "400px")
  .attr("height", "80px");

const rects = [
  svg.append("rect")
    .attr("class", "outside")
    .attr("x", "5px")
    .attr("y", "5px")
    .attr("width", "50px")
    .attr("height", "50px")
    .attr("fill", "green"),
  svg.append("rect")
    .attr("id", "center")
    .attr("x", "60px")
    .attr("y", "5px")
    .attr("width", "50px")
    .attr("height", "50px")
    .attr("fill", "green"),
  svg.append("rect")
    .attr("class", "outside")
    .attr("x", "115px")
    .attr("y", "5px")
    .attr("width", "50px")
    .attr("height", "50px")
    .attr("fill", "green"),
];

const caption = svg.append("text")
  .attr("id", "caption")
  .attr("x", "5px")
  .attr("y", "75px")
  .attr("font-family", "monospace");

// d3.select("rect") // first
//   .attr("stroke", "red")
//   .attr("stroke-width", "5px");

// caption.text("d3.select(\"rect\")");

// d3.select("#center")
//   .attr("stroke", "red")
//   .attr("stroke-width", "5px");

// caption.text("d3.select(\"\#center\")");

// d3.selectAll("rect")
//   .attr("stroke", "red")
//   .attr("stroke-width", "5px");

// caption.text("d3.selectAll(\"rect\")");

d3.selectAll(".outside")
  .attr("stroke", "red")
  .attr("stroke-width", "5px");

caption.text("d3.selectAll(\".outside\")");
