/*
*    main.js
*    Mastering Data Visualization with D3.js
*    5.3_lab - Adding an update function
*/

const margin = { left:80, right:20, top:50, bottom:100 }

const width = 600 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom
    
const chart = d3.select("#chart-area")
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g") // g dimension at this point is 0x0
        .attr("transform", "translate(" + margin.left + ", " + margin.top + ")")
        .attr("id", "chart")

const xAxisGroup = chart.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height +")")

const yAxisGroup = chart.append("g")
    .attr("class", "y axis")

// X Scale
// The range is not dynamic, but the domain is.
const xScale = d3.scaleBand()
    .range([0, width])
    .padding(0.2)

// Y Scale
// The range is not dynamic, but the domain is.
const yScale = d3.scaleLinear()
    .range([height, 0]) // inverted

// X Label
chart.append("text")
    .attr("y", height + 50)
    .attr("x", width / 2)
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .text("Month")

// Y Label
chart.append("text")
    .attr("y", -60)
    .attr("x", -(height / 2))
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)")
    .text("Revenue")

// Promise, data dependency
d3.json("data/revenues.json").then(function(data){
    // console.log(data)

    // Clean data
    data.forEach(function(d) {
        d.revenue = +d.revenue
        d.profit = +d.profit
    })

    d3.interval(function(){
        update(data)
    }, 1000)

    // Run the vis for the first time
    update(data)
})

function update(data) {
    // The domain may have data dependencies, but the range does not (at least in this case).
    xScale.domain(data.map(function(d){ return d.month })) 
    yScale.domain([0, d3.max(data, function(d) { return d.revenue })])

    // X Axis
    const xAxisCall = d3.axisBottom(xScale) // For dynamic xScale domain
    xAxisGroup.call(xAxisCall)
    /* https://alignedleft.com/tutorials/d3/axes/
       https://www.animateddata.com/articles/d3/selections/ */

    // Y Axis
    const yAxisCall = d3.axisLeft(yScale) // For dynamic yScale domain
        .tickFormat(function(d){ return "$" + d })
    yAxisGroup.call(yAxisCall)

    // Bars
    const rects = chart.selectAll("rect")
        .data(data)
        
    rects.enter()
        .append("rect")
            .attr("y", function(d){ return yScale(d.revenue) })
            .attr("x", function(d){ return xScale(d.month) })
            .attr("height", function(d){ return height - yScale(d.revenue) })
            .attr("width", xScale.bandwidth)
            .attr("fill", "grey")

    console.log(rects)
}

