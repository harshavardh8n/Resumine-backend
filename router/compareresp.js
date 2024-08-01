const express = require("express");
const crouter = express.Router();
const multer = require("multer");
const path = require('path');
require('dotenv').config();
const fs = require("fs");
const { GoogleGenerativeAI } = require("@google/generative-ai");

let image1name = "";
let image2name = "";

const API_KEY = process.env.REACT_APP_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

const storage1 = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, 'compareimage1');
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const filename = `${Date.now()}_${file.originalname}`;
        image1name = `compareimage1/${filename}`;
        cb(null, filename);
        console.log(image1name);
    }
});

const storage2 = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, 'compareimage2');
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const filename = `${Date.now()}_${file.originalname}`;
        image2name = `compareimage2/${filename}`;
        cb(null, filename);
        console.log(image2name);
    }
});

const upload1 = multer({ storage: storage1 });
const upload2 = multer({ storage: storage2 });

crouter.route('/upload1').post(upload1.single('file'), (req, res) => {
    console.log(req.body); // This should be empty as we're handling a file upload
    console.log(req.file); // This should contain file information
    res.send('File uploaded successfully');
});

crouter.route('/upload2').post(upload2.single('file'), (req, res) => {
    console.log(req.body); // This should be empty as we're handling a file upload
    console.log(req.file); // This should contain file information
    res.send('File uploaded successfully');
});

crouter.route('/compare').get(async (req, res) => {
    try {
        if (image1name !== "" && image2name!=="") {
            console.log(image1name);

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

            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

            const prompt = "I will be sending you two photos of a resumes, compare the two resumes and tell which is better and to what extent , thoroughly";
            const imageParts = [
                fileToGenerativePart(image1name, "image/jpg"),
                fileToGenerativePart(image2name, "image/jpg")

            ];

            const result = await model.generateContent([prompt, ...imageParts]);
            const response = await result.response;
            const text1 = await response.text();

            res.send(text1);
            console.log(text1);

        } else {
            console.log("please submit image");
            res.send("please provide an image");
        }
    } catch (error) {
        console.error("Error generating content:", error.message);
        res.status(500).send("Error generating content: " + error.message);
    }
});

module.exports = {crouter};
