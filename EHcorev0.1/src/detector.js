/**
 * Hermes Skill Detector
 * Cloudflare KV + In-Memory Cache
 */

import { getSkillIndex } from "./skills.js";

let cache = null;
let cacheTime = 0;

const CACHE_TTL = 60; // seconds

async function loadIndex(env) {

    const now = Math.floor(Date.now() / 1000);

    if (cache && (now - cacheTime) < CACHE_TTL) {
        return cache;
    }

    cache = await getSkillIndex(env);

    cacheTime = now;

    return cache;
}

export async function detectSkills(env, text) {

    if (!text) return [];

    const index = await loadIndex(env);

    const message = text.toLowerCase();

    const detected = [];

    for (const skill of index) {

        if (skill.enabled === false) continue;

        if (
            skill.keywords.some(keyword =>
                message.includes(keyword.toLowerCase())
            )
        ) {
            detected.push({
                name: skill.name,
                priority: skill.priority ?? 100
            });
        }

    }

    detected.sort(
        (a, b) => a.priority - b.priority
    );

    return detected.map(s => s.name);

}