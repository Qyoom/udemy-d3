/*
*    main.js
*    Mastering Data Visualization with D3.js
*    5.8_lab - Scatter Plot
*/

const margin = { left:80, right:20, top:50, bottom:100 }

const width = 600 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom

let flag = true // toggle

const t = d3.transition().duration(750)
    
const chart = d3.select("#chart-area")
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform", "translate(" + margin.left + ", " + margin.top + ")")

const xAxisGroup = chart.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height +")")

const yAxisGroup = chart.append("g")
    .attr("class", "y axis")

// X Scale
const xScale = d3.scaleBand()
    .range([0, width])
    .padding(0.2)

// Y Scale
const yScale = d3.scaleLinear()
    .range([height, 0]) // Inverse. Calculates negative space above circle. Unlike bars (rect) there is no dimensional height so the negative space (distance from top) is correct for y scale position of circle.

// X Label
chart.append("text")
    .attr("y", height + 50)
    .attr("x", width / 2)
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .text("Month")

// Y Label
const yLabel = chart.append("text")
    .attr("y", -60)
    .attr("x", -(height / 2))
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)")
    .text("Revenue")

d3.json("data/revenues.json").then((data) => {
    // console.log(data)

    // Clean data
    data.forEach((d) =>  {
        d.revenue = +d.revenue
        d.profit = +d.profit
    })

    d3.interval(function(){
        const newData = flag ? data : data.slice(1) // No profit data for January
        update(newData)
        flag = !flag
    }, 1000)

    // Run the vis for the first time
    update(data)
})

function update(data) {
    const value = flag ? "revenue" : "profit"

    xScale.domain(data.map((d) => { return d.month })) // acts as the id (reliable unit counter in this case)
    yScale.domain([0, d3.max(data, (d) => { return d[value] })])

    // X Axis
    const xAxisCall = d3.axisBottom(xScale)
    xAxisGroup.transition(t).call(xAxisCall)

    // Y Axis
    const yAxisCall = d3.axisLeft(yScale)
        .tickFormat((d) => { return "$" + d })
    yAxisGroup.transition(t).call(yAxisCall)

    // JOIN new data with old elements.
    const circles = chart.selectAll("circle") // circles references both enter and update (groups)
        .data(data, (d) => {
            // console.log(d.month)
            return d.month // Second optional param acts as an id to enable keeping track of change in order of data.
        })

    // console.log(circles) // examine enter, update (groups), exit fields

    // EXIT old elements not present in new data.
    circles.exit()
        .attr("fill", "red")
    .transition(t) // transition affects the following three attr.
        .attr("cy", yScale(0)) // Since the domain is inverse, This causes the negative space above the bar to be equal to height.
        .remove()

    // ENTER new elements present in new data...
    circles.enter() // All attr applied before merge apply only to enter selections
        .append("circle")
            .attr("fill", "grey")
            .attr("cy", yScale(0)) // Inverse calculation of negative space above bar. They're all new on the first enter and so have 0 height and maximum negative space above bar (i.e. 0 height and maximum y position equal to the height constant); So all bars start with height of 0 for their first appearance and transition to scaled data value. On alternate iterations January is a new datum and starts from 0 and transitions to data height.
            .attr("cx", (d) => { return xScale(d.month) + xScale.bandwidth() / 2 }) // This looks redundant, but the effect is not. This specification is important to enter.
            .attr("r", 5)
        // AND UPDATE old elements present in new data.
        .merge(circles) // merge eliminates redundant code in enter and update (compare with previous versions). All attr appied after merge apply to both enter and update selections.
            .transition(t)
                .attr("cx", (d) => { return xScale(d.month) + xScale.bandwidth() / 2 })
                .attr("cy", (d) => { return yScale(d[value]) })

    const label = flag ? "Revenue" : "Profit"
    yLabel.text(label)

}


