const express = require('express');
const cors = require('cors');
const {router} = require("./router/response")
const {crouter} = require("./router/compareresp")
const {crrouter} = require("./router/createresume")
// const {grouter} = require("./router/geminianalyse")


 // Ensure you have 'path' module imported for directory path

const app = express();
app.use(cors());

app.use(express.json());


app.use(router)
app.use(crouter)
app.use(crrouter)


app.use("/",(req,res)=>{
    res.send("works")
})


// app.use(grouter)



app.listen(5000, () => {
    console.log('Server running on 5000');
});
