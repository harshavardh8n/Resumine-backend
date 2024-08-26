const express = require("express");
const crrouter = express.Router();
require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

// const { GoogleGenerativeAI } = require("@google/generative-ai");
// Access your API key as an environment variable
const API_KEY = process.env.REACT_APP_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);



crrouter.route("/create").post(async(req,res)=>{
    const model1 = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            
    const {name, skills,education,exp,projects,email} = req.body;
    console.log(name, skills,education,exp,projects,email);
    const prompt = `I want you to create a resume for me, i will now provide you all my info, make it professional. my name is ${name},email:${email},education:${education},skills :${skills},projects : ${projects},work experience and additional things are:${exp}. ignore the fields that are blank. dont add any text in your response besides resume content, im going to display you response on my website`;
    const result = await model1.generateContent(prompt);
    const response = await result.response;
    const text1 = await response.text();
    
    res.send(text1);
    console.log(text1);
})



module.exports = {crrouter};
