// Display Data
function displayData() {
    // Read data 
    d3.csv("data/SDSS.csv").then((data) => {
  
      // check for our data
      console.log(data);
    })}

displayData()


// // Next, open file 
// d3.csv("data/SDSS.csv").then((data) => { 

//   // d3.csv parses a csv file 
//   // .then() passes the data parsed from the file to a function
//   // in the body of this function is where you will build your 
//   // vis 

//   // let's check our data
//   console.log(data);})


console.log('Hello World');