// Display Data
function displayData() {
  // Read data 
  d3.csv("data/SDSS2.csv", fileEncoding="UTF-8-BOM").then((data) => {
  
    // check for our data
    //console.log(data);
  })}

displayData();
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

let elems = [];
button = document.querySelector('#submit-button');
button.addEventListener('click', setSelectedOptions);

function setSelectedOptions (){
let choices = document.querySelectorAll('input:checked');
for (let i = 0; i < choices.length; i++) {
  elems.push(choices[i].value);
}
console.log(elems)
build_scatter(elems);
//build_bar(elems);
//build_bar(brushed_points);
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

let brushed_points = [];
classes = ["STAR", "GALAXY", "QSO" ];


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
//Bar graph 
const FRAME2 = d3.select("#bar")
                  .append("svg")
                  .attr("height", FRAME_HEIGHT)
                  .attr("width", FRAME_WIDTH)
                  .attr("class", "frame");

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// function build_bar(data) {

// // Read data and create bar plot
// d3.csv("data/SDSS2.csv").then((data) => {

//   d3.selectAll("bar").remove();

//   // Define scale functions that maps our data x values 
//     // (domain) to pixel values (range)
//     const X_SCALE_CLASS = d3.scaleBand()   
//                               .range([0, VIS_WIDTH])
//                               .domain(data.map((d) => { return d.class; }))
//                               .padding(0.2); 

//     // Define scale functions that maps our data y values
//     // (domain) to pixel values (range)
//     const Y_SCALE_CLASS = d3.scaleLinear()
//                               .domain([0,.42])
//                                .range([VIS_HEIGHT, 0]);

//     function get_redshift(d) {                          
//     if(d.class === "STAR") {
//             return 0.0002102389190283399;
//           } else if (d.class === "GALAXY") {
//             return 0.08036230192708328;
//           } else if (d.class === "QSO"){
//             return 0.4103186918181818;
//           }}

//     // Use X_SCALE_CLASS and Y_SCALE_CLASS to plot graph
//     let bars = FRAME2.selectAll("bars")  
//         .data(data) // passed from .then  
//         .enter()       
//         .append("rect")
//           .attr("x", (d) => { return (X_SCALE_CLASS(d.class) + MARGINS.left); })
//           .attr("width", X_SCALE_CLASS.bandwidth())
//           .attr("y", (d) => { return Y_SCALE_CLASS(get_redshift(d)) + MARGINS.top})   
//           .attr("height", (d) => {return VIS_HEIGHT - Y_SCALE_CLASS(get_redshift(d))})
//           .attr("fill", function (d) {
//             if(d.class === "STAR") {
//             return "royalblue";
//           } else if (d.class === "GALAXY") {
//             return "red";
//           } else {
//             return "green";
//           }
//           })
//           .append("text")
//             .text(function(d) {                 
//                   return d.class;
//             })
//          .attr("text-anchor", "middle")
//           .attr("class", "bar");

//     FRAME2.append("text")
//             .attr("x", 100)
//             .attr("y", 243)
//             .attr("font-size", 10)
//             .attr("fill", "royalblue")
//             .text("0.0002"); 

//     FRAME2.append("text")
//             .attr("x", 210)
//             .attr("y", 205)
//             .attr("font-size", 10)
//             .attr("fill", "red")
//             .text(".0804");


//     FRAME2.append("text")
//             .attr("x", 320)
//             .attr("y", 50)
//             .attr("font-size", 10)
//             .attr("fill", "green")
//             .text("0.4103");

//     // Add x axis to vis
//     FRAME2.append("g") 
//     .attr("transform", "translate(" + MARGINS.left + 
//           "," + (VIS_HEIGHT + MARGINS.top) + ")") 
//     .call(d3.axisBottom(X_SCALE_CLASS).ticks(3)) 
//       .attr("font-size", '10px'); 

//     // Add y axis to vis
//     FRAME2.append("g") 
//     .attr("transform", "translate(" + MARGINS.bottom + 
//           "," + (MARGINS.top) + ")") 
//     .call(d3.axisLeft(Y_SCALE_CLASS).ticks(8)) 
//       .attr("font-size", '10px'); 

// })};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function build_a_bar(brushed_data) {
  d3.selectAll(".bars").remove();

  const objects = brushed_data.map(d => {
    const [x, y, cls, value] = d.slice(1, -1).split(',');
    return { x: +x, y: +y, class: cls, value: +value };
  });
  
  // Group the objects by class and compute the mean value
  const groups = d3.group(objects, d => d.class);
  const means = new Map([...groups].map(([cls, objects]) => [cls, d3.mean(objects, d => d.value)]));
  
  const color = d3.scaleOrdinal()
              .domain(["STAR", "GALAXY", "QSO" ])
              .range([ "royalblue", "red", "green"]);

  const y = d3.scaleBand()
    .domain(['STAR', 'GALAXY', 'QSO'])
    .range([0, FRAME_HEIGHT - MARGINS.top - MARGINS.bottom])
    .padding(0.1);

  const x = d3.scaleLinear()
    .domain([0, .5])
    .range([0, FRAME_WIDTH - MARGINS.left - MARGINS.right]);

  // Define the y axis
  const yAxis = d3.axisLeft(y);

  // Append the y axis to the SVG element
  FRAME2.append("g")
    .attr("class", "y-axis")
    .attr("transform", `translate(${MARGINS.left}, ${MARGINS.top})`)
    .call(yAxis);

  // Define the x axis
  const xAxis = d3.axisBottom(x)
    .ticks(15)
    .tickFormat(d => `${d}`);

  // Append the x axis to the SVG element
  FRAME2.append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(${MARGINS.left}, ${FRAME_HEIGHT - MARGINS.bottom})`)
    .call(xAxis);

  // Add the bars to the chart
  FRAME2.append('g')
    .attr('class', 'bars')
    .attr('transform', `translate(${MARGINS.left}, ${MARGINS.top})`)
    .selectAll('rect')
    .data([...means.entries()])
    .enter()
    .append('rect')
    .attr('x', 0)
    .attr('y', d => y(d[0]))
    .attr('width', d => x(d[1]))
    .attr('height', y.bandwidth())
    .attr('fill', d => color(d[0]));
}


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function build_scatter(options) {

// Open file
d3.csv("data/SDSS2.csv").then((data) => {
  
   d3.selectAll(".point").remove();

  // console.log(options[0])
  filteredData = [];
  for (let i = 0; i < options.length; i++) {
    const option = options[i];
    const filtered = data.filter(function(row) {
      return row['class'] === option;
    });
    filteredData.push(...filtered);
  }



  const MAX_X1 = d3.max(data, (d) => { return parseInt(d.dec); });
  const MAX_Y1 = d3.max(data, (d) => { return parseInt(d.ra); });

  const X_SCALE1 = d3.scaleLinear() 
                      .domain([(-(MAX_X1) - 1), (MAX_X1 + 1)]) 
                      .range([0, VIS_WIDTH]);

  const Y_SCALE1 = d3.scaleLinear() 
                      .domain([0, (MAX_Y1 + 1)]) 
                      .range([VIS_HEIGHT, 0]);


  const color = d3.scaleOrdinal()
              .domain(["STAR", "GALAXY", "QSO" ])
              .range([ "royalblue", "red", "green"]);

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

    // Add legend to graph
    FRAME1.append("circle")
            .attr("cx",60)
            .attr("cy",60)
            .attr("r", 5)
            .style("fill", "royalblue");

    FRAME1.append("text")
            .attr("x", 70)
            .attr("y", 65)
            .attr("font-size", 15)
            .attr("fill", "royalblue")
            .text("Star");

    FRAME1.append("circle")
            .attr("cx",60)
            .attr("cy",80)
            .attr("r", 5)
            .style("fill", "red");

    FRAME1.append("text")
            .attr("x", 70)
            .attr("y", 85)
            .attr("font-size", 15)
            .attr("fill", "red")
            .text("Galaxy");

    FRAME1.append("circle")
            .attr("cx",60)
            .attr("cy",100)
            .attr("r", 5)
            .style("fill", "green");

    FRAME1.append("text")
            .attr("x", 70)
            .attr("y", 105)
            .attr("font-size", 15)
            .attr("fill", "green")
            .text("Quasar");


  // Add points
  pts1 = FRAME1.selectAll("points")  
          .data(filteredData) 
          .enter()       
          .append("circle")  
            .attr("cx", (d) => { return (X_SCALE1(d.dec) + MARGINS.left); }) 
            .attr("cy", (d) => { return (Y_SCALE1(d.ra) + MARGINS.top); }) 
            .attr("r", 3)
            .attr("fill", d => color(d.class))
            .attr("opacity", 0.3)
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
      pts1.classed("selected", function(d) {return isBrushed(extent, (X_SCALE1(d.dec) + MARGINS.left), (Y_SCALE1(d.ra) + MARGINS.top), d.dec, d. ra, d.class, d.redshift)}) 
      //hist1.classed("selected", function(d) {return isBrushed(extent, (X_SCALE1(d.dec) + MARGINS.left), (Y_SCALE1(d.ra) + MARGINS.top), d.dec, d.ra, d.class, d.redshift)})
      console.log(brushed_points);
      build_a_bar(brushed_points);
      brushed_points = []}  

// A function that return TRUE or FALSE according if a dot is in the selection or not
 function isBrushed(brush_coords, cx, cy, d_x, d_y, d_class, redshift) {
    //brushed_points = [] 
     const x0 = brush_coords[0][0],
        x1 = brush_coords[1][0],
        y0 = brush_coords[0][1],
        y1 = brush_coords[1][1];

        if (x0 <= cx && cx <= x1 && y0 <= cy && cy <= y1) {
         brushed_points.push("(" + d_x + "," + d_y + "," + d_class + "," + redshift + ")");
         };
          
      
    return brushed_points, x0 <= cx && cx <= x1 && y0 <= cy && cy <= y1};   // This return TRUE or FALSE depending on if the points is in the selected area
    //console.log(brushed_points);
})
return brushed_points};

console.log(brushed_points)
// U histogram



// general function 

function build_histo_all(band_type) {

const padding = 50

d3.csv("data/SDSS2.csv").then((data) => {



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
    }
  
  // Subtract 13 to remove white space from histogram on x axis
  const map = data.map(function (d) { return (parseInt(get_band(d, band_type)) - 13)})


  const histogram = d3.histogram()
                      .thresholds(5)
                      (map)

  const x = d3.scaleLinear()
              .domain([0, d3.max(map)])
              .range([0, 280]);


  const y = d3.scaleLinear()
              .domain([0, d3.max(histogram.map(function (d) { return d.length; }))])
              .range([VIS_HEIGHT, 0]);


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
    }


   const FRAME = d3.select(frame_num(band_type))
                  .append("svg")
                  .attr("height", FRAME_HEIGHT)
                  .attr("width", 380)
                  .attr("class", "frame");

            
  FRAME.select(frame_num(band_type))
          .append("svg")
          .attr("width", 380)
          .attr("height", VIS_HEIGHT + padding)


  // Add x axis and relabel ticks to make depiction of data accurate, from subtracting 13 earlier
  FRAME.append("g") 
            .attr("transform", "translate(" + MARGINS.left + 
            "," + (VIS_HEIGHT + MARGINS.top) + ")") 
            .call(d3.axisBottom(x).tickValues([0, 1, 2, 3, 4, 5, 6])
                                 .tickFormat((d, i) => [13, 14, 15, 16, 17, 18, 19] [i])) 
            .attr("font-size", '10px');

// y axis 

  FRAME.append("g")
          .attr("transform", "translate(" +(x(0) + MARGINS.left) + "," + (MARGINS.bottom) + ")")
          .call(d3.axisLeft(y));


  function getColor() {
   if(band_type === "u") {
            return "violet";
          } 
    else if (band_type === "g") {
            return "teal";
          } 
    else if (band_type === "r"){
            return "limegreen";
          }
    else if (band_type === "i"){
            return "red";
          }
    else if (band_type === "z"){
            return "maroon";
          }
    }

 hist1 = FRAME.selectAll(".bar")
          .data(histogram)
          .enter()
          .append("rect")
            .attr("x", function (d) { return (x(d.x1-(d.x1-d.x0))) + MARGINS.left;})
            .attr("y", function (d) { return  (y(d.length)) + MARGINS.top; })
            .attr("width", function (d) { return x(d.x1-d.x0); })
            .attr("height", function (d) { return VIS_HEIGHT - y(d.length); })
            .attr("fill", function(d) { return getColor(d);})
            .attr("class", "histo")


const TOOLTIP = d3.select(frame_num(band_type))
                          .append("div")
                          .attr("class", "tooltip")
                          .style("opacity", 0);


      // Change color by hovering
      function handleMouseover(event, d) {
        // on mouseover, change color
        TOOLTIP.style("opacity", 1);
      }

      // Show value of each bar with tooltip
      function handleMousemove(event, d) {
      TOOLTIP.html("Count: " + d.length + " out of 450" + " (" 
                  + Math.round(((d.length/450)*100 + Number.EPSILON) * 100) / 100 + "%)")  // Math function rounds to two decimals
              .style("left", (event.pageX + 10) + "px")                                          
              .style("top", (event.pageY - 50) + "px"); 
      }

      function handleMouseleave(event, d) {
        TOOLTIP.style("opacity", 0);
      }


      FRAME.selectAll(".histo")
            .on("mouseover", handleMouseover) 
            .on("mousemove", handleMousemove)
            .on("mouseleave", handleMouseleave); //add event listeners
})};

build_histo_all("g");
build_histo_all("u");
build_histo_all("r");
build_histo_all("i");
build_histo_all("z");

