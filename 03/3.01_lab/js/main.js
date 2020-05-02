/*
*    main.js
*    Mastering Data Visualization with D3.js
*    3.01_lab - Activity: Your first visualization!
*/

d3.json("data/buildings.json").then((data) => {
  console.log(data);

  // data prep
  data.forEach((d) => {
    // console.log(typeof d.height); // The console does not indicate that this field is a string(!)
    d.height = +d.height;
    // console.log(typeof d.height); // str to num
  });

  // Scale
  const yRange = d3.scaleLinear()
    .domain([0, 828])
    .range([0, 400])

  // DOM
  const svg = d3.select("#chart-area").append("svg")
    .attr("width", "500px")
    .attr("height", "500px");

  const bars = svg.selectAll("rect")
    .data(data);

  // Examination, edification
  // let bars = svg.selectAll("rect");
  // console.log(bars);
  // bars = bars.data(data);
  // console.log(bars);
  // const arr = new Array(5); // empty array of given size
  // console.log(arr.length);
  // console.log(arr);

  bars.enter()
    .append("rect")
      .attr("x", (d, i) => {
        return (i * 30 + 30).toString().concat("px");
      })
      .attr("y", (d) => {
        return (475 - yRange(d.height)).toString().concat("px");
      })
      .attr("width", "20px")
      .attr("height", (d) => {
        return yRange(d.height).toString().concat("px");
      })

}).catch((err) => {
  console.log(err);
});