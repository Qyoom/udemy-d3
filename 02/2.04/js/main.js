/*
*    main.js
*    Mastering Data Visualization with D3.js
*    2.4 - Adding SVGs with D3
*/

const svg = d3.select("#chart-area").append("svg")
	.attr("width", 400)
	.attr("height", 400);

const circle = svg.append("circle")
	.attr("cx", 100)
	.attr("cy", 250)
	.attr("r", 70)
	.attr("fill", "grey");

const rectangle = svg.append("rect")
	.attr("x", 200)
	.attr("y", 20)
	.attr("width", 100)
	.attr("height", 30)
	.attr("fill", "green");

const rectangle2 = svg.append("rect")
	.attr("x", 300)
	.attr("y", 50)
	.attr("width", 150)
	.attr("height", 40)
	.attr("fill", "red");

const line = svg.append("line")
	.attr("x1", 80)
	.attr("y1", 50)
	.attr("x2", 300)
	.attr("y2", 300)
	.attr("stroke-width", 5)
	.attr("stroke", "red");

const elipse = svg.append("ellipse")
	.attr("cx", 250)
	.attr("cy", 225)
	.attr("rx", 100)
	.attr("ry", 75)
	.attr("fill", "green");

const path = svg.append("path")
	.attr("d", "M10 80 C 40 10, 65 10, 95 80 S 150 150, 180 80")
	.attr("stroke-width", 5)
	.attr("stroke", "orange")
	.attr("fill", "transparent")