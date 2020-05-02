/*
*    main.js
*    Mastering Data Visualization with D3.js
*    3.00_lab - Linear scales
*/

const yRange = d3.scaleLinear()
  .domain([0, 828])
  .range([0, 400])

// Domain to Range
console.log(`Domain: 400, Range: ${yRange(400).toFixed(1)}`);
console.log(`Domain: 100, Range: ${yRange(100).toFixed(1)}`);
console.log(`Domain: 414, Range: ${yRange(414).toFixed(1)}`);
console.log(`Domain: 700, Range: ${yRange(700).toFixed(1)}`);
console.log(`Domain: 700, Range: ${(yRange(700).toFixed(1))}`);

// Range to Domain
// Invert is used to get the location of the cursor on the screen.
console.log("--invert--")
console.log(`Range: 48.3, Domain: ${yRange.invert(48.3).toFixed(1)}`);
console.log(`Range: 200, Domain: ${yRange.invert(200).toFixed(1)}`);



