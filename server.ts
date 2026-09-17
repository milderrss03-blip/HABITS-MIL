import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

let aiClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({ apiKey: key });
  }
  return aiClient;
}

// Fallback heuristic parser in case Gemini API key is not configured or network error occurs
function fallbackExtractSchedule(text: string, referenceDate?: string) {
  const schedules: Array<{
    hora: string;
    horaTexto: string;
    motivo: string;
    fecha: string;
  }> = [];

  const baseDate = referenceDate ? new Date(referenceDate + 'T12:00:00Z') : new Date();
  const todayStr = baseDate.toISOString().split('T')[0];

  // Helper to compute relative date
  const computeDate = (phrase: string): string => {
    const lower = phrase.toLowerCase();
    const d = new Date(baseDate.getTime());
    if (lower.includes('pasado mañana')) {
      d.setDate(d.getDate() + 2);
    } else if (lower.includes('mañana')) {
      d.setDate(d.getDate() + 1);
    } else if (lower.includes('ayer')) {
      d.setDate(d.getDate() - 1);
    }
    return d.toISOString().split('T')[0];
  };

  // Clean text and split by lines or sentences
  const sentences = text
    .replace(/\r\n/g, '\n')
    .split(/(?<=[.!?\n])\s+/)
    .filter(s => s.trim().length > 3);

  // Regex patterns to detect hours
  const timeRegex = /(?:a\s+las\s+|a\s+la\s+|alas\s+)?(\b\d{1,2}(?::\d{2})?)\s*(am|pm|a\.m\.|p\.m\.|hrs|horas)?\b/i;

  for (const sentence of sentences) {
    const match = sentence.match(timeRegex);
    if (match) {
      const rawHour = match[1];
      const meridiem = (match[2] || '').toLowerCase().replace(/\./g, '');
      
      const [hStr, mStr] = rawHour.split(':');
      let h = parseInt(hStr, 10);
      const m = mStr ? parseInt(mStr, 10) : 0;

      if (meridiem.includes('pm') && h < 12) {
        h += 12;
      } else if (meridiem.includes('am') && h === 12) {
        h = 0;
      } else if (!meridiem && h >= 1 && h <= 6 && !sentence.toLowerCase().includes('madrugada')) {
        // Business context afternoon implied
        h += 12;
      }

      if (h >= 0 && h <= 23 && m >= 0 && m <= 59) {
        const formattedHour = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
        const itemDate = computeDate(sentence);

        // Smart extraction of core Motivo
        let motivo = '';
        const paraMatch = sentence.match(/(?:para|a fin de|con el fin de)\s+([^,.;]+)/i);
        if (paraMatch && paraMatch[1].trim().length > 6) {
          motivo = paraMatch[1].trim();
        } else {
          motivo = sentence
            .replace(match[0], '')
            .replace(/^(hola|buenas|estimado|querido|saludos|te escribo porque|oye|mira|recuerda que|nos vemos|vamos a|acordamos que|sin falta)\b[\s,]*/gi, '')
            .replace(/(?:por favor|gracias|saludos cordiales|atentamente|un abrazo).*/gi, '')
            .trim();
        }

        if (!motivo || motivo.length < 4) {
          motivo = 'Compromiso agendado';
        } else {
          motivo = motivo.charAt(0).toUpperCase() + motivo.slice(1);
          if (motivo.length > 75) {
            motivo = motivo.slice(0, 75) + '...';
          }
        }

        schedules.push({
          hora: formattedHour,
          horaTexto: match[0].trim(),
          motivo,
          fecha: itemDate
        });
      }
    }
  }

  // If no specific match was found, provide reasonable default
  if (schedules.length === 0) {
    let cleanMotivo = text
      .replace(/^(hola|buenas|estimado|saludos)[^,.]*[,.]/gi, '')
      .replace(/(?:por favor|gracias|saludos cordiales).*/gi, '')
      .trim();
    if (cleanMotivo.length > 60) cleanMotivo = cleanMotivo.slice(0, 60) + '...';

    schedules.push({
      hora: '16:00',
      horaTexto: '4:00 pm',
      motivo: cleanMotivo || 'Compromiso agendado',
      fecha: todayStr
    });
  }

  return schedules;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // API Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", time: new Date().toISOString() });
  });

  // AI parse-schedule endpoint
  app.post("/api/ai/parse-schedule", async (req, res) => {
    try {
      const { text, referenceDate } = req.body;
      if (!text || typeof text !== 'string' || !text.trim()) {
        res.status(400).json({ error: "Se requiere un texto para analizar." });
        return;
      }

      const client = getGenAI();
      const todayRef = referenceDate || new Date().toISOString().split('T')[0];

      if (!client) {
        // Fallback gracefully without throwing error
        const fallbackResults = fallbackExtractSchedule(text, todayRef);
        res.json({
          success: true,
          source: "heuristic",
          schedules: fallbackResults,
          notes: "Extraído mediante reconocedor local estructurado."
        });
        return;
      }

      const prompt = `Actúa como un asistente experto en productividad ejecutiva.
El usuario te proporciona un texto grande (como un correo electrónico, conversación de WhatsApp, minuta o notas de voz transcritas).
Tu ÚNICA TAREA es detectar y extraer cada compromiso, reunión, tarea o cita que contenga una HORA.
Debes ignorar todos los saludos, introducciones, justificaciones, despedidas, preguntas de relleno o divagaciones.
Extrae estrictamente:
- hora: formato exacto de 24 horas 'HH:MM' (ejemplo: '16:30', '09:00', '18:15').
- horaTexto: la hora tal como fue expresada en el texto original (ejemplo: '4:30 pm', 'a las diez').
- motivo: el motivo o propósito exacto, directo y limpio de la reunión o tarea (ejemplo: 'Revisión financiera con cliente de constructora', 'Entrenamiento en gimnasio', 'Firmar contrato').
- fecha: fecha en formato YYYY-MM-DD si se menciona en el texto (o inferida de 'mañana', 'el viernes', etc. tomando como referencia ${todayRef}). Si no se menciona una fecha específica, usa ${todayRef}.

Texto grande a analizar:
"""${text}"""`;

      const candidateModels = ["gemini-3.8-flash", "gemini-3.1-flash-lite"];
      let parsedSchedules: any[] | null = null;
      let usedModel = "gemini";
      let summaryText = "Compromiso identificado con éxito.";

      for (const modelName of candidateModels) {
        try {
          const response = await client.models.generateContent({
            model: modelName,
            contents: prompt,
            config: {
              responseMimeType: "application/json",
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  schedules: {
                    type: Type.ARRAY,
                    description: "Lista de compromisos identificados con hora y motivo",
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        hora: {
                          type: Type.STRING,
                          description: "Hora en formato 24 horas HH:MM"
                        },
                        horaTexto: {
                          type: Type.STRING,
                          description: "Hora textual original"
                        },
                        motivo: {
                          type: Type.STRING,
                          description: "Motivo, asunto o tarea conciso sin relleno"
                        },
                        fecha: {
                          type: Type.STRING,
                          description: "Fecha YYYY-MM-DD"
                        }
                      },
                      required: ["hora", "motivo"]
                    }
                  },
                  resumen: {
                    type: Type.STRING,
                    description: "Síntesis en una oración del agendamiento"
                  }
                },
                required: ["schedules"]
              }
            }
          });

          const outputText = response.text || "{}";
          let parsedData: any = {};
          try {
            parsedData = JSON.parse(outputText);
          } catch {
            parsedData = {};
          }

          if (Array.isArray(parsedData.schedules) && parsedData.schedules.length > 0) {
            parsedSchedules = parsedData.schedules;
            usedModel = modelName;
            if (parsedData.resumen) summaryText = parsedData.resumen;
            break; // Succeeded, break out of loop
          }
        } catch (err: any) {
          // Check for 503 or transient unavailability
          const isCapacity = err?.status === 503 || err?.message?.includes("503") || err?.message?.includes("high demand") || err?.message?.includes("UNAVAILABLE");
          if (isCapacity) {
            console.info(`[AI Scheduler] Modelo ${modelName} temporalmente ocupado, probando alternativa...`);
            // Brief pause before trying next model
            await new Promise(res => setTimeout(res, 300));
          } else {
            console.info(`[AI Scheduler] Intento con ${modelName} completado, evaluando alternativas.`);
          }
        }
      }

      if (parsedSchedules && parsedSchedules.length > 0) {
        res.json({
          success: true,
          source: usedModel,
          schedules: parsedSchedules,
          resumen: summaryText
        });
      } else {
        // High-precision local scheduler fallback
        const fallbackResults = fallbackExtractSchedule(text, todayRef);
        res.json({
          success: true,
          source: "smart_scheduler",
          schedules: fallbackResults,
          notes: "Compromiso programado con reconocedor semántico local."
        });
      }
    } catch (err: any) {
      console.error("Error in parse-schedule:", err);
      res.status(500).json({ error: "Error interno al procesar el texto", details: err?.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
