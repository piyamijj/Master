// api/gemini.js
import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(request, response) {
  // Sadece POST isteklerini kabul et
  if (request.method !== 'POST') {
    return response.status(405).json({ message: 'Method Not Allowed' });
  }

  const { prompt } = request.body;

  // Prompt'un boş olup olmadığını kontrol et
  if (!prompt) {
    return response.status(400).json({ message: 'Prompt is required.' });
  }

  // API anahtarını ortam değişkenlerinden al
  const apiKey = process.env.GEMINI_API_KEY;

  // API anahtarının mevcut olup olmadığını kontrol et
  if (!apiKey) {
    console.error('GEMINI_API_KEY ortam değişkeni ayarlanmamış.');
    return response.status(500).json({ message: 'Server configuration error: API key is missing.' });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    // Burada istediğiniz Gemini modelini kullanabilirsiniz.
    // Örneğin: "gemini-pro", "gemini-2.5-pro", "gemini-1.5-flash"
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(prompt);
    const geminiResponse = result.response.text();

    // Başarılı yanıtı döndür
    response.status(200).json({ response: geminiResponse });

  } catch (error) {
    // Hata durumunda konsola logla ve istemciye hata mesajı döndür
    console.error('Gemini API hatası:', error);
    // Hata mesajını istemciye daha açıklayıcı bir şekilde gönder
    response.status(500).json({ message: 'Internal Server Error', error: error.message || 'Bilinmeyen bir hata oluştu.' });
  }
}
