//read the json file
function dropdownmenu() {
  d3.json("samples.json").then(function (data) {
    var samplenames = data.names;
    var metadata = data.metadata;

    console.log(samplenames);
    console.log(metadata);
    var location = d3.select("#selDataset");
    samplenames.forEach((sample) => {
      location.append("option").text(sample).property("value", sample);
    });
    buildtable(samplenames[0]);

    buildPlot(samplenames[0]);
  });
}
//now find syntax to append the rows to an html table I think like we did in the JS HW?
//I haven't yet accessed the metadata either???
function buildtable(sampleid) {
  d3.json("samples.json").then(function (data) {
    filteredata = data.metadata.filter((x) => x.id == sampleid)[0];
    var entries = Object.entries(filteredata);
    var tableid = d3.select("#sample-metadata");
    tableid.html("");
    tableid
      .selectAll("p")
      .data(entries)
      .enter()
      .append("p")
      .text(([k, v]) => `${k}: ${v}`);
  });
}

function buildPlot(sampleid) {
  d3.json("samples.json").then(function (data) {
    console.log(data);

    console.log(data.samples);
    filteredata = data.samples.filter((x) => x.id == sampleid)[0];
    var Ids = filteredata.otu_ids.slice(0, 10).reverse();
    var labels = filteredata.otu_labels.slice(0, 10).reverse();
    var sampleValues = filteredata.sample_values.slice(0, 10).reverse();
    console.log(Ids);
    console.log(labels);
    console.log(sampleValues);

    var Inputdata = [
      {
        x: sampleValues,
        y: Ids.map(function (data) {
          return `OTU ${data}`;
        }),
        type: "bar",
        orientation: "h",
        text: labels,
        marker: {
          color: "rgba(191,63,191,1)",
        },
      },
    ];
    console.log(filteredata.otu_ids);
    console.log(filteredata.otu_labels);
    console.log(sampleValues);
    var BubbleInput = [
      {
        x: filteredata.otu_ids,
        y: filteredata.sample_values,
        mode: "markers",
        type: "scatter",
        text: filteredata.otu_labels,
        marker: {
          size: filteredata.sample_values.map((i) => i * 10),
          sizemode: "area",
          color: filteredata.otu_ids,
        },
      },
    ];

    var HorizontalBarLayout = {
      title: "Top 10 Microbial Species",
      xaxis: { title: "Sample Values" },
      yaxis: { title: "OTU ID" },
    };
    var BubbleLayout = {
      title: "Belly Bacteria Bubbles - EWWWW!!",
      xaxis: { title: "OTU ID" },
      yaxis: filteredata.sample_values,
      showlegend: false,
      height: 500,
      width: 1100,
    };

    Plotly.newPlot("bar", Inputdata, HorizontalBarLayout);
    Plotly.newPlot("bubble", BubbleInput, BubbleLayout);
  });
}

function optionChanged(sampleid) {
  buildPlot(sampleid);
  buildtable(sampleid);
}

dropdownmenu();
