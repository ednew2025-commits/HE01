javascript
import { checkAccess } from "./auth.js";
import { handleCommand } from "./commands.js";
import { askAI } from "./ai.js";
import { getSkillsContext } from "./skills.js";
import { sendMessage } from "./telegram.js";

export default {
  async fetch(request, env) {
    // Health Check
    if (request.method === "GET") {
      return new Response("Hermes Worker Online ✅", {
        status: 200,
        headers: {
          "Content-Type": "text/plain"
        }
      });
    }

    if (request.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405 });
    }

    try {
      const update = await request.json();

      if (!update.message) {
        return new Response("OK");
      }

      const message = update.message;

      const chatId = message.chat?.id;
      const userId = message.from?.id;
      const username = message.from?.username || "";
      const firstName = message.from?.first_name || "";
      const text = message.text || "";

      // Ignore non-text messages
      if (!text) {
        return new Response("OK");
      }

      // ===========================
      // ACCESS CONTROL
      // ===========================

      const access = checkAccess({
        env,
        chatId,
        userId
      });

      if (!access.allowed) {
        console.log(
          `[DENY] user=${userId} chat=${chatId}`
        );

        return new Response("OK");
      }

      console.log(
        `[MESSAGE] ${firstName} (${username}) : ${text}`
      );

      // ===========================
      // COMMANDS
      // ===========================

      if (text.startsWith("/")) {

        const result = await handleCommand({
          env,
          text,
          userId,
          chatId
        });

        if (result.handled) {

          await sendMessage(
            env,
            chatId,
            result.reply
          );

          return new Response("OK");
        }

      }

      // ===========================
      // LOAD SKILLS
      // ===========================

      const skillsContext =
        await getSkillsContext(env);

      // ===========================
      // SYSTEM PROMPT
      // ===========================

      const systemPrompt = `
You are Hermes.

You are an intelligent AI assistant.

Always answer in the user's language.

If one of the stored skills is useful,
use it naturally.

Stored Skills:

${skillsContext}
`;

      // ===========================
      // ASK AI
      // ===========================

      const aiReply = await askAI({
        env,
        systemPrompt,
        userPrompt: text
      });

      // ===========================
      // SEND
      // ===========================

      await sendMessage(
        env,
        chatId,
        aiReply
      );

      return new Response("OK");

    } catch (err) {

      console.error(err);

      return new Response("Internal Error", {
        status: 500
      });

    }
  }
}