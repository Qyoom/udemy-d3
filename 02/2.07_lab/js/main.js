/*
*    main.js
*    Mastering Data Visualization with D3.js
*    2.7_lab - Loading external data
*/

// Everything is enclosed by the promise method (d3.json, d3.csv, d3.tsv)
d3.tsv("data/ages.tsv").then((data)=>{
  data.forEach((d)=>{
    d.age = +d.age;
  })
  //console.log(data);

  const svg = d3.select("#chart-area").append("svg")
    .attr("width", "400px")
    .attr("height", "400px");

  const circles = svg.selectAll("circles")
    .data(data);

  circles.enter()
    .append("circle")
      .attr("cx", (d, i) => {
        return String(i * 50 + 25).concat("px");
      })
      .attr("cy", (d, i) => { // This is the ES6 way to express an anonymous function
        return "200px"
      })
      .attr("r", (d, i) => {
        return String(d.age * 2).concat("px"); 
      })
      .attr("fill", (d, i) => {
        if(d.age >= 10){
          return "red";
        } else {
          return "blue";
        }
      });
}).catch((error)=>{
  console.log(error);
});