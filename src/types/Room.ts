export interface PromptAndResponse {
    prompt: string;
    response: string;
}

export interface Room {
    id: string;
    promptsAndResponses: Array<PromptAndResponse>;
}