const express = require('express')
const { PDFEngine } = require("chromiumly");
const pdf = require('pdf-parse');
const fileUpload = require('express-fileupload');
const fileExtension = require('file-extension');
const tmp = require('tmp');
const app = express();
app.use(fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
    useTempFiles : true,
    tempFileDir : '/tmp/',
    preserveExtension:true
}));

app.post('/upload', async function (req, res) {
    let sampleFile = req.files.sampleFile
    const fileextention = fileExtension(sampleFile.name); 
    const tmpobj = tmp.fileSync({ mode: 0o644, prefix: 'prefix-', postfix: `.${fileextention}` });
    sampleFile.mv(tmpobj.name, async function(err) {
        if (err) {
          return res.status(500).send(err);
        }
        const buffer = await PDFEngine.convert({
            files: [tmpobj.name],
        });
        pdf(buffer).then(function (data) {
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
        // fs.writeFile("mydemo.pdf", buffer, "binary", function (err) {
        //     if (err) {
        //         console.log(err);
        //     } else {
        //         let dataBuffer = fs.readFileSync('mydemo.pdf');
        //         pdf(dataBuffer).then(function (data) {
        //             // number of pages
        //             console.log(data.numpages);
        //             // number of rendered pages
        //             console.log(data.numrender);
        //             // PDF info
        //             console.log(data.info);
        //             // PDF.js version
        //             // check https://mozilla.github.io/pdf.js/getting_started/
        //             console.log(data.version);
        //         })
        //     }
        // });
        res.send('File uploaded');
      });
    
});
app.get('/', function (req, res) {
    res.send('Hello World')
});

app.listen(3001)