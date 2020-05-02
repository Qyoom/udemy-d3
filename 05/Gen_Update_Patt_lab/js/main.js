/*
*    main.js
*    Bostock's General Update Pattern, III
*    1.0 lab
*/

const width = 960
const height = 500

const alphabet = "abcdefghijklmnopqrstuvwxyz".split("")

const chart = d3.select("#chart-area")
    .append("svg")
        .attr("width", width)
        .attr("height", height)
    .append("g").attr("transform", "translate(32," + (height / 2) + ")")

function update(data){
    // console.log(data)

    var t = d3.transition()
        .duration(750) // duration should be less than interval loop.

    // JOIN new data with old elements.
    var text = chart.selectAll("text")
        .data(data, function(d) {
            // console.log(d)
            return d
    })

    // EXIT old elements not present in new data.
    text.exit()
        .attr("class", "exit") // style color change
      .transition(t)
        .attr("y", 60) // dropping downward
        .style("fill-opacity", 1e-6) // becoming transparent
        .remove(); // gone

    // UPDATE old elements present in new data.
    text.attr("class", "update") // remaining (surviving) text style color change
        .attr("y", 0) // baseline (?)
        .style("fill-opacity", 1) // Opaque
      .transition(t)
        .attr("x", function(d, i) { return i * 32; }); // shifting horizontally

    // ENTER new elements present in new data.
    text.enter().append("text") // holders create actual text elements
        .attr("class", "enter") // style color
        .attr("dy", ".35em") // baseline adjustment ?
        .attr("y", -60) // fade in start position (from above)
        .attr("x", function(d, i) { return i * 32; })
        .style("fill-opacity", 1e-6) // fading in
        .text(function(d) { return d; }) // alphabetical character
      .transition(t)
        .attr("y", 0) // baseline
        .style("fill-opacity", 1); // opaque
}

// Grab a random sample of letters from the alphabet, in alphabetical order.
d3.interval(function() {
    update(d3.shuffle(alphabet)
        .slice(0, Math.floor(Math.random() * 26))
        .sort());
    }, 1500)

// The initial display.
update(alphabet)