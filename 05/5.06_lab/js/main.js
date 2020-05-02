/*
*    main.js
*    Mastering Data Visualization with D3.js
*    5.6_lab - Making our chart dynamic
*/

const margin = { left:80, right:20, top:50, bottom:100 };

const width = 600 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

let flag = true; // simple toggle
let counter = 0; // diagnostic
    
const chart = d3.select("#chart-area")
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

const xAxisGroup = chart.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height +")");

const yAxisGroup = chart.append("g")
    .attr("class", "y axis");

// X Scale
const xScale = d3.scaleBand()
    .range([0, width])
    .padding(0.2);

// Y Scale
const yScale = d3.scaleLinear()
    .range([height, 0]); // inverse, calculates negative space above bars

// X Label
chart.append("text")
    .attr("y", height + 50)
    .attr("x", width / 2)
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .text("Month");

// Y Label, dynamic
const yLabel = chart.append("text")
    .attr("y", -60)
    .attr("x", -(height / 2))
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)")
    .text("Revenue"); // initial value

d3.json("data/revenues.json").then((data) => {
    // console.log(data);

    // Clean data
    data.forEach((d) => {
        d.revenue = +d.revenue;
        d.profit = +d.profit;
    });

    d3.interval(function(){
        update(data)
        flag = !flag // toggle
    }, 1000);

    // Run the vis for the first time
    update(data);
});

function update(data) {
    const yValue = flag ? "revenue" : "profit"; // data object keys

    xScale.domain(data.map((d) => { return d.month }));
    yScale.domain([0, d3.max(data, (d) => { return d[yValue] })]) // dynamic

    // X Axis
    const xAxisCall = d3.axisBottom(xScale);
    xAxisGroup.call(xAxisCall); // Build the Axis to scale in the group element assigned to it.

    // Y Axis
    const yAxisCall = d3.axisLeft(yScale)
        .tickFormat((d) => { return "$" + d; });
    yAxisGroup.call(yAxisCall); // The position of the group element provides the position of the axis.

    // JOIN new data with old elements.
    const rects = chart.selectAll("rect")
        .data(data); // New data in enter, existing data in groups, unreferenced elements (data no longer included) in exit.

    // ENTER new elements present in new data.
    if(counter < 1) { // diagnostic conditional to show this enter needs only be called once. The data does not change, only display of alternate fields changes.
        console.log("calling enter...") // diagnostic
        counter++ // diagnostic
        rects.enter()
            .append("rect") // only new the first time in this example
                .attr("y", (d) => { return yScale(d[yValue]); })
                .attr("x", (d) => { return xScale(d.month) })
                .attr("height", (d) => { return height - yScale(d[yValue]); }) // dynamic
                .attr("width", xScale.bandwidth)
                .attr("fill", "grey")
    }

    // UPDATE old elements present in new data.
    // This is confusing. General reference provides reverence to retained elements/data
    rects
        .attr("y", (d) => { return yScale(d[yValue]); })
        .attr("x", (d) => { return xScale(d.month) })
        .attr("height", (d) => { return height - yScale(d[yValue]); }) // dynamic
        .attr("width", xScale.bandwidth)
        .attr("fill", "grey")

    // EXIT old elements not present in new data.
    rects.exit().remove()

    const label = flag ? "Revenue" : "Profit";
    yLabel.text(label);

}

