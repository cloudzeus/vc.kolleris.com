import OpenAI from 'openai';

// DeepSeek API client
// Note: DeepSeek uses the same API format as OpenAI
export const deepseek = new OpenAI({
    apiKey: process.env.DEEPSEEK_API_KEY || 'dummy-key', // Fallback to avoid crash if key missing during build
    baseURL: 'https://api.deepseek.com',
});

export async function summarizeMeeting(transcript: string, language: string = 'en'): Promise<string> {
    if (!process.env.DEEPSEEK_API_KEY) {
        console.warn('DEEPSEEK_API_KEY is not set. Skipping summarization.');
        return 'Summarization skipped: DEEPSEEK_API_KEY is missing.';
    }

    try {
        const response = await deepseek.chat.completions.create({
            model: 'deepseek-chat',
            messages: [
                {
                    role: 'system',
                    content: `You are a helpful assistant that summarizes meeting transcripts. 
          Please provide a concise summary of the following meeting transcript.
          IMPORTANT: You MUST write the summary in the detected language: ${language}.
          If the language is Greek, write in Greek. If English, write in English.`
                },
                {
                    role: 'user',
                    content: transcript
                },
            ],
            temperature: 0.7,
            max_tokens: 500,
        });

        return response.choices[0]?.message?.content || 'Failed to generate summary.';
    } catch (error) {
        console.error('DeepSeek summarization error:', error);
        return 'Failed to generate summary due to an error.';
    }
}
