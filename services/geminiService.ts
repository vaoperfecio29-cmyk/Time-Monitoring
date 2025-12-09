import { GoogleGenAI } from "@google/genai";
import { TimeLog, AppSettings, DailyStats } from '../types';
import { calculateDailyStats } from '../utils/timeUtils';

export const analyzeWorkMonth = async (
  logs: TimeLog[],
  settings: AppSettings,
  monthName: string
): Promise<string> => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      throw new Error("API Key not found");
    }

    const ai = new GoogleGenAI({ apiKey });

    // Prepare data for the prompt
    const stats: DailyStats[] = logs.map(log => calculateDailyStats(log, settings));
    
    const summaryData = stats.map(s => `
      Date: ${s.date}
      Hours Worked: ${s.totalHours.toFixed(2)}
      Late Hours: ${s.lateHours.toFixed(2)}
      Earnings: ${s.earnings.toFixed(2)}
    `).join('\n');

    const prompt = `
      You are a helpful productivity assistant. Analyze the following work attendance data for ${monthName}.
      
      Official Schedule Context:
      - Working Days: Monday to Saturday (6 days/week).
      - Rest Day: Sunday.
      - Morning Shift: 09:00 AM - 12:00 PM (Noon).
      - Afternoon Shift: 01:00 PM - 06:00 PM.
      - Lunch Break: 12:00 PM - 01:00 PM.
      - Expected Total Daily Hours: 8 hours.

      Settings:
      - Hourly Rate: ${settings.hourlyRate} ${settings.currency}

      Data:
      ${summaryData}

      Please provide a concise, friendly summary that includes:
      1. Overall attendance performance based on the 09:00 AM start time.
      2. Adherence to the full day schedule (Morning & Afternoon shifts).
      3. Total estimated earnings and hours.
      4. Any patterns noticed (e.g., consistency on Saturdays, late arrivals).
      5. A short encouraging tip for better productivity or work-life balance.
      
      Keep the response under 200 words. Return plain text with simple formatting.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Unable to generate analysis at this time.";

  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error connecting to AI service. Please check your API key and try again.";
  }
};