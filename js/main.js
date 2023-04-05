// Display data in the console
function displayData() {
  // Read data 
  d3.csv("data/SDSS2.csv", fileEncoding="UTF-8-BOM").then((data) => {
  
    // check for our data
    //console.log(data);
  })};

displayData();
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Push selected values to array on click, attach plotting event to button
let elems = [];
button = document.querySelector('#submit-button');
button.addEventListener('click', setSelectedOptions);

// Function to grab all the boxes that are checked and build the scatter plot with those points
function setSelectedOptions (){
elems = [];
let choices = document.querySelectorAll('input:checked');
for (let i = 0; i < choices.length; i++) {
  elems.push(choices[i].value);
}
build_scatter(elems);    
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Initialize the list of brushed points from the scatterplot
let brushed_points = [];

// Constants for visualizations
const FRAME_HEIGHT = 300;
const FRAME_WIDTH = 450; 
const MARGINS = {left: 50, right: 50, top: 50, bottom: 50};
const VIS_HEIGHT = FRAME_HEIGHT - MARGINS.top - MARGINS.bottom;
const VIS_WIDTH = FRAME_WIDTH - MARGINS.left - MARGINS.right; 

// Scatterplot Frame 
const FRAME1 = d3.select("#scatter")
                .append("svg")
                  .attr("height", FRAME_HEIGHT)
                  .attr("width", FRAME_WIDTH)
                  .attr("class", "frame"); 

//Bar graph Frame
const FRAME2 = d3.select("#bar")
                  .append("svg")
                  .attr("height", FRAME_HEIGHT)
                  .attr("width", FRAME_WIDTH)
                  .attr("class", "frame");

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Function for the user-defined bar graph
function build_a_bar(brushed_data) {
  
  // refresh plot every time function is called
  d3.selectAll(".bars").remove();

  // create array of objects with selected classes and associated values
  const objects = brushed_data.map(d => {
    const [x, y, cls, value] = d.slice(1, -1).split(',');
    return { x: +x, y: +y, class: cls, value: +value };
  });
  
  // Group the objects by class and compute the mean value
  const groups = d3.group(objects, d => d.class);
  const means = new Map([...groups].map(([cls, objects]) => [cls, d3.mean(objects, d => d.value)]));
  
  // Set a color scale to be used
  const color = d3.scaleOrdinal()
              .domain(["STAR", "GALAXY", "QSO" ])
              .range([ "red", "gold", "deepskyblue"]);

  // Define the x scale and axis
  const X_SCALE = d3.scaleLinear()
    .domain([0, .6])
    .range([0, FRAME_WIDTH - MARGINS.left - MARGINS.right]);
  
  const xAxis = d3.axisBottom(X_SCALE)
    .ticks(15)
    .tickFormat(d => `${d}`);

  // Define the y scale and axis
  const Y_SCALE = d3.scaleBand()
    .domain(['STAR', 'GALAXY', 'QSO'])
    .range([0, FRAME_HEIGHT - MARGINS.top - MARGINS.bottom])
    .padding(0.1);

  const yAxis = d3.axisLeft(Y_SCALE);

  // Append the x axis to the SVG element
  FRAME2.append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(${MARGINS.left}, ${FRAME_HEIGHT - MARGINS.bottom})`)
    .call(xAxis);

  // Append the y axis to the SVG element
  FRAME2.append("g")
    .attr("class", "y-axis")
    .attr("transform", `translate(${MARGINS.left}, ${MARGINS.top})`)
    .call(yAxis);

  // Add the bars to the chart
  FRAME2.append('g')
    .attr('class', 'bars')
    .attr('transform', `translate(${MARGINS.left}, ${MARGINS.top})`)
    .selectAll('rect')
    .data([...means.entries()])
    .enter()
    .append('rect')
    .attr('x', 0)
    .attr('y', d => Y_SCALE(d[0]))
    .attr('width', d => X_SCALE(d[1]))
    .attr('height', Y_SCALE.bandwidth())
    .attr('fill', d => color(d[0]));
};


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Function for the user-defined scatter plot
function build_scatter(options) {

// Open file
d3.csv("data/SDSS2.csv").then((data) => {
   
   // Remove the previous plot to avoid stacking
   d3.selectAll(".point").remove();

  // Filter data to include only user-selected classes  
  filteredData = [];
  for (let i = 0; i < options.length; i++) {
    const option = options[i];
    const filtered = data.filter(function(row) {
      return row['class'] === option;
    });
    filteredData.push(...filtered);
  };


  // Define x and y constants to be used for axes
  const MAX_X1 = d3.max(data, (d) => { return parseInt(d.dec); });
  const MAX_Y1 = d3.max(data, (d) => { return parseInt(d.ra); });

  const X_SCALE1 = d3.scaleLinear() 
                      .domain([(-(MAX_X1) - 1), (MAX_X1 + 1)]) 
                      .range([0, VIS_WIDTH]);

  const Y_SCALE1 = d3.scaleLinear() 
                      .domain([0, (MAX_Y1 + 1)]) 
                      .range([VIS_HEIGHT, 0]);

  // Set color scale
  const color = d3.scaleOrdinal()
              .domain(["STAR", "GALAXY", "QSO" ])
              .range([ "red", "gold", "deepskyblue"]);

    // Add x axis
    FRAME1.append("g") 
            .attr("transform", "translate(" + MARGINS.left + 
            "," + (VIS_HEIGHT + MARGINS.top) + ")") 
            .call(d3.axisBottom(X_SCALE1).tickValues([-2.0, -1.5, -1.0, -0.5, 0.0, 0.5, 1.0, 1.5, 2.0])
                                 .tickFormat((d, i) => [-2.0, -1.5, -1.0, -0.5, 0.0, 0.5, 1.0, 1.5, 2.0] [i])) 
            .attr("font-size", '10px');

    // Add y axis 
    FRAME1.append("g")
            .attr("transform", 
            "translate(" + (X_SCALE1(0) + MARGINS.left) + "," + (MARGINS.bottom) + ")")
             .call(d3.axisLeft(Y_SCALE1).tickValues([0, 50, 100, 150, 200, 245])
                               .tickFormat((d, i) => [0, 50, 100, 150, 200, 245] [i])) 
             .attr("font-size", "10px");

    // Add legend
    function plotLegendCircle(cx, cy, cls) {
      FRAME1.append("circle")
            .attr("cx",cx)
            .attr("cy",cy)
            .attr("class", "legend-circle")
            .attr("id", cls);
    };

    function plotLegendText(cx, cy, cls, txt) {
      FRAME1.append("text")
            .attr("x", cx)
            .attr("y", cy)
            .text(txt)
            .attr("class", "text")
            .attr("id", cls);
    };

    plotLegendCircle(60,60,"star");
    plotLegendCircle(60,80,"galaxy");
    plotLegendCircle(60,100,"qso");

    plotLegendText(70,65,"star", "Star");
    plotLegendText(70,85,"galaxy", "Galaxy");
    plotLegendText(70,106,"qso", "Quasar");


  // Add points
  pts1 = FRAME1.selectAll("points")  
          .data(filteredData) 
          .enter()       
          .append("circle")  
            .attr("cx", (d) => { return (X_SCALE1(d.dec) + MARGINS.left); }) 
            .attr("cy", (d) => { return (Y_SCALE1(d.ra) + MARGINS.top); }) 
            .attr("r", 3)
            .attr("fill", d => color(d.class))
            .attr("opacity", 0.5)
            .attr("class", "point");

  // Add brushing
  FRAME1.call(d3.brush()           
  .extent( [ [MARGINS.left,MARGINS.top], [FRAME_WIDTH-50, FRAME_HEIGHT-50] ] ) 
  .on("start brush", updateChart) // Each time the brush selection changes, trigger the 'updateChart' function
  );

 
 //Function that is triggered when brushing is performed
 function updateChart(event) {
      const extent = event.selection;
      k = d3.brush();
      pts1.classed("selected", function(d) {return isBrushed(extent, (X_SCALE1(d.dec) + MARGINS.left), (Y_SCALE1(d.ra) + MARGINS.top), d.dec, d. ra, d.class, d.redshift)});
      console.log(brushed_points);
      build_a_bar(brushed_points);
      brushed_points = [];
    };  

 // Function that return TRUE or FALSE according if a dot is in the selection or not
 function isBrushed(brush_coords, cx, cy, d_x, d_y, d_class, redshift) {
  const x0 = brush_coords[0][0],
        x1 = brush_coords[1][0],
        y0 = brush_coords[0][1],
        y1 = brush_coords[1][1];
  if (x0 <= cx && cx <= x1 && y0 <= cy && cy <= y1) {
    brushed_points.push("(" + d_x + "," + d_y + "," + d_class + "," + redshift + ")");
  };

  return brushed_points, x0 <= cx && cx <= x1 && y0 <= cy && cy <= y1};  // This returns TRUE or FALSE depending on if the points is in the selected area

})};


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Function for the telescope band histograms
function build_histo_all(band_type) {

  // Set padding to be used for making the visualizations
  const padding = 50;

  d3.csv("data/SDSS2.csv").then((data) => {

    // Function to return which id the histogram belongs to based off its band type
    function  get_band(d, band_type){
      if(band_type === "u") {
              return d.u;
            } 
      else if (band_type === "g") {
              return d.g;
            } 
      else if (band_type === "r"){
              return d.r;
            }
      else if (band_type === "i"){
              return d.i;
            }
      else if (band_type === "z"){
              return d.z;
            }
    };

    // Map is a constant that will grab all the bands
    // Subtract 13 to remove white space from histogram on x axis
    const map = data.map(function (d) { return (parseInt(get_band(d, band_type)) - 13)});

    // Define the histogram
    const histogram = d3.histogram()
                        .thresholds(5)
                        (map);

    const x = d3.scaleLinear()
                .domain([0, d3.max(map)])
                .range([0, 280]);


    const y = d3.scaleLinear()
                .domain([0, d3.max(histogram.map(function (d) { return d.length; }))])
                .range([VIS_HEIGHT, 0]);

    // Function to return which id the histogram belongs to based off its band type
    function frame_num(band_type){
      if(band_type === "u") {
              return "#histo1";
            } 
      else if (band_type === "g") {
              return "#histo2";
            } 
      else if (band_type === "r"){
              return "#histo3";
            }
      else if (band_type === "i"){
              return "#histo4";
            }
      else if (band_type === "z"){
              return "#histo5";
            }
      };

     // Define the frame the histogram will be slotted into
     const FRAME = d3.select(frame_num(band_type))
                    .append("svg")
                    .attr("height", FRAME_HEIGHT)
                    .attr("width", 380)
                    .attr("class", "frame");

              
    FRAME.select(frame_num(band_type))
            .append("svg")
            .attr("width", 380)
            .attr("height", VIS_HEIGHT + padding);


    // Add x-axis and relabel ticks to make depiction of data accurate, from subtracting 13 earlier
    FRAME.append("g") 
              .attr("transform", "translate(" + MARGINS.left + 
              "," + (VIS_HEIGHT + MARGINS.top) + ")") 
              .call(d3.axisBottom(x).tickValues([0, 1, 2, 3, 4, 5, 6])
                                   .tickFormat((d, i) => [13, 14, 15, 16, 17, 18, 19] [i])) 
              .attr("font-size", '10px');

    // Add y-axis 
    FRAME.append("g")
            .attr("transform", "translate(" +(x(0) + MARGINS.left) + "," + (MARGINS.bottom) + ")")
            .call(d3.axisLeft(y));

    // Function to return which color the histogram belongs to based off its band type
    function getColor() {
     if(band_type === "u") {
              return "violet";
            } 
      else if (band_type === "g") {
              return "darkturquoise";
            } 
      else if (band_type === "r"){
              return "limegreen";
            }
      else if (band_type === "i"){
              return "orange";
            }
      else if (band_type === "z"){
              return "firebrick";
            }
      };

    // Append bars to the histogram
    hist1 = FRAME.selectAll(".bar")
            .data(histogram)
            .enter()
            .append("rect")
              .attr("x", function (d) { return (x(d.x1-(d.x1-d.x0))) + MARGINS.left;})
              .attr("y", function (d) { return  (y(d.length)) + MARGINS.top; })
              .attr("width", function (d) { return x(d.x1-d.x0); })
              .attr("height", function (d) { return VIS_HEIGHT - y(d.length); })
              .attr("fill", function(d) { return getColor(d);})
              .attr("class", "histo");

    // Adding tooltip when you hover over the histogram

    const TOOLTIP = d3.select(frame_num(band_type))
                            .append("div")
                            .attr("class", "tooltip")
                            .style("opacity", 0);

    // Change color by hovering
    function handleMouseover(event, d) {
      // on mouseover, change color
      TOOLTIP.style("opacity", 1);
    };

    // Show value of each bar with tooltip
    function handleMousemove(event, d) {
    TOOLTIP.html("Count: " + d.length + " out of 450" + " (" 
                  + Math.round(((d.length/450)*100 + Number.EPSILON) * 100) / 100 + "%)")  // Math function rounds to two decimals
            .style("left", (event.pageX + 10) + "px")                                          
            .style("top", (event.pageY - 50) + "px"); 
    };

    function handleMouseleave(event, d) {
      TOOLTIP.style("opacity", 0);
    };

    // Add event listeners
    FRAME.selectAll(".histo")
          .on("mouseover", handleMouseover) 
          .on("mousemove", handleMousemove)
          .on("mouseleave", handleMouseleave); 
})};

// Call the function to build all the histograms
build_histo_all("g");
build_histo_all("u");
build_histo_all("r");
build_histo_all("i");
build_histo_all("z");
