/*
*    main.js
*    Mastering Data Visualization with D3.js
*    6.7 - JQuery UI Slider
*/

// Dimensions
const margin = { left:80, right:20, top:50, bottom:100 };
const width = 800 - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom;

// Chart
const chart = d3.select("#chart-area")
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
				.attr("transform", "translate(" + margin.left + ", " + margin.top + ")")
				.attr("id", "chart");

// x scale log base 10 (income)
const xScale = d3.scaleLog()
	.domain([142, 182668]) 
	.range([0, width])
	.base(10);
// y scale linear (life expectancy)
const yScale = d3.scaleLinear()
	.domain([0, 90])
	.range([height, 0]) // Inverse
// area of circle scale with population domain
const area = d3.scaleLinear()
    .range([25*Math.PI, 1500*Math.PI]) // How was this determined?
    .domain([2000, 1400000000]); // This fits within extent(s) that I show in my diagnostic function.
// Ordinal scale
const continentColor = d3.scaleOrdinal(d3.schemePastel1);

// AXES
const xAxisGroup = chart.append("g")
	.attr("class", "x axis")
	.attr("transform", "translate(0," + height +")");
const xAxisCall = d3.axisBottom(xScale)
	.tickFormat(d3.format("$")) // .tickFormat((d) => { return "$" + d }) // also works
	.tickValues([400, 4000, 40000]);
	xAxisGroup.call(xAxisCall);

const yAxisGroup = chart.append("g")
	.attr("class", "y axis");
const yAxisCall = d3.axisLeft(yScale)
yAxisGroup.call(yAxisCall);

// X Label
chart.append("text")
    .attr("y", height + 50)
    .attr("x", width / 2)
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .text("GDP Per Capita ($)");
// Y Label
const yLabel = chart.append("text")
    .attr("y", -50)
    .attr("x", -(height / 2))
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)")
		.text("Life Expectancy (Years)");	
// Year Display
const yearDisp = chart.append("text")
	.attr("y", height - 10)
	.attr("x", width)
	.attr("font-size", "40px")
	.attr("text-anchor", "end")
	.style("fill", "grey");

// Legend
const continents = ["europe", "asia", "americas", "africa"];
const legend = chart.append("g")
	.attr("transform", "translate(" + (width - 10) + ", " + (height - 125) +")");

continents.forEach((continent, i) => {
	let legendRow = legend.append("g")
		.attr("transform", `translate(${0}, ${i * 20})`);

	legendRow.append("rect")
		.attr("width", 10)
		.attr("height", 10)
		.attr("fill", continentColor(continent));

	legendRow.append("text")
		.attr("x", -10)
		.attr("y", 10)
		.style("text-transform", "capitalize")
		.attr("text-anchor", "end")
		.text(continent);
})

// Tooltips
const tip = d3.tip().attr("class", "d3-tip")
	.html((d) => {
		let text = "<strong>Country:</strong> <span style='color:red'>" + d.country + "</span><br>";
		text += "<strong>Continent:</strong> <span style='color:red; text-transform:capitalize'>" + d.continent + "</span><br>";
		text += "<strong>Life Expectancy:</strong> <span style='color:red'>" + d3.format(".2f")(d.life_exp) + "</span><br>";
		text += "<strong>GDP Per Capita:</strong> <span style='color:red'>" + d3.format("$,.0f")(d.income) + "</span><br>";
		text += "<strong>Population:</strong> <span style='color:red'>" + d3.format(",.0f")(d.population) + "</span><br>";
		return text;
	});
chart.call(tip);

// Interval, iteration
let iter = 0; // advance through array of yearly data
let formattedData;
let interval;

function step(){
	iter = (iter < formattedData.length-1) ? iter+1 : 0;
	update(formattedData[iter], 1800 + iter); // I don't like this approach because it makes an assumption instead of referencing the actual datum.
}

// UI
$("#play-button")
	.on("click", function(){
		const button = $(this);
		if(button.text() == "Play"){
			button.text("Pause");
			interval = setInterval(step, 100);
		} else {
			button.text("Play");
			clearInterval(interval);
		}
}) // on click

$("#reset-button")
	.on("click", function(){
		iter = 0;
		update(formattedData[0], 1800 + iter); // Hard coded date is bad. Not dynamic or adaptive. This is why I might prefer to move functions, including UI that really need to access data into the data load function.
	})

$("#continent-select")
	.on("change", function(){
		update(formattedData[iter], 1800 + iter);
	})

$("#date-slider").slider({
	max: 2014,
	min: 1800,
	step: 1,
	slide: function(event, ui){
		iter = ui.value - 1800;
		update(formattedData[iter], ui.value); // user selected literal year value.
	}
})

/**** Promise, data dependency ****/
// data is array of objects. Each object is one year. It contains an array of country objects and a year string property.
d3.json("data/data.json").then((data) => {

	// array of all countries, filtered
	formattedData = data.map(year => {
		return year.countries.filter((country) => {
			return country.continent !== null && country.country !== null && country.income !== null 
				&& country.life_exp !== null && country.population !== null;
		})
	});

	// first time
	update(formattedData[0], data[0].year);

}).catch((err) => {
	console.log(err);
}) // d3.json

// UPDATE each year
function update(yearData, year){

	const continent = $("#continent-select").val();

	yearData = yearData.filter((d) => {
		if(continent == "all"){ return true; }
		else{
			return d.continent == continent;
		}
	});

	// JOIN. Countries as circles
	const circles = chart.selectAll("circle") // circles references both enter and update (groups)
		.data(yearData, (d) => {
			return d.country; // by key
		});

	// EXIT old elements not present in new data.
	circles.exit().remove(); // TODO Needs some transition (fade out)

	// Transition
	const t = d3.transition().duration(100);

	// ENTER new elements present in new data...
	circles.enter() // All attr applied before merge apply only to enter selections
		.append("circle")
			.attr("cx", (d) => { 
				return xScale(d.income); 
			}) // income
			.attr("cy", (d) => {
				return yScale(d.life_exp);
			}) // life-expectancy
			.attr("r", (d) => { 
				return Math.sqrt(area(d.population) / Math.PI);
			})
			.style("fill", (d) => { return continentColor(d.continent); }) // continent
			.on("mouseover", tip.show)
			.on("mouseout", tip.hide)
		.merge(circles)
			.transition(t)
				.attr("cx", (d) => { 
					return xScale(d.income); 
				}) // income
				.attr("cy", (d) => {
					return yScale(d.life_exp);
				}) // life-expectancy
				.attr("r", (d) => { 
					return Math.sqrt(area(d.population) / Math.PI);
				});

	yearDisp.text(year);

} // update function