// Display Data
function displayData() {
    // Read data 
    d3.csv("data/SDSS.csv").then((data) => {
  
      // check for our data
      console.log(data);
    })}

displayData()