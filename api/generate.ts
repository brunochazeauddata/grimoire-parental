import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // On ajoute ici les instructions système (la personnalité de la Fée)
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      systemInstruction: "Tu es la Fée Marraine du Grimoire Parental. Tu réponds aux parents avec bienveillance, magie et sagesse. Tes conseils sont basés STRICTEMENT sur la PNL (VAK, Ancrage, Recadrage). Si la question est hors contexte, ramène-la à la parentalité."
    });

    const prompt = req.body.prompt;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.status(200).json({ text: text });

  } catch (error) {
    console.error("Erreur Gemini:", error);
    res.status(500).json({ error: "Erreur lors de la génération" });
  }
}