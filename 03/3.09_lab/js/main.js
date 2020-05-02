/*
*    main.js
*    Mastering Data Visualization with D3.js
*    3.09_lab - Margins and groups
*/

const margin = { left:100, right:10, top:10, bottom:100 };

// These (width and height, along with padding on the x axis) are basically the dimensions of the 'g' (group element).
// These are used to define the range of xScale and yScale.
const width = 600 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;

const g = d3.select("#chart-area")
  .append("svg") // svg includes the margins
    .attr("width", width + margin.left + margin.right) // 600
    .attr("height", height + margin.top + margin.bottom) // 400
  .append("g") // g is given no dimensions here. Only its x,y coordinates are defined in relation to the svg element origin (per margins).
    .attr("transform", "translate(" + margin.left + ", " + margin.top + ")") // re-positioning origin of 'g'.

// All data dependecy
d3.json("data/buildings.json").then((data) => {
  // console.log(data);

  data.forEach((d) => {
    d.height = +d.height;
  });

  const xScale = d3.scaleBand()
    .domain(data.map((d) => {
      return d.name;
    }))
    .range([0, width]) // [0, 490]
    .paddingInner(0.3)
    .paddingOuter(0.3); // paddings add up to 40.27. But that doesn't look right visually. There's something I'm not getting.

  const yScale = d3.scaleLinear()
    .domain([0, d3.max(data, function(d){
      return d.height;
    })])
    .range([0, height]); // [0, 290]

  /*
    rects are placed within g. The xScale and yScale determine g's 
    dimensions which are basically width and height defined above 
    (however padding affects x dimension a bit).
  */
  const rects = g.selectAll("rect") 
    .data(data);
        
  rects.enter()
    .append("rect")
      // .attr("y", (d) => {
      //   return height - yScale(d.height);
      // })
      // .attr("x", (d) => { return xScale(d.name); })
      // .attr("width", xScale.bandwidth)
      // .attr("height", (d) => { return yScale(d.height); })
      // .attr("fill", "grey");

}).catch((err) => {
  console.log(err);
})