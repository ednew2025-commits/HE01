javascript
const TELEGRAM_API = "https://api.telegram.org";

export async function sendMessage(
    env,
    chatId,
    text,
    extra = {}
) {

    const response = await fetch(
        `${TELEGRAM_API}/bot${env.BOT_TOKEN}/sendMessage`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                chat_id: chatId,
                text,
                parse_mode: "HTML",
                disable_web_page_preview: true,
                ...extra
            })
        }
    );

    if (!response.ok) {

        console.error(
            await response.text()
        );

    }

}