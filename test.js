const fs = require("fs");
const csv = require("fast-csv");
const { getWave, waveTime } = require("./utils");

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
        let dataArray = rawDataArray.slice(2);
        const NumDataArray = dataArray.map(row => {
          row[0] = Number(row[0]);
          row[1] = Number(row[1]);
          return row;
        });

        const topWave = getWave(NumDataArray, Number(rawDataArray[1][1]), file);
        // console.log("topWave", topWave);
        compiledDataArray.push(topWave);

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

createFrequencyFile("../Downloads/Picotech_interviewTest");
