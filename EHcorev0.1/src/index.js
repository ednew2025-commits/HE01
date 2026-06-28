import { isAllowed } from "./auth.js";

import { runCommand } from "./commands.js";

import { detectSkills } from "./detector.js";

import { buildSkillPrompt } from "./skills.js";

import { getMemory, saveMemory } from "./memory.js";

import { buildMessages } from "./prompt.js";

import { chat } from "./ai.js";

import { reply, sendTyping } from "./telegram.js";

import { install } from "./install.js";

const SYSTEM_PROMPT = `
You are Hermes.

Be accurate.

Be concise.

Always answer in the user's language.
`;

export default {

    async fetch(request, env) {

        if (request.method !== "POST") {
            return new Response("Hermes Online");
        }

        try {

            await install(env);

            const update = await request.json();

            if (!update.message?.text) {
                return new Response("OK");
            }

            const message = update.message;

            if (!isAllowed(message)) {
                return new Response("OK");
            }

            // ---------- Commands ----------

            const commandReply =
                await runCommand(env, message);

            if (commandReply) {

                await reply(
                    env,
                    message.chat.id,
                    commandReply
                );

                return new Response("OK");

            }

            // ---------- AI ----------

            await sendTyping(
                env,
                message.chat.id
            );

            const skills =
                await detectSkills(
                    env,
                    message.text
                );

            const skillPrompt =
                await buildSkillPrompt(
                    env,
                    skills
                );

            const history =
                await getMemory(
                    env,
                    message.chat.id,
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

                message.chat.id,

                message.from.id,

                message.text,

                answer

            );

            await reply(

                env,

                message.chat.id,

                answer

            );

        }

        catch (err) {

            console.error(err);

        }

        return new Response("OK");

    }

};