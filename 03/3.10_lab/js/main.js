/*
*    main.js
*    Mastering Data Visualization with D3.js
*    3.10_lab - Axes and Labels
*/

// CHART AREA, DIMENSIONS

const margin = { left:100, right:10, top:10, bottom:150 }

// These (width and height, along with padding on the x axis) are basically the dimensions of the 'g' (group element) before the axes elements are added.
// These are used to define the range of xScale and yScale.
const width = 500 - margin.left - margin.right
const height = 600 - margin.top - margin.bottom

const chart = d3.select("#chart-area")
  .append("svg") // svg includes the margins
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g") // g is given no dimensions here. Only its x,y coordinates are defined in relation to the svg element origin (per margins).
    .attr("transform", "translate(" + margin.left + ", " + margin.top + ")") // re-positioning origin of 'g'.
    .attr("id", "chart")

// AXIS LABLES

// X Axis Label
chart.append("text")
.attr("id", "x-axis-label")
.attr("x", width / 2)
.attr("y", height + 138)
.attr("text-anchor", "middle")
.attr("font-size", "20px")
.text("The world's tallest buildings")

// Y Axis Label
chart.append("text")
.attr("id", "y-axis-label")
.attr("x", -(height / 2)) // The text label of the chart's Y axis has been rotated 90 degrees along with its own x and y axis, but the origin to which it is oriented and the height measurement of the parent remain the same.
.attr("y", -60) // The previous comment applies to both axes of the rotated text label.
.attr("text-anchor", "middle")
.attr("font-size", "20px")
.text("height (m)")
.attr("transform", "rotate(-90)")
/* 
  Note: When an element is rotated (y axis text label in this case), so are its 
  x,y axes. The origin that the rotated x,y axes measure from in the parent remains 
  fixed where it was. The origin, contained in the parent, does not determine the 
  x,y orientation of the child element, except to provide that origin point (0,0). 
  So then the chile's own rotated x,y axes values are indeed oriented in relation 
  to the parent origin. It all makes sense once this is understood. 
*/

// PROMISE, DATA DEPENDENCY
d3.json("data/buildings.json").then((data) => {
  // console.log(data)

  data.forEach((d) => {
    d.height = +d.height;
  })

  // SCALE

  const xScale = d3.scaleBand()
    .domain(data.map((d) => {
      return d.name;
    }))
    .range([0, width])
    .paddingInner(0.3)
    .paddingOuter(0.3)

  const yScale = d3.scaleLinear()
    .domain([0, d3.max(data, function(d){
      return d.height
    })])
    .range([height, 0]) // [min is height, max is 0] Reversal of intuition because of origin at top. Requires congruent reversal of intuition when calling this yScale. What's really going on is that yScale is being applied to calculate the negative space between top of building and top of chart.

  // CHART

  /*
    rects are placed within outermost g. The xScale and yScale determine g's 
    dimensions which are basically width and height defined above 
    (however padding affects x dimension a bit). Child g's containing chart
    axes are appended which also increases parent g's dimensions.
  */
  const rects = chart.selectAll("rect") 
    .data(data);
        
  rects.enter()
    .append("rect")
      .attr("y", (d) => {
        return yScale(d.height) // Since range is inverted, output value is length of negative space between top of bar and top of chart. y value is position of top of bar.
      })
      .attr("x", (d) => { return xScale(d.name) })
      .attr("width", xScale.bandwidth)
      .attr("height", (d) => { return height - yScale(d.height) }) // Height of bar is height of chart minus negative space calculated by yScale. 
      .attr("fill", "grey")

  // AXES

  xAxisCall = d3.axisBottom(xScale)
  chart.append("g") // So this g will enlarge the parent g some.
    .attr("class", "x-axis")
    .attr("transform", "translate(0, " + height + ")")
    .call(xAxisCall) // Call generates text (bar labels)
    .selectAll("text") // So then the text can be formatted
    .attr("x", "-5")
    .attr("y", "10")
    .attr("text-anchor", "end")
    .attr("transform", "rotate(-40)")

  yAxisCall = d3.axisLeft(yScale)
    .ticks(3)
    .tickFormat((d) => {
      return d + "m"
    })
  chart.append("g") // So this g will enlarge the parent g some.
    .attr("class", "y-axis")
    .call(yAxisCall)

}).catch((err) => {
  console.log(err)
})