import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini client with the API key from environment variables
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

/**
 * Get a configured Gemini model
 * @param {string} modelName - The model to use (default: gemini-1.5-pro)
 * @returns {GoogleGenerativeAI.GenerativeModel} Configured model instance
 */
export const getGeminiModel = (modelName = 'gemini-1.5-pro') => {
  return genAI?.getGenerativeModel({ 
    model: modelName,
    generationConfig: {
      temperature: 0.3,
      topK: 40,
      topP: 0.8,
      maxOutputTokens: 8192,
    }
  });
};

/**
 * Generate business insights from data analysis
 * @param {Object} analysisData - The processed data and analysis results
 * @param {string} focusBrand - The brand to focus analysis on
 * @returns {Promise<string>} Generated insights in markdown format
 */
export const generateBusinessInsights = async (analysisData, focusBrand) => {
  try {
    const model = getGeminiModel();
    
    const prompt = `
You are a senior business analyst expert. Analyze the following market data and generate comprehensive business insights for ${focusBrand}.

Data Analysis Results:
${JSON.stringify(analysisData, null, 2)}

Focus Brand: ${focusBrand}

Generate a detailed business intelligence report in markdown format that includes:

1. **Executive Summary** - Key findings and strategic recommendations
2. **Market Position Analysis** - How ${focusBrand} compares to competitors
3. **Regional Performance** - Geographic strength and opportunities
4. **Distribution Analysis** - Channel effectiveness and availability insights
5. **Competitive Landscape** - Main competitors and market dynamics
6. **Strategic Recommendations** - Specific actionable insights
7. **Risk Assessment** - Potential challenges and mitigation strategies

Important Guidelines:
- Base analysis ONLY on the provided data - no hypothetical information
- Highlight ${focusBrand} performance specifically
- Provide quantitative insights where data supports it
- Include competitor comparisons where relevant
- Focus on actionable business recommendations
- Use clear, professional business language
- Format as proper markdown with headers and bullet points
`;

    const result = await model.generateContent(prompt);
    const response = await result?.response;
    return response?.text();
  } catch (error) {
    console.error('Error generating business insights:', error);
    throw new Error('Failed to generate business insights. Please try again.');
  }
};

/**
 * Generate chart explanations and insights
 * @param {Object} chartData - Chart data and configuration
 * @param {string} chartType - Type of chart (bar, line, pie, etc.)
 * @param {string} focusBrand - The brand to focus on
 * @returns {Promise<string>} Generated chart explanation
 */
export const generateChartInsights = async (chartData, chartType, focusBrand) => {
  try {
    const model = getGeminiModel();
    
    const prompt = `
As a data visualization expert, explain this ${chartType} chart data in business terms:

Chart Data: ${JSON.stringify(chartData, null, 2)}
Chart Type: ${chartType}
Focus Brand: ${focusBrand}

Provide a clear, concise explanation that includes:
1. What the chart shows
2. Key patterns or trends
3. How ${focusBrand} performs relative to others
4. What business decisions this data supports
5. Any notable insights or anomalies

Keep the explanation professional but accessible, suitable for business stakeholders.
`;

    const result = await model.generateContent(prompt);
    const response = await result?.response;
    return response?.text();
  } catch (error) {
    console.error('Error generating chart insights:', error);
    return 'Unable to generate chart insights at this time.';
  }
};

/**
 * Answer specific business questions based on data
 * @param {string} question - The business question to answer
 * @param {Object} dataContext - Relevant data context
 * @param {string} focusBrand - The brand to focus on
 * @returns {Promise<string>} Generated answer
 */
export const answerBusinessQuestion = async (question, dataContext, focusBrand) => {
  try {
    const model = getGeminiModel();
    
    const prompt = `
Answer this business question based on the provided data:

Question: ${question}
Focus Brand: ${focusBrand}
Data Context: ${JSON.stringify(dataContext, null, 2)}

Provide a direct, data-driven answer that:
1. Directly addresses the question
2. Uses specific metrics from the data
3. Provides context and implications
4. Suggests follow-up actions if relevant

Base your answer strictly on the provided data. If the data doesn't support a complete answer, explain what additional information would be needed.
`;

    const result = await model.generateContent(prompt);
    const response = await result?.response;
    return response?.text();
  } catch (error) {
    console.error('Error answering business question:', error);
    return 'Unable to answer the question at this time. Please try again.';
  }
};

export default genAI;