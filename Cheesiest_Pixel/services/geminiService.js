// Gemini API is disabled - using placeholder functions

export async function getGeminiSuggestion(prompt) {
  return "Gemini is disabled right now – placeholder response.";
}

export const getDifferentialDiagnosis = async (symptoms, history) => {
    // Gemini API is disabled - returning placeholder response
    return {
        differentialDiagnosis: ["API Disabled - Placeholder Response"],
        suggestedTests: [],
        integratedApproach: "Gemini is disabled right now – placeholder response."
    };
};

export const getTrendAnalysis = async (topic) => {
    // Gemini API is disabled - returning placeholder response
    return "Gemini is disabled right now – placeholder response.";
};
