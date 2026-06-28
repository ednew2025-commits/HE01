import { API_BASE_URL, MODEL } from "./constants.js";

/**
 * ارسال درخواست به ByNara Router
 * @param {Object} env
 * @param {Array} messages
 * @returns {Promise<string>}
 */
export async function chat(env, messages) {

    const response = await fetch(
        `${API_BASE_URL}/chat/completions`,
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${env.MY_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: MODEL,
                messages
            })
        }
    );

    if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
    }

    const data = await response.json();

    return data.choices?.[0]?.message?.content ??
        "❌ مدل پاسخی ارسال نکرد.";
}