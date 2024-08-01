const express = require("express");
const router = express.Router();
// const {run} = require("../API/apiresp");
const multer = require("multer")
// const genAI = require("../API/apiresp")
const path = require('path');
require('dotenv').config()
const fs = require("fs");



var imagename  = "";
// const analyseupload = require("../Controller/analysecontroller");

const { GoogleGenerativeAI } = require("@google/generative-ai");
// Access your API key as an environment variable
const API_KEY = process.env.REACT_APP_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

// const upload = multer({dest: "uploads/"})

// router.route('/').get(()=>{
//     console.log("hello");
// })
// router.route('/api').get(run)

const storage = multer.diskStorage({
    destination: (req, file, cb) =>{
        const uploadPath = path.join(__dirname, 'analyseimages');
        
        // cout<<imagepath; // Ensure the 'uploads' directory exists
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}_${file.originalname}`);
        imagename = `analyseimages/${Date.now()}_${file.originalname}`
        console.log(imagename);
    }
});

const upload = multer({ storage });

router.route('/upload').post(upload.single('file'), (req, res) => {
    console.log(req.body); // This should be empty as we're handling a file upload
    console.log(req.file); // This should contain file information
    res.send('File uploaded successfully');
});


// imagename = "yoyoi"


router.route('/api').get(async (req, res) => {
    try {
        if(imagename!=""){
            console.log(imagename);
            
            function fileToGenerativePart(filePath, mimeType) {
                const absolutePath = path.resolve(__dirname, filePath);
                if (fs.existsSync(absolutePath)) {
                    return {
                        inlineData: {
                            data: fs.readFileSync(absolutePath).toString('base64'),
                            mimeType
                        }
                    };
                } else {
                    throw new Error(`File not found: ${absolutePath}`);
                }
            }
            
            // Initialize the Generative AI client
            const model1 = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            
            const prompt = "I will be sending you a phto of a resume, i want you to thoroughly analyse the resume and give it a ats score out of 100,start wiht the name of the candidate, dont act like you are gemini api, just do what i said, ust like a robot, give the strength of the resume, area it lacks and room of improvements";
            const imageParts = [
                fileToGenerativePart(imagename, "image/jpg")
                //server\router\server\router\
            ];
            
            // Generate content using the model
            const result = await model1.generateContent([prompt, ...imageParts]);
            const response = await result.response;
            const text1 = await response.text();
            
            res.send(text1);
            console.log(text1);
            
        }
        else{
            console.log("please submit image");
            res.send("please provide image")
        }
        } catch (error) {
            console.error("Error generating content:", error.message);
            res.status(500).send("Error generating content: " + error.message);
        }
    });






    router.route('/askresume').get(async (req, res) => {
        try {
            console.log(req.body);
            if(imagename!=""){
                console.log(imagename);
                function fileToGenerativePart(filePath, mimeType) {
                    const absolutePath = path.resolve(__dirname, filePath);
                    if (fs.existsSync(absolutePath)) {
                        return {
                            inlineData: {
                                data: fs.readFileSync(absolutePath).toString('base64'),
                                mimeType
                            }
                        };
                    } else {
                        throw new Error(`File not found: ${absolutePath}`);
                    }
                }
                
                // Initialize the Generative AI client
                const model1 = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
                // const {prompt} = req.body; 

                const {prompt} = req.body;
                console.log(prompt);
                const imageParts = [
                    fileToGenerativePart(imagename, "image/jpg")
                    //server\router\server\router\
                ];
                
                // Generate content using the model
                const result = await model1.generateContent([prompt, ...imageParts]);
                const response = await result.response;
                const text1 = await response.text();
                
                res.send(text1);
                console.log(text1);
                
            }
            else{
                console.log("please submit image");
                res.send("please provide image")
            }
            } catch (error) {
                console.error("Error generating content:", error.message);
                res.status(500).send("Error generating content: " + error.message);
            }
        });
    
    
    // Main function to run the AI generation
    
    module.exports ={router};