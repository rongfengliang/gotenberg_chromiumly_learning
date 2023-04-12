const { PDFEngine } = require("chromiumly");
const fs = require("fs");
const pdf = require('pdf-parse');
(async function () {
    const buffer = await PDFEngine.convert({
        files: ["app.docx"],
    });
    fs.writeFile("mydemo.pdf", buffer, "binary", function (err) {
        if (err) {
            console.log(err);
        } else {
            let dataBuffer = fs.readFileSync('mydemo.pdf');
            pdf(dataBuffer).then(function (data) {
                // number of pages
                console.log(data.numpages);
                // number of rendered pages
                console.log(data.numrender);
                // PDF info
                console.log(data.info);
                // PDF.js version
                // check https://mozilla.github.io/pdf.js/getting_started/
                console.log(data.version);
            })
        }
    });
})()
