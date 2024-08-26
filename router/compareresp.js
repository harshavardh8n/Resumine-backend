const express = require("express");
const crouter = express.Router();
const path = require('path');
require('dotenv').config();
const axios = require('axios');
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

crouter.post('/api/compare', async (req, res) => {
    try {
        const model1 = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const { img1, img2 } = req.body; // Expecting two image URLs

        // Fetch and convert images to Base64
        const base64Image1 = await fetchImageAsBase64(img1);
        const base64Image2 = await fetchImageAsBase64(img2);

        // Construct the prompt for comparison
        const prompt = "Compare the following two resumes and determine which one is better. Provide detailed feedback on strengths, weaknesses, and areas for improvement for each resume.";
        const imageParts = [
            {
                inlineData: {
                    data: base64Image1,
                    mimeType: "image/jpg" // or "image/png" depending on the image format
                }
            },
            {
                inlineData: {
                    data: base64Image2,
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
});

module.exports = { crouter };
