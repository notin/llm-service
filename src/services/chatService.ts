import {callChatGPTAPI, callChatGPTAPIDirectCall, callChatGPTAPIWithAttachment} from "./openApiService";
import OpenAI from "openai/index";
import ChatCompletion = OpenAI.ChatCompletion;
import {PromptAndResponse, Room} from "../types/Room";

// const roomMap = new Map<string, Map<string,string[]| undefined>|undefined>();
const roomMap = new Map<string, Room>();


function getRoom(id: string) {

    let room = roomMap.get(id);
    if (!room) {
        room = {id, promptsAndResponses: []};
        roomMap.set(id, room);
    }
    return room;
}

export async function manageConversation(id: string, prompt: string, attachmentContent?: string) {

    // let map = new Map<string, string[]| undefined>();
    let asPrompt = "";
    let history = [prompt] as unknown as string[]; // Initialize 'history' with an empty array containing 'prompt'


    let room = getRoom(id);

    // roomMap.get(id)

    let promptAndResponse: PromptAndResponse = {prompt, response: ""};

    promptAndResponse.response = "";
    room.promptsAndResponses.push(promptAndResponse);

    room.promptsAndResponses.forEach((promptAndResponse) => {
        if (promptAndResponse.prompt) {
            asPrompt += promptAndResponse.prompt;
        }
        if (promptAndResponse.response) {
            asPrompt += promptAndResponse.response;
        }
    });


    let completion: ChatCompletion | null;
    if (!attachmentContent) {
        completion = await callChatGPTAPI(asPrompt);
    } else {
        completion = await callChatGPTAPIWithAttachment(asPrompt, attachmentContent);
    }
    // let response = completion !== null ? completion?.choices[0]?.message?.content ?? "Message not found" : "Message not found";
    let response = "";
    if (completion) {
        response = completion?.choices[0]?.message?.content as string;
        promptAndResponse.response = response;
    }
    return promptAndResponse;
}
