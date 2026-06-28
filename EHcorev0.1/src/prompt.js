/**
 * ساخت آرایه messages برای مدل
 */

export function buildMessages({
    systemPrompt,
    skillPrompt,
    history = [],
    userMessage
}) {

    const messages = [
        {
            role: "system",
            content: systemPrompt
        }
    ];

    if (skillPrompt) {
        messages.push({
            role: "system",
            content: skillPrompt
        });
    }

    messages.push(...history);

    messages.push({
        role: "user",
        content: userMessage
    });

    return messages;
}