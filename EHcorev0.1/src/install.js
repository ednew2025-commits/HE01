/**
 * Hermes Initial Installer
 * Runs only if skill_index doesn't exist.
 */

import {
    saveSkill,
    saveSkillIndex
} from "./skills.js";

const DEFAULT_SKILLS = [

    {
        name: "cloudflare",
        description: "Cloudflare Workers & KV",
        enabled: true,
        priority: 1,
        keywords: [
            "cloudflare",
            "worker",
            "workers",
            "kv",
            "r2",
            "d1",
            "cache"
        ],
        prompt:
`You are an expert Cloudflare Workers developer.
Prefer native Cloudflare APIs.
Write clean ES Modules.
Avoid unnecessary packages.`
    },

    {
        name: "telegram",
        description: "Telegram Bot API",
        enabled: true,
        priority: 2,
        keywords: [
            "telegram",
            "bot",
            "webhook",
            "chat",
            "inline"
        ],
        prompt:
`You are an expert Telegram Bot developer.
Use Bot API best practices.
Return production-ready JavaScript.`
    },

    {
        name: "coding",
        description: "Programming",
        enabled: true,
        priority: 5,
        keywords: [
            "javascript",
            "python",
            "java",
            "code",
            "programming"
        ],
        prompt:
`Write clean code.
Explain only when requested.
Prefer modern syntax.`
    }

];

export async function install(env) {

    const exists =
        await env.SKILLS_DB.get("skill_index");

    if (exists) {
        return;
    }

    const index = [];

    for (const skill of DEFAULT_SKILLS) {

        await saveSkill(env, skill);

        index.push({

            name: skill.name,

            keywords: skill.keywords,

            enabled: skill.enabled,

            priority: skill.priority

        });

    }

    await saveSkillIndex(env, index);

    console.log("Hermes Installed");

}