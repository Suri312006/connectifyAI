import { HF_TOKEN } from "$env/static/private";
import { modelTypes } from "./modelTypes";
// Create your Hugging Face Token: https://huggingface.co/settings/tokens
// Set your Hugging Face Token: https://scrimba.com/dashboard#env
// Learn more: https://scrimba.com/links/env-variables
const token = HF_TOKEN

if (!token) {
    throw new Error("need hf token ")
}

export async function searchModels(query: string) {

    const limit = 5;

    const response = await fetch(
        `https://huggingface.co/api/models?search=${query}&limit=${limit}&full=true&config=true`,
        {
            method: "GET",
            headers: { "Authorization": `Bearer ${HF_TOKEN}` }
        }
    )
    let modelInfos = await response.json()

    let cleaned: Model[] = []

    for (const modelInfo of modelInfos) {

        let pipeline_tag = ""

        try {
            pipeline_tag = modelInfo.pipeline_tag;
            console.log(pipeline_tag);
        } catch (e) {
            //TODO: handle here
            console.log(e)
        }

        const io = getIo(pipeline_tag);

        const model: Model = {
            ...modelInfo,
            input: io['inputs'],
            output: io['outputs'],
        }

        cleaned.push(model)
    }


    return cleaned

}


// need to fetch indepth data of model
export async function getModelInfo(id: string) {

    let repo = "NexaAIDev/Octopus-v2"

    const chosen_response = await fetch(
        // `https://huggingface.co/api/datasets/${chosen_one}`,
        `https://huggingface.co/api/models/${repo}`,
        {
            method: "GET",
            headers: { "Authorization": `Bearer ${HF_TOKEN}` }
        }

    )

    const modelInfo = await chosen_response.json()

    let pipeline_tag = "";

    try {
        pipeline_tag = modelInfo.pipeline_tag;
        console.log(pipeline_tag);
    } catch (e) {
        //TODO: handle here
        console.log(e)
    }

    const io = getIo(pipeline_tag);

    const model: Model = {
        ...modelInfo,
        input: io['inputs'],
        output: io['outputs'],
    }

    return model

}


function getIo(tag: string) {
    //@ts-ignore
    let io = modelTypes[tag]
    // console.log(io)


    //NOTE: taking 
    if (!io) {
        throw new Error("un-supported")
    }
    return io;

}



export type Model = {
    id: string,
    author: string,
    input: ioInfo[],
    output: ioInfo[],
    pipeline_tag: string,
    downloads: string,
    likes: number,
    createdAt: string
}

export type ioInfo = {

    label: string,
    type: string,

}

