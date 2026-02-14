import type { ProcessedRegion } from "./types"

const GEMINI_API_KEY = process.env.GEMINI_API_KEY

const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`

async function callGemini(prompt: string): Promise<string> {
  if (!GEMINI_API_KEY) {
    return "AI explanation unavailable. Please configure the GEMINI_API_KEY environment variable."
  }

  try {
    const res = await fetch(GEMINI_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 300,
        },
      }),
    })

    if (!res.ok) {
      const errorText = await res.text()
      console.error("Gemini API error:", errorText)
      return "AI explanation temporarily unavailable."
    }

    const data = await res.json()
    return data.candidates?.[0]?.content?.parts?.[0]?.text ?? "No response generated."
  } catch (error) {
    console.error("Gemini service error:", error)
    return "AI explanation temporarily unavailable."
  }
}

const MINISTER_SYSTEM = `You are the Minister of Health of the Kingdom of Morocco. You speak in first person with the authority and gravitas of a senior government official. Your tone is dignified, caring toward citizens, and decisive. You reference "our citizens," "our regions," and "the Kingdom." You are concise but warm—a trusted voice during health concerns. Write in English.`

export async function generateRegionExplanation(
  region: ProcessedRegion
): Promise<string> {
  const prompt = `${MINISTER_SYSTEM}

As Minister of Health, deliver a brief 2-3 sentence assessment of the health situation in ${region.region_name}. Use first person ("I am closely monitoring..." or "I wish to inform citizens...").

Region: ${region.region_name}
Overall Risk Level: ${region.overall_level} (Score: ${region.overall_score})
Waterborne Disease Risk: ${region.categories.waterborne.level} (Score: ${region.categories.waterborne.score})
Vector-borne Disease Risk: ${region.categories.vector_borne.level} (Score: ${region.categories.vector_borne.score})
Respiratory Disease Risk: ${region.categories.respiratory.level} (Score: ${region.categories.respiratory.score})
Other Diseases: ${region.categories.other.level} (Score: ${region.categories.other.score})
Temperature: ${region.indicators.temperature}°C
Humidity: ${region.indicators.humidity}%
Water Quality Index: ${region.indicators.water_quality_index}/100
Population: ${region.indicators.population.toLocaleString()}

Normalized symptoms per 10k population:
- Waterborne: ${region.normalized.waterborne}
- Vector-borne: ${region.normalized.vector_borne}
- Respiratory: ${region.normalized.respiratory}
- Other: ${region.normalized.other}

Be specific about which disease categories concern you most. Sound like the Minister addressing citizens.`

  return callGemini(prompt)
}

export async function generateAlertMessage(
  region: ProcessedRegion
): Promise<string> {
  const prompt = `${MINISTER_SYSTEM}

As Minister of Health, issue a SHORT official alert (2 sentences max) for ${region.region_name}, which has been flagged as HIGH RISK. Speak in first person. Be urgent but reassuring—citizens must take the situation seriously while trusting that the Ministry is acting.

Overall Score: ${region.overall_score}
Highest Risk Categories: ${Object.entries(region.categories)
    .filter(([, v]) => v.level === "HIGH")
    .map(([k]) => k.replace("_", "-"))
    .join(", ") || "multiple categories"}
Temperature: ${region.indicators.temperature}°C
Humidity: ${region.indicators.humidity}%
Water Quality: ${region.indicators.water_quality_index}/100

Write like an official Ministry bulletin.`

  return callGemini(prompt)
}

export async function generateNationalSummary(
  regions: ProcessedRegion[]
): Promise<string> {
  const highRisk = regions.filter((r) => r.overall_level === "HIGH")
  const medRisk = regions.filter((r) => r.overall_level === "MEDIUM")
  const lowRisk = regions.filter((r) => r.overall_level === "LOW")

  const prompt = `${MINISTER_SYSTEM}

As Minister of Health, deliver a brief national health briefing (3-4 sentences) to the citizens of the Kingdom. Use first person. Acknowledge the overall situation, highlight regions requiring attention, and reaffirm the Ministry's commitment to protecting public health.

Total Regions: 12
High Risk: ${highRisk.length} regions (${highRisk.map((r) => r.region_name).join(", ") || "none"})
Medium Risk: ${medRisk.length} regions (${medRisk.map((r) => r.region_name).join(", ") || "none"})
Low Risk: ${lowRisk.length} regions (${lowRisk.map((r) => r.region_name).join(", ") || "none"})

Average scores across all regions:
- Waterborne: ${(regions.reduce((s, r) => s + r.categories.waterborne.score, 0) / regions.length).toFixed(1)}
- Vector-borne: ${(regions.reduce((s, r) => s + r.categories.vector_borne.score, 0) / regions.length).toFixed(1)}
- Respiratory: ${(regions.reduce((s, r) => s + r.categories.respiratory.score, 0) / regions.length).toFixed(1)}

Write like a ministerial address to the nation.`

  return callGemini(prompt)
}
