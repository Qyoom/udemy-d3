/*
*    main.js
*    Mastering Data Visualization with D3.js
*    Project 2 - Gapminder Clone
*/

// Dimensions
const margin = { left:80, right:20, top:50, bottom:100 };
const width = 600 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

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
	.domain([300, 150000]) //  1800 min (approx), 2014 max (approx). This fits within extent(s) that I show in my diagnostic function.
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

// Promise, data dependency
d3.json("data/data.json").then(function(data){

	function diagnostic(){
		console.log(data); // everything
		console.log(data.length); // 215 years
		console.log("Number of years: " + (2014 - 1800 + 1)); // 215
		console.log(data[0]); // first year, 1800
		console.log(data[0].year); // 1800
		console.log(data[data.length-1].year); // last year, 2014
		console.log(data[0].countries[0]); // first country in first year
		// loop through each year
		// data.forEach(year => {
		// 	console.log(year.year + " " + year.countries.length)
		// })
		// loop through each country for first year
		// data[0].countries.forEach(c => {
		// 	console.log(c.income !== null)
		// })

		console.log(`1800.countries.length: ${data[0].countries.length}`); // length of countries array for first year
		const filtered1800 = filterCountries(data[0].countries)
		console.log(`filtered1800.length: ${filtered1800.length}`); // length after filter for null
		// extent of population, first year (1800)
		console.log(`extent population 1800: ${extentProperty(filtered1800, "population")}`);
		// extent of income, first year (1800)
		console.log(`extent income 1800: ${extentProperty(filtered1800, "income")}`);

		const filtered2014 = filterCountries(data[data.length-1].countries)
		// extent of population, last year (2014)
		console.log(`extent population 2014: ${extentProperty(filtered2014, "population")}`);
		// extent of income, last year (2014)
		console.log(`extent income 2014: ${extentProperty(filtered2014, "income")}`);

		function filterCountries(year){
			return year.filter((c) => {
				return c.continent !== null && c.country !== null && c.income !== null 
				&& c.life_exp !== null && c.population !== null;
			});
		}

		function extentProperty(year, prop){ // (array of countries, string propery name)
			return [d3.extent(year, (country) => { return country[prop] })];
		}
	}
	diagnostic(data)

	// Filter out countries with null fields
	const filteredCountries = data[0].countries.filter((c) => {
		return c.continent !== null && c.country !== null && c.income !== null 
		&& c.life_exp !== null && c.population !== null;
	});

	update(filteredCountries);
	update(filteredCountries);

}).catch((err) => {
	console.log(err);
}) // d3.json

function update(data){

	// JOIN. Countries as circles
	const circles = chart.selectAll("circle") // circles references both enter and update (groups)
		.data(data, (d) => {
			return d.country; // by key
		});

	console.log(circles); // examine enter, update (groups), exit fields

	// EXIT old elements not present in new data.
	circles.exit().remove(); // TODO Needs some transition (fade out)

	// ENTER new elements present in new data...
	circles.enter() // All attr applied before merge apply only to enter selections
		.append("circle")
			.style("fill", (d) => { return continentColor(d.continent); }) // continent
			.attr("cx", (d) => { 
				return xScale(d.income); 
			}) // income
			.attr("cy", (d) => {
				return yScale(d.life_exp);
			}) // life-expectancy
			.attr("r", (d) => { 
				// I was very close!
				// return Math.sqrt(((Math.PI * (d.population**2)) / Math.PI))
				return Math.sqrt(area(d.population) / Math.PI);
			})
		// TODO: merge/update
}