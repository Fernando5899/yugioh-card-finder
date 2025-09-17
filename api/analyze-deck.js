import { GoogleGenerativeAI } from '@google/generative-ai';

// Esta es la función que Vercel ejecutará cuando se llame a /api/analyze-deck
export default async function handler(request, response) {
  // Por seguridad, solo permitimos peticiones de tipo POST
  if (request.method !== 'POST') {
    return response.status(405).json({ message: 'Only POST requests allowed' });
  }

  try {
    // 1. Obtenemos la lista de cartas que nuestra app de Vue nos envía
    const { mainDeck, extraDeck } = request.body;
    if (!mainDeck || mainDeck.length < 1) {
      return response.status(400).json({ message: 'El mazo principal no puede estar vacío.' });
    }

    // 2. Configuramos la API de Gemini usando nuestra clave secreta
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    // 3. Creamos el "prompt": la instrucción para la IA
    const decklist = [...mainDeck, ...extraDeck].join(', ');
    const prompt = `
      Eres un experto mundial en el juego de cartas Yu-Gi-Oh!, analítico y conciso.
      Analiza el siguiente mazo. Proporciona un análisis breve (máximo 150 palabras) en formato Markdown que incluya:
      1.  **Estrategia Principal:** ¿Cuál es la condición de victoria del mazo?
      2.  **Fortaleza Clave:** ¿Cuál es su punto más fuerte?
      3.  **Debilidad Evidente:** ¿Cuál es su mayor vulnerabilidad?
      4.  **Sugerencia de Mejora:** Sugiere una carta que podría mejorar el mazo y explica brevemente por qué.

      Lista de cartas en el mazo: ${decklist}
    `;

    // 4. Enviamos el prompt a Gemini y esperamos la respuesta
    const result = await model.generateContent(prompt);
    const aiResponse = await result.response;
    const text = aiResponse.text();

    // 5. Enviamos la respuesta de la IA de vuelta a nuestra app de Vue
    return response.status(200).json({ analysis: text });

  } catch (error) {
    console.error('Error al llamar a la API de Gemini:', error);
    return response.status(500).json({ message: 'Hubo un error al procesar tu solicitud.' });
  }
}
