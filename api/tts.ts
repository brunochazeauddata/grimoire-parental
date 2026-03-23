// Fichier : /api/tts.ts

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  try {
    // On récupère la clé depuis le coffre-fort de Vercel
    const apiKey = process.env.GOOGLE_TTS_API_KEY;
    
    if (!apiKey) {
      console.error("❌ Clé API TTS manquante");
      return res.status(500).json({ error: "Configuration API manquante" });
    }
    
    const url = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`;

    console.log("🔊 Envoi requête à Google TTS...");

    // On fait la demande à Google depuis le serveur
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body) // On transmet les paramètres de la voix
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("❌ Erreur Google TTS :", data);
      throw new Error(`Erreur Google TTS: ${JSON.stringify(data)}`);
    }

    console.log("✅ Audio généré avec succès, taille:", data.audioContent?.length || 0);
    
    // On renvoie le fichier audio au frontend
    res.status(200).json(data);

  } catch (error) {
    console.error("❌ Erreur TTS:", error);
    res.status(500).json({ error: "Erreur lors de la génération audio" });
  }
}
