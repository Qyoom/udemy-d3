/*
*    main.js
*    Mastering Data Visualization with D3.js
*    2.8 - Activity: Your first visualization!
*/

d3.json("data/buildings.json").then((data) => {
  console.log(data);

  data.forEach((d) => {
    // console.log(typeof d.height); // The console does not indicate that this field is a string(!)
    d.height = +d.height;
    // console.log(typeof d.height);
  });

  const svg = d3.select("#chart-area").append("svg")
    .attr("width", "500px")
    .attr("height", "500px");

  const bars = svg.selectAll("rect")
    .data(data);

  bars.enter()
    .append("rect")
      .attr("x", (d, i) => {
        return (i * 30 + 30).toString().concat("px");
      })
      .attr("y", (d) => {
        return (400 - d.height).toString().concat("px");
      })
      .attr("width", "20px")
      .attr("height", (d) => {
        return (d.height).toString().concat("px");
      })

}).catch((err) => {
  console.log(err);
});