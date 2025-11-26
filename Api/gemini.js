// api/gemini.js
import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    return response.status(405).json({ message: 'Method Not Allowed' });
  }

  const { prompt } = request.body;

  if (!prompt) {
    return response.status(400).json({ message: 'Prompt is required.' });
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY); // API anahtarınızı buradan çekin
    const model = genAI.getGenerativeModel({ model: "gemini-pro"}); // Kullandığınız Gemini modeli

    const result = await model.generateContent(prompt);
    const geminiResponse = result.response.text();

    response.status(200).json({ response: geminiResponse });

  } catch (error) {
    console.error('Gemini API hatası:', error);
    response.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
}
