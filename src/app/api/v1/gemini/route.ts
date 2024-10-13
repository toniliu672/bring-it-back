import { NextRequest, NextResponse } from "next/server";

const GEMINI_AI_API_KEY = process.env.GEMINI_AI_API_KEY;

const CONTEXT = `Anda adalah asisten AI yang menganalisis data Sekolah Menengah Kejuruan (SMK) di Minahasa, Sulawesi Utara, Indonesia. Fokus pada kesesuaian kompetensi sekolah dengan kebutuhan industri di daerah tersebut. Ketika menyebutkan persentase kecocokan, jelaskan bahwa itu menunjukkan berapa banyak unit kompetensi dari suatu okupasi yang dimiliki oleh sekolah, bukan kesenjangan keseluruhan.`;

export async function POST(req: NextRequest) {
  try {
    const { schoolData, question } = await req.json();
    let prompt = `${CONTEXT}\n\nAnalisis data sekolah berikut dan berikan kesimpulan singkat (maksimal 100 kata) tentang kesesuaian kompetensi dengan kebutuhan industri, tanpa menyimpulkan tentang kesenjangan: ${JSON.stringify(
      schoolData
    )}`;
    if (schoolData) {
      prompt = `${CONTEXT}\n\nAnalisis data sekolah berikut dan berikan kesimpulan singkat (maksimal 100 kata) tentang kesesuaian kompetensi dengan kebutuhan industri: ${JSON.stringify(
        schoolData
      )}`;
    } else if (question) {
      prompt = `${CONTEXT}\n\nPertanyaan: ${question}\n\nBerikan jawaban singkat dan informatif (maksimal 50 kata) berdasarkan data yang telah dianalisis sebelumnya. Jika ditanya tentang nama okupasi atau detail spesifik yang tidak disebutkan sebelumnya, katakan bahwa informasi tersebut tidak tersedia dalam data yang dianalisis.`;
    } else {
      return NextResponse.json({ message: "Invalid request" }, { status: 400 });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_AI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            maxOutputTokens: 200,
            temperature: 0.7,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API Error: ${response.statusText}`);
    }

    const result = await response.json();
    // console.log("Gemini API response:", result);  
    return NextResponse.json(result);
  } catch (error) {
    // console.error('Error connecting to Gemini API:', error);
    return NextResponse.json({ message: 'Error connecting to Gemini API', error }, { status: 500 });
  }
}
