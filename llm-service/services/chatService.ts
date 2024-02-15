import {callChatGPTAPI} from "./openApiService";

const conversationMap = new Map<string, string>();
export async function manageConversation(id: string, prompt: string) {
    if (conversationMap.has(id)) {
        prompt = conversationMap.get(id) + " " + prompt;
    }
    else {
        conversationMap.set(id, prompt);
    }
    callChatGPTAPI(prompt);

}
