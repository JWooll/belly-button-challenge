// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
    let metadata = data['metadata'];

    // Filter the metadata for the object with the desired sample number
    for(i=0;i<metadata.length;i++){
      if(metadata[i]['id']==parseInt(sample)){sampleMeta = metadata[i]}; // Selects metadata where IDs match
    };

    // Use d3 to select the panel with id of `#sample-metadata`
    let metaPage = d3.selectAll('#sample-metadata');

    // Use `.html("") to clear any existing metadata
    metaPage.html("");

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    keys = Object.keys(sampleMeta); // List of Keys in metadata
    for(j=0;j<keys.length;j++){
      metaPage.append('tag').text(keys[j] + " : " + sampleMeta[keys[j]]); // Adds text in form "'key' : 'element'" for each key
      metaPage.append('div'); // Adds a line between keys for neatness and readability
    };

  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    let samples = data['samples'];

    // Filter the samples for the object with the desired sample number
    for(i=0;i<samples.length;i++){
      if(samples[i]['id']==parseInt(sample)){sampleData = samples[i]}; // Selects samples where IDs match
    };

    // Get the otu_ids, otu_labels, and sample_values
    let otu_ids = sampleData['otu_ids'];
    let otu_labels = sampleData['otu_labels'];
    let sample_values = sampleData['sample_values'];

    // Build a Bubble Chart
    let trace1 = {
      x: otu_ids,
      y: sample_values,
      mode: 'markers', // Bubble chart
      marker: {
        size: sample_values,
        color: otu_ids,
      },
      text: otu_labels
    };
    let layout1 = {
      title: "Bacteria Cultures per Sample",xaxis:{title:"OTU ID"}, yaxis:{title:"Number of Bacteria"}
    };

    // Render the Bubble Chart
    Plotly.newPlot("bubble",[trace1],layout1); // Builds chart at 'bubble' location in index html

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    let ytickers = [];
    for (j=0;j<10;j++){ytickers.push("OTU " + otu_ids[j])}; // Rewrites fist ten ids in form "OTU id#" to correspond with top ten sample values
    ytickers.reverse();
    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    let topTenS = sample_values.slice(0,10).reverse(); // Top ten sample values
    let topTenL = otu_labels.slice(0,10).reverse();  // Top ten labels to correspond with sample values
    let trace2 = {
      x: topTenS,
      y: ytickers,
      type: 'bar',
      orientation: 'h', // Makes bar graph horizontal
      text: topTenL
    };
    let layout2 = {
      title: "Top Ten Bacteria Cultures",xaxis:{title:"Number of Bacteria"}
    };

    // Render the Bar Chart
    Plotly.newPlot('bar',[trace2],layout2)
  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    let names = data['names'];

    // Use d3 to select the dropdown with id of `#selDataset`
    let dropdown = d3.selectAll('#selDataset');

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    for(let i = 0;i<names.length;i++){
      dropdown.append('option').attr('value',names[i]).text(names[i]); // Adds an option in drop down for each name and gives it a value for future selections
    };

    // Get the first sample from the list
    initSample = names[0];
    // Build charts and metadata panel with the first sample
    buildMetadata(initSample);
    buildCharts(initSample);
  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
}

// Initialize the dashboard
init();
d3.selectAll("#selDataset").on("change", optionChanged(d3.selectAll("#selDataset").attr('value'))); // Sends the value of the option selected to optionChanged function
