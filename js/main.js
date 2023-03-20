// Display Data
function displayData() {
    // Read data 
    d3.csv("data/SDSS.csv").then((data) => {
  
      // check for our data
      console.log(data);
    })}

displayData()

// Constants for visualizations
const FRAME_HEIGHT = 300;
const FRAME_WIDTH = 450; 
const MARGINS = {left: 50, right: 50, top: 50, bottom: 50};
const VIS_HEIGHT = FRAME_HEIGHT - MARGINS.top - MARGINS.bottom;
const VIS_WIDTH = FRAME_WIDTH - MARGINS.left - MARGINS.right; 


// Scatterplot
const FRAME1 = d3.select("#scatter")
                  .append("svg")
                    .attr("height", FRAME_HEIGHT)
                    .attr("width", FRAME_WIDTH)
                    .attr("class", "frame"); 
 
function build_scatter() {
  // Open file
  d3.csv("data/SDSS.csv").then((data) => { 



    const MAX_X1 = d3.max(data, (d) => { return parseInt(d.ra); });
    const MAX_Y1 = d3.max(data, (d) => { return parseInt(d.dec); });

    const X_SCALE1 = d3.scaleLinear() 
                        .domain([0, (MAX_X1 + 1)]) 
                        .range([0, VIS_WIDTH]);

    const Y_SCALE1 = d3.scaleLinear() 
                        .domain([0, (MAX_Y1 + 1)]) 
                        .range([VIS_HEIGHT, 0]);

    const color = d3.scaleSequential()
    				.domain(d3.extent(data, d => d.color))
   				 	.interpolator(d3.interpolateBlues);

    // Add x axis
    FRAME1.append("g") 
            .attr("transform", "translate(" + MARGINS.left + 
                "," + (VIS_HEIGHT + MARGINS.top) + ")") 
            .call(d3.axisBottom(X_SCALE1).ticks(10)) 
            .attr("font-size", '20px');

    // Add y axis 
    FRAME1.append("g")
            .attr("transform", 
                "translate(" + MARGINS.left + "," + (MARGINS.bottom) + ")")
            .call(d3.axisLeft(Y_SCALE1).ticks(10))
            .attr("font-size", "10px");

  	// Add points
   pts1 = FRAME1.selectAll("points")  
          .data(data) 
          .enter()       
          .append("circle")  
            .attr("cx", (d) => { return (X_SCALE1(d.ra) + MARGINS.left); }) 
            .attr("cy", (d) => { return (Y_SCALE1(d.dec) + MARGINS.top); }) 
            .attr("r", 4)
            .attr("fill", d => color(d.color))
            .attr("opacity", 0.5)
            .attr("class", "point");})}

build_scatter()