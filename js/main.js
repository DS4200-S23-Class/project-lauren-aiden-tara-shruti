// Display Data
function displayData() {
    // Read data 
    d3.csv("data/SDSS2.csv", fileEncoding="UTF-8-BOM").then((data) => {
    

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
  d3.csv("data/SDSS2.csv").then((data) => { 


    const MAX_X1 = d3.max(data, (d) => { return parseInt(d.ra); });
    const MAX_Y1 = d3.max(data, (d) => { return parseInt(d.dec); });

    const X_SCALE1 = d3.scaleLinear() 
                        .domain([0, (MAX_X1 + 1)]) 
                        .range([0, VIS_WIDTH]);

    const Y_SCALE1 = d3.scaleLinear() 
                        .domain([0, (MAX_Y1 + 1)]) 
                        .range([VIS_HEIGHT, 0]);

   // const color = d3.scaleSequential()
    	//			.domain(d3.extent(data, d => d.color))
   	//			 	.interpolator(d3.interpolateBlues);

    const color = d3.scaleOrdinal()

                  .domain(["STAR", "GALAXY", "QSO" ])
                 .range([ "royalblue", "violet", "green"])



                .domain(["STAR", "GALAXY", "QSO" ])
                .range([ "royalblue", "violet", "green"])
  

    // Add x axis
    FRAME1.append("g") 
            .attr("transform", "translate(" + MARGINS.left + 
                "," + (VIS_HEIGHT + MARGINS.top) + ")") 
            .call(d3.axisBottom(X_SCALE1).ticks(5)) 
            .attr("font-size", '20px');

    // Text label for the x axis
    FRAME1.append("text")             
            .attr("transform",
            "translate(" + (VIS_WIDTH/2) + " ," + 
                           (VIS_HEIGHT + MARGINS.top + 20) + ")")
            .style("text-anchor", "middle")
            .text("Declination");

    // Add y axis 
    FRAME1.append("g")
            .attr("transform", 
                "translate(" + MARGINS.left + "," + (MARGINS.bottom) + ")")
            .call(d3.axisLeft(Y_SCALE1).ticks(10))
            .attr("font-size", "10px");

    // Text label for the y axis
    FRAME1.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - MARGINS.left)
      .attr("x",0 - (VIS_HEIGHT / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("right-ascension");   

  	// Add points
    pts1 = FRAME1.selectAll("points")  
          .data(data) 
          .enter()       
          .append("circle")  
            .attr("cx", (d) => { return (X_SCALE1(d.ra) + MARGINS.left); }) 
            .attr("cy", (d) => { return (Y_SCALE1(d.dec) + MARGINS.top); }) 
            .attr("r", 3)
            .attr("fill", d => color(d.class))
            .attr("opacity", 0.5)
            .attr("class", "point");



    // Add brushing

  // Add brushing

    FRAME1.call( d3.brush()                 // Add the brush feature using the d3.brush function
            .extent( [ [0,0], [FRAME_WIDTH, FRAME_HEIGHT] ] ) // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
            .on("start brush", updateChart) // Each time the brush selection changes, trigger the 'updateChart' function
    )

    // Function that is triggered when brushing is performed
    function updateChart(event) {
        const extent = event.selection;
        pts1.classed("selected", function(d){return isBrushed(extent, (X_SCALE1(d.ra) + MARGINS.left), (Y_SCALE1(d.dec) + MARGINS.top))})                                                      
        bars1.classed("selected", function(d){return isBrushed(extent, (X_SCALE1(d.ra) + MARGINS.left), (Y_SCALE1(d.dec) + MARGINS.top))})};     

    // A function that return TRUE or FALSE according if a dot is in the selection or not
    function isBrushed(brush_coords, cx, cy) {
       var x0 = brush_coords[0][0],
           x1 = brush_coords[1][0],
           y0 = brush_coords[0][1],
           y1 = brush_coords[1][1];
      return x0 <= cx && cx <= x1 && y0 <= cy && cy <= y1};    // This return TRUE or FALSE depending on if the points is in the selected area
    // somehow store the cx and  cy of points that return TRUE, store them in numBrushed to be used for build_bar below
})};

build_scatter()



// Bar graph 
const FRAME2 = d3.select("#bar")
                    .append("svg")
                    .attr("height", FRAME_HEIGHT)
                    .attr("width", FRAME_WIDTH)
                    .attr("class", "frame"); 

function build_bar(/*brushPoints = numBrushed*/) {
// Open file
d3.csv("data/SDSS2.csv").then((data) => {

    const X_SCALE2 = d3.scaleBand()
                           .range([0, VIS_WIDTH])
                           .domain(data.map((d) => {return d.class;}))
                           .padding(.3);

    const Y_SCALE2 = d3.scaleLinear()
                           .range([VIS_HEIGHT, 0])
                           .domain([0,100])


    const color = d3.scaleOrdinal()
                  .domain(["STAR", "GALAXY", "QSO" ])
                 .range([ "royalblue", "violet", "green"])


    // Adding X Axis 
    FRAME2.append("g") 
            .attr("transform", "translate(" + MARGINS.left + "," + 
                (VIS_HEIGHT + MARGINS.top) + ")") 
            .call(d3.axisBottom(X_SCALE2))
            .attr("font-size", '20px'); 

    // Adding Y Axis
    FRAME2.append("g")
            .attr("transform", 
                "translate(" + MARGINS.left + "," + (MARGINS.bottom) + ")")
            .call(d3.axisLeft(Y_SCALE2).ticks(2))
            .attr("font-size", "20px");

      function brushed() {
    var e = brush.extent(), selectedData;
    if(dots) {
      dots.each(function(d) { d.selected = false; });
      selectedData = search(e[0][0], e[0][1], e[1][0], e[1][1]);
      dots.classed('selected', function(d) { return d.selected; });
    }
    model.selectedData = brush.empty() ? model.data : selectedData;
  }


    // Adding bars
    bars1 =  FRAME2.selectAll(".bar")
            .data(data)
            .enter()
            .append("rect")
                .attr("x", (d) => { return (X_SCALE2(d.class) + MARGINS.left); }) 
                .attr("width", X_SCALE2.bandwidth())
                .attr("y", (d) => {return Y_SCALE2(50) + MARGINS.top})
                .attr("height", (d) => { return VIS_HEIGHT - Y_SCALE2(50)})
                .attr("fill", (d) => { return color(d.class);})
                .attr("opacity", 0.5)
                .attr("class", "bar");

    // // Tooltip for bar graph
    // const TOOLTIP1 = d3.select("#bar")
    //                     .append("div")
    //                     .attr("class", "tooltip")
    //                     .style("opacity", 0);

    // // Show class of each bar and the amount of points selected with tooltip
    // function handleMousemove(event, d) {
    //     TOOLTIP1.html("Class: " + d.class + "<br>Amount Selected: " + ???) ISSUE
    //             .style("left", (event.pageX + 10) + "px")                                          
    //             .style("top", (event.pageY - 50) + "px"); 
    // }

    // function handleMouseleave(event, d) {
    //     TOOLTIP1.style("opacity", 0);
    // }

    // FRAME2.selectAll(".bar")
    //         .on("mousemove", handleMousemove)
    //         .on("mouseleave", handleMouseleave); //add event listeners

})};


build_bar()




