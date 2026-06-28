import {
    isAllowedGroup
} from "./auth.js";

import {
    runCommand
} from "./commands.js";

import {
    detectSkills
} from "./detector.js";

import {
    buildSkillPrompt
} from "./skills.js";

import {
    getMemory,
    saveMemory
} from "./memory.js";

import {
    buildMessages
} from "./prompt.js";

import {
    chat
} from "./ai.js";

import {
    reply,
    sendTyping
} from "./telegram.js";

const SYSTEM_PROMPT =
`You are Hermes.

Be accurate.

Answer in user's language.

Use provided skills only if relevant.`;

export default {

    async fetch(request, env) {

        if (request.method !== "POST") {
            return new Response("Hermes Online");
        }

        try {

            const update = await request.json();

            const message = update.message;

            if (!message?.text) {
                return new Response("OK");
            }

            if (!isAllowedGroup(message.chat.id)) {
                return new Response("OK");
            }

            // ---------- Commands ----------

            const commandReply = await runCommand(
                env,
                message
            );

            if (commandReply) {

                await reply(
                    env,
                    message,
                    commandReply
                );

                return new Response("OK");
            }

            // ---------- AI ----------

            await sendTyping(
                env,
                message.chat.id
            );

            const skills = detectSkills(
                message.text
            );

            const skillPrompt =
                buildSkillPrompt(skills);

            const history =
                await getMemory(
                    env,
                    message.from.id
                );

            const messages =
                buildMessages({

                    systemPrompt: SYSTEM_PROMPT,

                    skillPrompt,

                    history,

                    userMessage:
                        message.text

                });

            const answer =
                await chat(
                    env,
                    messages
                );

            await saveMemory(

                env,

                message.from.id,

                message.text,

                answer

            );

            await reply(
                env,
                message,
                answer
            );

        }

        catch (error) {

            console.error(error);

        }

        return new Response("OK");

    }

}