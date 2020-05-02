/*
*    main.js
*    Mastering Data Visualization with D3.js
*    3.07_lab - D3 min, max, and extent
*/

const svg = d3.select("#chart-area").append("svg")
  .attr("width", 400)
  .attr("height", 400);

// Promise dependency on data
d3.json("data/buildings.json").then((data) => {
  console.log(data);

  data.forEach((d) => {
    d.height = +d.height;
  });

  const xScale = d3.scaleBand()
    .domain(data.map((d) => { // map returns array
      return d.name;
    }))
    .range([0, 400])
    .paddingInner(0.3)
    .paddingOuter(0.3);

  const yScale = d3.scaleLinear()
    .domain([0, d3.max(data, (d) => {
      return d.height;
    })])
    .range([0, 400]);

  const bars = svg.selectAll("rect")
    .data(data)
    .enter().append("rect")
    .attr("x", (d) => {
      return xScale(d.name);
    })
    .attr("y", (d) => {
      return (400 - yScale(d.height));
    })
    .attr("width", xScale.bandwidth)
    .attr("height", (d) => {
      return yScale(d.height)
    })
    .attr("fill", "gray");

}).catch((err) => {
  console.log(err);
});