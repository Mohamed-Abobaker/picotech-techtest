const fs = require("fs");
const csv = require("fast-csv");

//the parameter 'path' here should be the path to the folder containing csv wave files. e.g "('../Downloads/Picotech_interviewTest')"
const createFrequencyFile = path => {
  const csvFiles = [];

  fs.readdirSync(path).forEach(file => {
    let filetype = file.substring(file.length - 4);
    if (filetype === ".csv") csvFiles.push(file);
  });

  const array2 = [["Filename", "Frequency"]];

  csvFiles.forEach(file => {
    const tempArray = [];
    csv
      .fromPath(`${path}/${file}`)
      .on("data", function(data) {
        tempArray.push(data);
      })
      .on("end", function() {
        let arr = tempArray.slice(2).sort((a, b) => 1 / b[0] - 1 / a[0]);
        arr = arr.slice(0, 1);
        arr[0][1] = 1 / arr[0][0];
        arr[0][0] = `${file}`;
        array2.push(arr[0]);

        if (array2.length === csvFiles.length + 1) {
          array3 = array2.sort((a, b) => a[1] - b[1]);
          csv
            .writeToStream(
              fs.createWriteStream("waveFrequencies.csv", {
                flags: "a"
              }),
              array3,
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
