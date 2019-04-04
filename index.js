const fs = require("fs");
const csv = require("fast-csv");

//the parameter 'path' here should be the path to the folder containing csv wave files. e.g "('../Downloads/Picotech_interviewTest')"
const createFrequencyFile = path => {
  const csvFiles = [];

  fs.readdirSync(path).forEach(file => {
    let filetype = file.substring(file.length - 4);
    if (filetype === ".csv") csvFiles.push(file);
  });

  let compiledDataArray = [["Filename", "Frequency"]];

  csvFiles.forEach(file => {
    const rawDataArray = [];
    csv
      .fromPath(`${path}/${file}`)
      .on("data", function(data) {
        rawDataArray.push(data);
      })
      .on("end", function() {
        let sortedDataArray = rawDataArray
          .slice(2)
          .sort((a, b) => 1 / b[0] - 1 / a[0]);
        sortedDataArray = sortedDataArray.slice(0, 1);
        sortedDataArray[0][1] = 1 / sortedDataArray[0][0];
        sortedDataArray[0][0] = `${file}`;
        compiledDataArray.push(sortedDataArray[0]);

        if (compiledDataArray.length === csvFiles.length + 1) {
          compiledDataArray = compiledDataArray.sort((a, b) => a[1] - b[1]);
          csv
            .writeToStream(
              fs.createWriteStream("waveFrequencies.csv", {
                flags: "a"
              }),
              compiledDataArray,
              {
                headers: false
              }
            )
            .on("finish", function() {
              console.log("file written successfully");
            });
        }
      });
  });
};

createFrequencyFile(/* insert path here then run file in terminal by typing 'node index.js'*/);
