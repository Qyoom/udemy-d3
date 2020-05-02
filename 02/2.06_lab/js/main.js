/*
*    main.js
*    Mastering Data Visualization with D3.js
*    2.6_lab - Selections and data joins
*/

const data = [25, 20, 10, 12, 15];

const svg = d3.select("#chart-area").append("svg")
  .attr("width", "400px")
  .attr("height", "400px");

const circles = svg.selectAll("circle")
  .data(data);

// The data array is iterated for each attr before moving to the next attr.
circles.enter()
  .append("circle")
    .attr("cx", function(d, i){
      console.log(`attr cx - data: ${d}, index: ${i}`)
      return String(i * 50 + 25).concat("px");
    })
    .attr("cy", (d, i) => { // This is the ES6 way to express an anonymous function
      console.log(`attr cy - data: ${d}, index: ${i}`)
      return "200px"
    })
    .attr("r", (d, i) => {
      console.log(`attr r - data: ${d}, index: ${i}`)
      return String(d).concat("px");
    })
    .attr("fill", function(d, i){
      console.log(`attr fill - data: ${d}, index: ${i}`)
      return "red";
    });

