import axios from 'axios';
require('dotenv').config();
//@ts-ignore
import OpenApi from 'openai';
export const callChatGPTAPI = async (prompt: string) => {
    const apiKey = process.env.ApiKey; // Replace with your actual OpenAI API key
    const orgId = process.env.OrgId; // Replace with your actual OpenAI API key

    try {
        const openai = new OpenApi({
            apiKey: apiKey,
            organization : orgId
        });
        const chatCompletion = await openai.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "gpt-4-0125-preview",
        });
        return chatCompletion;
    }
   catch (error) {
        console.error('Error calling the ChatGPT API:', error);
        return null;
    }
};

export const callChatGPTAPIDirectCall = async (prompt: string) => {
    const apiKey = process.env.ApiKey; // Replace with your actual OpenAI API key
    const url = 'https://api.openai.com/v1/engines/gpt-4-turbo/completions';

    try {
        const response = await axios.post(
            url,
            {
                model: 'gpt-4-turbo', // Specify the model
                prompt: prompt, // Your prompt
                max_tokens: 150, // Maximum number of tokens to generate
                temperature: 0.7, // Sampling temperature
                top_p: 1, // Nucleus sampling parameter
                frequency_penalty: 0, // Frequency penalty parameter
                presence_penalty: 0, // Presence penalty parameter
            },
            {
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        return response.data;
    } catch (error) {
        console.error('Error calling the ChatGPT API:', error);
        return null;
    }
};
