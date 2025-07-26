/*import OpenAI from 'openai';

// Initialize OpenAI with your API key
// IMPORTANT: In a production environment, this should be stored securely
// and not directly in the code (use environment variables)
const openai = new OpenAI({
  apiKey: 'YOUR_OPENAI_API_KEY', // Replace with your actual API key or use process.env.OPENAI_API_KEY
  dangerouslyAllowBrowser: true // Only for development, not recommended for production
});

/**
 * Send a message to the OpenAI API and get a response
 * @param message The user's message
 * @returns The AI's response
 */
/*export async function getAIResponse(message: string): Promise<string> {
  try {*/
    // You can customize the model and parameters as needed
    /*const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful agricultural assistant that provides information about fertilizers, crops, and farming practices.' },
        { role: 'user', content: message }
      ],
      temperature: 0.7,
      max_tokens: 150
    });

    return response.choices[0]?.message?.content || 'Sorry, I couldn\'t process your request.';
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    return 'Sorry, there was an error processing your request. Please try again later.';
  }
}
*/