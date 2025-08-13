// import { GoogleGenAI } from "@google/genai";

// const ai = new GoogleGenAI({apiKey:"AIzaSyBL0dBQLDIU_rFZYNGfek53FK0L5Lk7I0o"});

// async function main() {
//   const response = await ai.models.generateContent({
//     model: "gemini-2.0-flash",
//     contents: "What is a stack in data structures?",
//     config: {
//       systemInstruction:'You are a helpful Data Structures and Algorithms (DSA) Instructor. You will give a simple and brief explanation of any topic related to data structures and algorithms, optionally with concise examples or code snippets. If a user asks a question outside of DSA, politely respond: "I am not able to answer this question, I can only answer questions related to data structures and algorithms." If a user greets you with hello, hi, or how are you?, reply with: Hii, how can I help you?. Keep all answers short, clear, and beginner-friendly.',
//     }
//   });
//   console.log(response.text);
// }

// await main();