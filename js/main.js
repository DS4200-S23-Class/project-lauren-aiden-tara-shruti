// Display Data
function displayData() {
    // Read data 
    d3.csv("data/SDSS2.csv", fileEncoding="UTF-8-BOM").then((data) => {
    
      // check for our data
      console.log(data);
    })}

displayData()

let elems = []
button = document.querySelector('#submit-button');
button.addEventListener('click', setSelectedOptions);

function setSelectedOptions (){
  let elems = [];
  let choices = document.querySelectorAll('input:checked');

  for (let i = 0; i < choices.length; i++) {
    elems.push(choices[i].value);
  }
  build_scatter(elems);
  build_bar(elems);
}


// // save multiple select options in an array
// function getSelectedOptions() {
//   const selectElement = document.getElementById("selectId");
//   const selectedOptions = selectElement.selectedOptions;
//   elems.length = 0;
//   for (let i = 0; i < selectedOptions.length; i++) {
//     const optionValue = selectedOptions[i].value;
//     elems.push(optionValue);
//   }
// }

console.log(elems)


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
 
function build_scatter(options) {
  console.log(options)
  // Open file
  d3.csv("data/SDSS2.csv").then((data) => {
    
    d3.selectAll("svg > *").remove();

    // console.log(options[0])
    console.log(data);
    filteredData = []
    for (let i = 0; i < options.length; i++) {
      const option = options[i]
      const filtered = data.filter(function(row) {
        return row['class'] === option
      })
      filteredData.push(...filtered)
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
                .range([ "royalblue", "violet", "green"])
  
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
    FRAME1.call(d3.brush()                 // Add the brush feature using the d3.brush function
            .extent( [ [0,0], [FRAME_WIDTH, FRAME_HEIGHT] ] ) // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
            .on("start brush", updateChart) // Each time the brush selection changes, trigger the 'updateChart' function
    )

  //Function that is triggered when brushing is performed
   function updateChart(event) {
        const extent = event.selection;
        k = d3.brush()
        pts1.classed("selected", function(d){return isBrushed(extent, (X_SCALE1(d.dec) + MARGINS.left), (Y_SCALE1(d.ra) + MARGINS.top))})                                                    
        bars1.classed("selected", function(d){return isBrushed(extent, (X_SCALE1(d.dec) + MARGINS.left), (Y_SCALE1(d.ra) + MARGINS.top))})};     
  
  brushed_points = []
  // A function that return TRUE or FALSE according if a dot is in the selection or not
   function isBrushed(brush_coords, cx, cy) {
       var x0 = brush_coords[0][0],
          x1 = brush_coords[1][0],
          y0 = brush_coords[0][1],
          y1 = brush_coords[1][1];

          if (x0 <= cx && cx <= x1 && y0 <= cy && cy <= y1) {
           brushed_points.push(cx)
           };

           console.log(brushed_points)
        
      return x0 <= cx && cx <= x1 && y0 <= cy && cy <= y1};    // This return TRUE or FALSE depending on if the points is in the selected area
})
  console.log(brushed_points)
}
build_scatter(elems)

function build_bar(elems) {
// Open file
d3.csv("data/SDSS2.csv").then((data) => {

  filteredData = []
    for (let i = 0; i < elems.length; i++) {
      const option = elems[i]
      const filtered = data.filter(function(row) {
        return row['class'] === option
      })
      filteredData.push(filtered)
    }

    console.log(d3.mean(filteredData[0], d => d.redshift))

    Array.prototype.insert = function ( index, ...items ) {
      this.splice( index, 0, ...items );
   };
    var redshift_avg = []


   // star redshift
   if (elems.includes("STAR")) {
    index = elems.indexOf("STAR")
     redshift_avg.insert(0, d3.mean(filteredData[index], d => d.redshift))
   }
   else {
    redshift_avg.insert(0, 0)
  }

  // galaxy redshift
    if (elems.includes("GALAXY")) {
      index = elems.indexOf("GALAXY")
      redshift_avg.insert(1, d3.mean(filteredData[index], d => d.redshift))
        }
    else {
      redshift_avg.insert(1,0)
    }

  // quasar redshift
  if (elems.includes("QSO")) {
    index = elems.indexOf("QSO")
    redshift_avg.insert(2, d3.mean(filteredData[index], d => d.redshift))
  }
  else {
    redshift_avg.insert(2,0)
  }
      
  console.log(redshift_avg)
   
    const X_SCALE2 = d3.scaleBand()
                           .range([0, VIS_WIDTH])
                           .domain(data.map((d) => {return d.class;}))
                           .padding(-.3);


    const MIN_Y2 = d3.min(data, (d) => { return parseInt(d.redshift); });
    const MAX_Y2 = d3.max(data, (d) => { return parseInt(d.redshift); });

    const Y_SCALE2 = d3.scaleLinear()
                           .range([VIS_HEIGHT, 0])
                           .domain([(-(MAX_Y2) - 1), (MAX_Y2 + 1)]) 


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

    
    data2 = redshift_avg
    // Adding bars
    bars1 =  FRAME2.selectAll(".bar")
            .data(redshift_avg)
            .enter()
            .append("rect")
                .attr("x", (d) => { return (X_SCALE2(d.class) + MARGINS.left); }) 
                .attr("width", X_SCALE2.bandwidth())
                .attr("y", (d) => {return Y_SCALE2(50) + MARGINS.top})
                .attr("height", (d) =>{return d.getItem()})
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
})}

//console.log(space_class)






