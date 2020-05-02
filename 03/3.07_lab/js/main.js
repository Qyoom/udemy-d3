/*
*    main.js
*    Mastering Data Visualization with D3.js
*    3.07_lab - D3 min, max, and extent
*/

const width = 400;
const height = 400;

const svg = d3.select("#chart-area").append("svg")
  .attr("width", width)
  .attr("height", height);

// Promise, async data dependency
d3.json("data/buildings.json").then((data) => {
  console.log(data);

  const xScale = d3.scaleBand()
    .domain(data.map((d) => { // returns array with the 0 as min and the data propery representing the x band length (guessing)
      return d.name;
    }))
    .range([0, width])
    .paddingInner(0.3)
    .paddingOuter(0.3);

  const yScale = d3.scaleLinear()
    .domain([0, d3.max(data, (d) => {
      return d.height;
    })])
    .range([0, height])

  const bars = svg.selectAll("rect")
    .data(data);

  bars.enter().append("rect")
    .attr("x", (d) => {
      return xScale(d.name);
    })
    .attr("y", (d) => {
      return height - yScale(d.height);
    })
    .attr("width", xScale.bandwidth)
    .attr("height", (d) => {
      return yScale(d.height)
    })
    .attr("fill", "grey");

}).catch((err) => {
  console.log(err);
});