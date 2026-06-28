/**
 * Telegram API
 */

export async function sendMessage(env, chatId, text, options = {}) {
    const response = await fetch(
        `https://api.telegram.org/bot${env.BOT_TOKEN}/sendMessage`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                chat_id: chatId,
                text,
                parse_mode: "Markdown",
                ...options
            })
        }
    );

    return response.json();
}

export async function sendTyping(env, chatId) {
    await fetch(
        `https://api.telegram.org/bot${env.BOT_TOKEN}/sendChatAction`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                chat_id: chatId,
                action: "typing"
            })
        }
    );
}

export async function deleteMessage(env, chatId, messageId) {
    await fetch(
        `https://api.telegram.org/bot${env.BOT_TOKEN}/deleteMessage`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                chat_id: chatId,
                message_id: messageId
            })
        }
    );
}

export async function reply(env, message, text, options = {}) {
    return sendMessage(
        env,
        message.chat.id,
        text,
        {
            reply_to_message_id: message.message_id,
            ...options
        }
    );
}