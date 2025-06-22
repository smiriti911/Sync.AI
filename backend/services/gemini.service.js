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
  if (!message || typeof message !== "string") {
    throw new Error("Message must be a valid string");
  }

  const prompt = `
Generate a Project in React. Create multiple components, organizing them in separate folders with filenames using the .js extension, if needed. The output should use Tailwind CSS for styling, 
without any third-party dependencies or libraries, except for icons from the lucide-react library, which should only be used when necessary. Available icons include: Heart, Shield, Clock, Users, Play, Home, Search, Menu, User, Settings, Mail, Bell, Calendar, Star, Upload, Download, Trash, Edit, Plus, Minus, Check, X, and ArrowRight. For example, you can import an icon as import { Heart } from "lucide-react" and use it in JSX as <Heart className="" />.
also you can use date-fns for date format and react-chartjs-2 chart, graph library

Return the response in JSON format with the following schema:
{
  "projectTitle": "",
  "explanation": "",
  "files": {
    "/App.js": {
      "code": ""
    },
    ...
  },
  "generatedFiles": []
}

Here's the reformatted and improved version of your prompt:

Generate a programming code structure for a React project using Vite. Create multiple components, organizing them in separate folders with filenames using the .js extension, if needed. The output should use Tailwind CSS for styling, without any third-party dependencies or libraries, except for icons from the lucide-react library, which should only be used when necessary. Available icons include: Heart, Shield, Clock, Users, Play, Home, Search, Menu, User, Settings, Mail, Bell, Calendar, Star, Upload, Download, Trash, Edit, Plus, Minus, Check, X, and ArrowRight. For example, you can import an icon as import { Heart } from "lucide-react" and use it in JSX as <Heart className="" />.

Return the response in JSON format with the following schema:

json
Copy code
{
  "projectTitle": "",
  "explanation": "",
  "files": {
    "/App.js": {
      "code": ""
    },
    ...
  },
  "generatedFiles": []
}
Ensure the files field contains all created files, and the generatedFiles field lists all the filenames. Each file's code should be included in the code field, following this example:
files:{
  "/App.js": {
    "code": "import React from 'react';\\nimport './styles.css';\\nexport default function App() {\\n  return (\\n    <div className='p-4 bg-gray-100 text-center'>\\n      <h1 className='text-2xl font-bold text-blue-500'>Hello, Tailwind CSS with Sandpack!</h1>\\n      <p className='mt-2 text-gray-700'>This is a live code editor.</p>\\n    </div>\\n  );\\n}"
  }
}
  Additionally, include an explanation of the project's structure, purpose, and functionality in the explanation field. Make the response concise and clear in one paragraph.
  - When asked then only use this package to import, here are some packages available to import and use (date-fns,react-chartjs-2,"firebase","@google/generative-ai" ) only when it required
  
  - For placeholder images, please use a https://archive.org/download/placeholder-image/placeholder-image.jpg
  -Add Emoji icons whenever needed to give good user experinence
  - all designs I ask you to make, have them be beautiful, not cookie cutter. Make webpages that are fully featured and worthy for production.

- By default, this template supports JSX syntax with Tailwind CSS classes, React hooks, and Lucide React for icons. Do not install other packages for UI themes, icons, etc unless absolutely necessary or I request them.

- Use icons from lucide-react for logos.

- Use stock photos from unsplash where appropriate, only valid URLs you know exist. Do not download the images, only link to them in image tags.
  
User Request: "${message}"

IMPORTANT: You must return ONLY valid JSON. No other text or explanations. The JSON must contain projectTitle, explanation, files (with code property for each file), and generatedFiles array.
`;

  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0.3,
      maxOutputTokens: 8192, // Increased for larger projects
    },
  });

  let result;
  try {
    console.log("📤 Sending request to Gemini...");
    result = await model.generateContent(prompt);
  } catch (genErr) {
    console.error("❌ Gemini generation error:", genErr);
    throw new Error(`Failed to get response from Gemini: ${genErr.message}`);
  }

  const text = await result.response.text();
  console.log("📥 Raw response length:", text.length);
  console.log("📥 Response preview:", text.substring(0, 200) + "...");

  try {
    const parsed = JSON.parse(text);
    console.log("✅ JSON parsed successfully");
    console.log("🔍 Response structure:", {
      hasProjectTitle: !!parsed.projectTitle,
      hasExplanation: !!parsed.explanation,
      hasFiles: !!parsed.files,
      filesCount: parsed.files ? Object.keys(parsed.files).length : 0,
      hasGeneratedFiles: !!parsed.generatedFiles
    });

    // Validate response structure
    if (!parsed.files) {
      throw new Error("Response missing 'files' property");
    }

    // Process files to extract code content
    const processedFiles = {};
    
    for (const [filename, fileContent] of Object.entries(parsed.files)) {
      console.log(`🔍 Processing file: ${filename}`);
      
      let code = '';
      
      if (typeof fileContent === 'string') {
        // If file content is directly a string
        code = fileContent;
      } else if (fileContent && typeof fileContent === 'object' && fileContent.code) {
        // If file content has a 'code' property
        code = fileContent.code;
      } else {
        console.warn(`⚠️ Invalid file content structure for: ${filename}`);
        continue;
      }
      
      if (!code || code.trim().length === 0) {
        console.warn(`⚠️ Empty code content for: ${filename}`);
        continue;
      }
      
      // Clean filename (remove leading slash if present)
      const cleanFilename = filename.startsWith('/') ? filename.slice(1) : filename;
      processedFiles[cleanFilename] = code.trim();
      
      console.log(`✅ Added file: ${cleanFilename} (${code.length} characters)`);
    }

    if (Object.keys(processedFiles).length === 0) {
      throw new Error("No valid files found in response");
    }

    console.log("📊 Final processed files:", Object.keys(processedFiles));
    
    // Return the processed files (flat structure: filename -> code)
    return processedFiles;
    
  } catch (parseErr) {
    console.error("❌ Failed to parse Gemini response:", parseErr);
    console.error("📄 Raw response text:", text);
    
    // Try to extract JSON if response has extra content
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        console.log("🔧 Attempting to extract JSON from response...");
        const extractedJson = JSON.parse(jsonMatch[0]);
        console.log("✅ Successfully extracted JSON, retrying...");
        
        // Process the extracted JSON
        const processedFiles = {};
        if (extractedJson.files) {
          for (const [filename, fileContent] of Object.entries(extractedJson.files)) {
            const code = typeof fileContent === 'string' ? fileContent : fileContent?.code;
            if (code && code.trim()) {
              const cleanFilename = filename.startsWith('/') ? filename.slice(1) : filename;
              processedFiles[cleanFilename] = code.trim();
            }
          }
        }
        return processedFiles;
        
      } catch (extractErr) {
        console.error("❌ Failed to extract JSON:", extractErr);
      }
    }
    
    throw new Error(`Invalid Gemini response format: ${parseErr.message}`);
  }
};