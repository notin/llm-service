import {callChatGPTAPI, callChatGPTAPIDirectCall} from "./openApiService";

const conversationMap = new Map<string, Map<string,string[]| undefined>|undefined>();
export async function manageConversation(id: string, prompt: string) {
    let map = new Map<string, string[]| undefined>();
    let asPrompt = "";
    let history= [prompt] as unknown as string[]; // Initialize 'history' with an empty array containing 'prompt'
    map.set("User", []);
    map.set("AI", []);

    if (conversationMap.has(id)) {
        map = conversationMap.get(id) || new Map<string, string[]>();

        if (map.has("User")) {
            const userHistory = map.get("User");
            if (userHistory) {
                history = userHistory;
                history.push(prompt);
            }
        } else {
            history = [];
            history.push(prompt);
            map.set("User", history);
        }
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


    }
   else {
       //@ts-ignore
        map.set("User", [prompt]);
        conversationMap.set(id, map);
    }
    for (let i = 0; (map.get("User") && i < (map.get("User")?.length ?? 0)); i++) {

        if (map.get("User") && map.get("User")?.[i]) {
            asPrompt += map.get("User")?.[i];
        }
        if (map.get("AI") && map.get("AI")?.[i]) {
            asPrompt += ` AI: "${map.get("AI")?.[i]}"`;
        }
    }

    let completion = await callChatGPTAPI(asPrompt);
    let response = completion?.choices[0]?.message?.content ?? "Message not found";
    if (completion) {
        let map = conversationMap.get(id);
        let history = map?.get("AI");
        if (history) {
            //@ts-ignore

            history.push(response);
        }
    }
    return response;
}
