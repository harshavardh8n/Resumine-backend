const express = require("express");
const router = express.Router();

const path = require('path');
require('dotenv').config()
const axios = require('axios');



// const analyseupload = require("../Controller/analysecontroller");

const { GoogleGenerativeAI } = require("@google/generative-ai");
// Access your API key as an environment variable
const API_KEY = process.env.REACT_APP_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);


async function fetchImageAsBase64(url) {
    try {
        const response = await axios.get(url, { responseType: 'arraybuffer' });
        const base64Image = Buffer.from(response.data, 'binary').toString('base64');
        return base64Image;
    } catch (error) {
        console.error("Error fetching image:", error.message);
        throw new Error("Failed to fetch image");
    }
}

router.post('/api/analyse', async (req, res) => {
    try {
        const model1 = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const imgURL = req.body.img; // URL from Cloudinary

        // Fetch and convert image to Base64
        const base64Image = await fetchImageAsBase64(imgURL);

        // Construct the prompt with the Base64 image

        
        const prompt = "I will be sending you a photo of a resume, I want you to thoroughly analyze the resume and give it an ATS score out of 100. Start with the name of the candidate. Don’t act like you are a generative AI model, just do what I said, just like a robot. Provide the strengths of the resume, areas where it lacks, and room for improvements.";
        const imageParts = [
            {
                inlineData: {
                    data: base64Image,
                    mimeType: "image/jpg" // or "image/png" depending on the image format
                }
            }
        ];

        // Generate content using the model
        const result = await model1.generateContent([prompt, ...imageParts]);
        const response = await result.response;
        const text1 = await response.text();

        res.send(text1);
        console.log(text1);
    } catch (error) {
        console.error("Error generating content:", error.message);
        res.status(500).send("Error generating content: " + error.message);
    }


    // async function describeImage(imageUrl) {
    //     const apiKey = API_KEY; // Replace with your Gemini API key
    //     const apiUrl = 'https://api.gemini.ai/v1/image/describe'; // Replace with the correct API endpoint
    
    //     try {
    //         const response = await axios.post(
    //             apiUrl,
    //             {
    //                 image_url: imageUrl,
    //                 prompt: "Describe what is in the picture."
    //             },
    //             {
    //                 headers: {
    //                     'Authorization': `Bearer ${apiKey}`,
    //                     'Content-Type': 'application/json',
    //                 },
    //             }
    //         );
    
    //         console.log('Description:', response.data.description);
    //     } catch (error) {
    //         console.error('Error:', error.response ? error.response.data : error.message);
    //     }
    // }
    // describeImage(req.body.img);    
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