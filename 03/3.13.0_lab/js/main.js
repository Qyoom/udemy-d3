/*
*    main.js
*    Mastering Data Visualization with D3.js
*    Project 1 - 3.13.0_lab Star Break Coffee
*/

// CHART AREA, DIMENSIONS

const margin = { left:80, right:10, top:10, bottom:60 }

// These (width and height, along with padding on the x axis) are basically the dimensions of the chart (group element) before the axes elements are added.
// These are used to define the range of xScale and yScale.
const width = 500 - margin.left - margin.right
const height = 300 - margin.top - margin.bottom

/*
  const chart is reference to the group element (#chart) nested in the <svg>, 
  itself contained by #chart-area div.
  Note that an svg element functions as a mask, but the group element does not,
  which is why a nested element (text label) can be shifted in a negative direction in 
  relation to the group element's origin.) This also means that the boundaries
  of the group element expand to accomodate any objects it contains and in relation to their 
  position per the group's origin. A group has no dimension attributes of its own.
  Note that each element is positioned in respect to its parent's origin, but along its own
  x and y axes (When an element is rotated, its axes rotate along with it. Note that the 
  rotated axes are still oriended to the group element's origin). Correspondingly each element 
  has its own origin pertanent to the position of any nested (immediate child) elements.
  >>>
  [A translation] can be interpreted as shifting the origin 
  of the element’s system of coordinates – when that happens, any element whose position 
  is described with respect to that origin (the element itself and any descendants it may 
  have) gets shifted as well.
  <<< https://css-tricks.com/transforms-on-svg-elements/
  Also see https://www.dashingd3js.com/svg-group-element-and-d3js
*/
const chart = d3.select("#chart-area") 
  .append("svg") // svg includes the margins
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g") // g is given no dimensions here. Only its x,y coordinates are defined in relation to the svg element origin (per margins).
    .attr("transform", "translate(" + margin.left + ", " + margin.top + ")") // re-positioning origin of 'g'.
    .attr("id", "chart")

// Experiment to show position of nested element in relation to group element's origin.
// See comments above.
chart.append("circle")
  .attr("r", 20)
  .attr("cx", -60)
  .attr("cy", 0)
  .attr("fill", "red")

// AXIS LABLES

// X Axis Label
chart.append("text")
  .attr("id", "x-axis-label")
  .attr("x", width / 2)
  .attr("y", height + 50)
  .attr("text-anchor", "middle")
  .attr("font-size", "20px")
  .text("Month")

// Y Axis Label
chart.append("text")
  .attr("id", "y-axis-label")
  .attr("x", -(height / 2)) // The text label of the chart's Y axis has been rotated 90 degrees along with its own x and y axis, but the origin to which it is oriented and the height measurement of the parent (Correct? is the origin in the g or svg) remain the same.
  .attr("y", -60) // The previous comment applies to both axes of the rotated text label.
  .attr("text-anchor", "middle")
  .attr("font-size", "20px")
  .text("Revenue")
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
d3.json("data/revenues.json").then((data) => {
  console.log(data)

  data.forEach((d) => {
    d.revenue = +d.revenue;
    d.profit = +d.profit;
  })

  const xScale = d3.scaleBand()
    .domain(data.map((d) => {
      return d.month;
    }))
    .range([0, width])
    .paddingInner(0.2)
    .paddingOuter(0.3)

  const yScale = d3.scaleLinear()
    .domain([0, d3.max(data, function(d){
      return d.revenue
    })])
    .range([height, 0]) // Inverted relationship supports increasing y values toward top of chart. yScale subsequently calculates negative space between bar height and top of chart. See 3.10_lab

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
        return yScale(d.revenue) // Since range is inverted, output value is length of negative space between top of bar and top of chart. y value is position of top of bar.
      })
      .attr("x", (d) => { return xScale(d.month) })
      .attr("width", xScale.bandwidth)
      .attr("height", (d) => { return height - yScale(d.revenue) }) // Height of bar is height of chart minus negative space calculated by yScale. 
      .attr("fill", "grey")

  // AXES

  xAxisCall = d3.axisBottom(xScale)
  chart.append("g") // So this g will enlarge the parent g some.
    .attr("class", "x-axis")
    .attr("transform", "translate(0, " + height + ")")
    .call(xAxisCall) // Call generates text (bar labels)

  yAxisCall = d3.axisLeft(yScale)
    .tickFormat((d) => {
      return "$" + d
    })
  chart.append("g") // So this g will enlarge the parent g some.
    .attr("class", "y-axis")
    .call(yAxisCall)

}).catch((err) => {
  console.log(err)
})

