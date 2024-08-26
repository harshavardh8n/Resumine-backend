const express = require('express');
const cors = require('cors');
const multer = require('multer');
const {router} = require("./router/response")
const {crouter} = require("./router/compareresp")
const {crrouter} = require("./router/createresume")
const {uploadImage}  = require("./services/cloudinaryupload")
// const {grouter} = require("./router/geminianalyse")


 // Ensure you have 'path' module imported for directory path

const app = express();

const corsOptions = {
    origin: 'http://localhost:3000',
    methods: 'GET,POST,PUT,DELETE,PATCH,HEAD',
    credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json());


app.use(router)
app.use(crouter)
app.use(crrouter)

app.use("/uploadeer",()=>{
    uploadImage();
})
app.use("/",(req,res)=>{
    res.send("works")
})


// app.use(grouter)



app.listen(5000, () => {
    console.log('Server running on 5000');
});
