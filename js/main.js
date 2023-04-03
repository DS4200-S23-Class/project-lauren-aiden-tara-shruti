// Display Data
function displayData() {
    // Read data 
    d3.csv("data/SDSS2.csv", fileEncoding="UTF-8-BOM").then((data) => {
    
      // check for our data
      console.log(data);
    })}

displayData();

let elems = [];
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
  build_histo();
};



classes = ["STAR", "GALAXY", "QSO" ];

console.log(elems);


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
  console.log(options);
  // Open file
  d3.csv("data/SDSS2.csv").then((data) => {
    
    d3.selectAll("svg > *").remove();

    // console.log(options[0])
    console.log(data);
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
    FRAME1.call(d3.brush()                 // Add the brush feature using the d3.brush function
            .extent( [ [0,0], [FRAME_WIDTH, FRAME_HEIGHT] ] ) // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
            .on("start brush", updateChart) // Each time the brush selection changes, trigger the 'updateChart' function
    );

  //Function that is triggered when brushing is performed
   function updateChart(event) {
        const extent = event.selection;
        k = d3.brush();
        pts1.classed("selected", function(d) {return isBrushed(extent, (X_SCALE1(d.dec) + MARGINS.left), (Y_SCALE1(d.ra) + MARGINS.top))})};    
  
  brushed_points = [];
  // A function that return TRUE or FALSE according if a dot is in the selection or not
   function isBrushed(brush_coords, cx, cy) {
       const x0 = brush_coords[0][0],
          x1 = brush_coords[1][0],
          y0 = brush_coords[0][1],
          y1 = brush_coords[1][1];

          if (x0 <= cx && cx <= x1 && y0 <= cy && cy <= y1) {
           brushed_points.push(cx);
           };

           console.log(brushed_points);
        
      return x0 <= cx && cx <= x1 && y0 <= cy && cy <= y1};   // This return TRUE or FALSE depending on if the points is in the selected area
      console.log(brushed_points);
})};

build_scatter(elems);


function build_bar(options) {
  // Read data and create bar plot
  d3.csv("data/SDSS2.csv").then((data) => {

    // Define scale functions that maps our data x values 
      // (domain) to pixel values (range)
      const X_SCALE_CLASS = d3.scaleBand()   
                                .range([0, VIS_WIDTH])
                                .domain(data.map((d) => { return d.class; }))
                                .padding(0.2); 

      // Define scale functions that maps our data y values
      // (domain) to pixel values (range)
      const Y_SCALE_CLASS = d3.scaleLinear()
                                .domain([0,.42])
                                 .range([VIS_HEIGHT, 0]);

      function get_redshift(d) {                          
      if(d.class === "STAR") {
              return 0.0002102389190283399;
            } else if (d.class === "GALAXY") {
              return 0.08036230192708328;
            } else if (d.class === "QSO"){
              return 0.4103186918181818;
            }}
            

      // Use X_SCALE_CLASS and Y_SCALE_CLASS to plot graph
      let bars = FRAME2.selectAll("bars")  
          .data(data) // passed from .then  
          .enter()       
          .append("rect")
            .attr("x", (d) => { return (X_SCALE_CLASS(d.class) + MARGINS.left); })
            .attr("width", X_SCALE_CLASS.bandwidth())
            .attr("y", (d) => { return Y_SCALE_CLASS(get_redshift(d)) + MARGINS.top})   
            .attr("height", (d) => {return VIS_HEIGHT - Y_SCALE_CLASS(get_redshift(d))})
            .attr("fill", function (d) {
              if(d.class === "STAR") {
              return "royalblue";
            } else if (d.class === "GALAXY") {
              return "red";
            } else {
              return "green";
            }
            })
            .append("text")
              .text(function(d) {                 
                    return d.class;
              })
           .attr("text-anchor", "middle")
            .attr("class", "bar");

      FRAME2.append("text")
              .attr("x", 100)
              .attr("y", 243)
              .attr("font-size", 10)
              .attr("fill", "royalblue")
              .text("0.0002"); 

      FRAME2.append("text")
              .attr("x", 210)
              .attr("y", 205)
              .attr("font-size", 10)
              .attr("fill", "red")
              .text(".0804");


      FRAME2.append("text")
              .attr("x", 320)
              .attr("y", 50)
              .attr("font-size", 10)
              .attr("fill", "green")
              .text("0.4103");

      // Add x axis to vis
      FRAME2.append("g") 
      .attr("transform", "translate(" + MARGINS.left + 
            "," + (VIS_HEIGHT + MARGINS.top) + ")") 
      .call(d3.axisBottom(X_SCALE_CLASS).ticks(3)) 
        .attr("font-size", '10px'); 

      // Add y axis to vis
      FRAME2.append("g") 
      .attr("transform", "translate(" + MARGINS.bottom + 
            "," + (MARGINS.top) + ")") 
      .call(d3.axisLeft(Y_SCALE_CLASS).ticks(8)) 
        .attr("font-size", '10px'); 

  })};


function build_histo() {

  const width = 300
  const height = 6700
  const padding = 50

  d3.csv("data/SDSS2.csv").then((data) => {

    const map = data.map(function (d) { return parseInt(d.u); })

    const histogram = d3.histogram()
                        .thresholds(5)
                        (map)

    const y = d3.scaleLinear()
                .domain([0, d3.max(histogram.map(function (d) { return d.length; }))])
                .range([0, height]);

    const x = d3.scaleLinear()
                .domain([0, d3.max(map)])
                .range([0, width]);


    const canvas = d3.select("#histo").append("svg")
                                    .attr("width", width)
                                    .attr("height", height + padding)
                                    // .append("g")
                                    //   .attr("transform", "translate(20,0");

    const xAxis = canvas.append("g")
                    .attr("transform", "translate(0," + height + ")")
                    .call(d3.axisBottom(x));


    const bars = canvas.selectAll(".bar")
                        .data(histogram)
                        .enter()
                        .append("g")

    bars.append("rect")
        .attr("x", function (d) { return x(d.x1-(d.x1-d.x0)); })
        .attr("y", function (d) { return 6700 - y(d.length); })
        .attr("width", function (d) { return x(d.x1-d.x0); })
        .attr("height", function (d) { return y(d.length); })
        .attr("fill", "steelblue");

     // text for bars, shows the distribution which adds to 450
    bars.append("text")
          .attr("x", function (d) { return x(d.x1-(d.x1-d.x0)); })
          .attr("y", function (d) { return 6700 - y(d.length); })
          .attr("dy", "20px")
          .attr("dx", function (d) { return x(d.x1-d.x0)/2; })
          .attr("fill", "#fff")
          .attr("font-size", 10)
          .attr("text-anchor", "middle")
          .text(function (d) { return d.length; });

})};












