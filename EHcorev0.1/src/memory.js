import {
    MAX_HISTORY,
    MEMORY_TTL
} from "./constants.js";

function getKey(userId) {
    return `mem_${userId}`;
}

/**
 * دریافت حافظه خام از KV
 */
async function readMemory(env, userId) {

    const raw = await env.MEMORY_DB.get(getKey(userId));

    if (!raw) {
        return [];
    }

    const now = Math.floor(Date.now() / 1000);

    return JSON.parse(raw).filter(
        item => now - item.t <= MEMORY_TTL
    );

}

/**
 * حافظه برای ارسال به مدل
 */
export async function getMemory(env, userId) {

    const memory = await readMemory(env, userId);

    return memory.map(item => ({
        role: item.r,
        content: item.c
    }));

}

/**
 * افزودن یک گفتگو
 */
export async function saveMemory(
    env,
    userId,
    userMessage,
    assistantMessage
) {

    const memory = await readMemory(env, userId);

    const now = Math.floor(Date.now() / 1000);

    memory.push({
        r: "user",
        c: userMessage,
        t: now
    });

    memory.push({
        r: "assistant",
        c: assistantMessage,
        t: now
    });

    while (memory.length > MAX_HISTORY) {
        memory.shift();
    }

    await env.MEMORY_DB.put(
        getKey(userId),
        JSON.stringify(memory)
    );

}

/**
 * حذف حافظه
 */
export async function clearMemory(env, userId) {

    await env.MEMORY_DB.delete(
        getKey(userId)
    );

}