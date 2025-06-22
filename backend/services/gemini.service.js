// services/gemini.service.js
import removeMarkdown from "remove-markdown";


import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);


export const generateGeminiResponse = async (message) => {
  if (!message) throw new Error("Prompt is required");
  
  const instruction = `You are a AI Assistant and experience in React Development.
  GUIDELINES:
  - Tell user what your are building
  - response less than 15 lines. 
  - Skip code examples and commentary`;

  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    generationConfig: {
      responseMimeType: "text/plain"
    }
  });

  const result = await model.generateContent(`${instruction}\n\nUser: ${message}`);
  const text = await result.response.text();
  return text;
};


export const generateProjectName = async (message) => {
 const prompt = `Provide exactly one concise, unique project name based on this message. Return only the name without quotes, punctuation, or any extra text.\nMessage:\n"${message}"\nProject name:`;


  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    generationConfig: {
      maxOutputTokens: 10,
      temperature: 0.3,
    },
  });

  const result = await model.generateContent(prompt);
  const rawText = await result.response.text();

  let cleanName = removeMarkdown(rawText).trim();

  // Remove trailing punctuation if needed
  cleanName = cleanName.replace(/[:.!,]+$/g, "");

  // Capitalize first letter
  cleanName = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);

  return cleanName;
};



export const generateProjectCodeStructure = async (message) => {

  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash", // or 1.5-pro if available
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0.75,
      maxOutputTokens: 8192,
    },
  });

  const result = await model.generateContent(message);
  const text = await result.response.text();

  try {
    const parsed = JSON.parse(text);
    return parsed.files; // { "filename": "content", ... }
  } catch (err) {
    console.error("Failed to parse Gemini response as JSON:", text);
    throw new Error("Invalid Gemini response format");
  }
};