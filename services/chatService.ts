import {callChatGPTAPI, callChatGPTAPIDirectCall, callChatGPTAPIWithAttachment} from "./openApiService";
import OpenAI from "openai/index";
import ChatCompletion = OpenAI.ChatCompletion;
import {Room} from "../types/Room";

// const roomMap = new Map<string, Map<string,string[]| undefined>|undefined>();
const roomMap = new Map<string, Room>();

export async function manageConversation(id: string, prompt: string, attachmentContent?: string) {

    // let map = new Map<string, string[]| undefined>();
    let asPrompt = "";
    let history = [prompt] as unknown as string[]; // Initialize 'history' with an empty array containing 'prompt'



     roomMap.get(id) ? roomMap.get(id) : roomMap.set(id, {id, userPrompts: [], aiResponses: []});

    let room = roomMap.get(id)
    if (room) {
        room.userPrompts.push(prompt);


        if (map.has("AI")) {
            const aiHistory = map.get(prompt);
            if (aiHistory) {
                history = aiHistory;
                history.push(prompt);
            }
        } else {
            history = [];
            history.push(prompt);
            map.set("AI", history);
        }


        for (let i = 0; (map.get("User") && i < (map.get("User")?.length ?? 0)); i++) {

            if (map.get("User") && map.get("User")?.[i]) {
                asPrompt += map.get("User")?.[i];
            }
            if (map.get("AI") && map.get("AI")?.[i]) {
                asPrompt += ` AI: "${map.get("AI")?.[i]}"`;
            }
        }
        let completion: ChatCompletion | null;
        if (!attachmentContent) {
            completion = await callChatGPTAPI(asPrompt);
        } else {
            completion = await callChatGPTAPIWithAttachment(asPrompt, attachmentContent);
        }
        let response = completion !== null ? completion?.choices[0]?.message?.content ?? "Message not found" : "Message not found";
        if (completion) {
            let map = roomMap.get(id);
            let history = map?.get("AI");
            if (history) {
                //@ts-ignore
                history.push(response);
            }
        }
        return response;
    }
}
