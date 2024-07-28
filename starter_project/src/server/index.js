const path = require('path');
const express = require('express');
const port = 8000;
const cors = require("cors");
const app = express();
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const { menaCloud } = require("./mena-cloud");

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('dist'))
dotenv.config();


app.get('/', function (req, res) {
    res.sendFile('dist/index.html')
});

// Variables for url and api key

console.log(`My API key is ${process.env.API_KEY}`);
const API_KEY = process.env.API_KEY;

// POST Route
app.post("/getData", async (req, res) => {
    // GET article url from the request
    const url = req.body.url;
   

    // 2. Fetch Data from API by sending the url and the key
    const menaCloudResult = await menaCloud(url, API_KEY);

    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>menaCloudResult");
    console.log(menaCloudResult);

    const {object, msg , code} = menaCloudResult;
    //send errors if result was wrong
    if (code == 212) {
        return res.send({ object: null, msg: msg , code: code})
    }
    else if (code == 100) {
        //Server Side Validation
        return res.send({ object: null, msg: msg, code: code })
    }else{
        return res.send({object: object, msg: msg, code: code})
    }


})


// Designates what port the app will listen to for incoming requests
app.listen(port, function () {
    console.log('Serve app listening on port ' + port);
});


