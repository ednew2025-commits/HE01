/**
 * Hermes Skill Manager
 * Cloudflare KV Version
 */

const INDEX_KEY = "skill_index";

export async function getSkillIndex(env) {

    const raw = await env.SKILLS_DB.get(INDEX_KEY);

    if (!raw) return [];

    return JSON.parse(raw);

}

export async function saveSkillIndex(env, index) {

    await env.SKILLS_DB.put(
        INDEX_KEY,
        JSON.stringify(index)
    );

}

export async function getSkill(env, name) {

    const raw = await env.SKILLS_DB.get(
        `skill_${name}`
    );

    if (!raw) return null;

    return JSON.parse(raw);

}

export async function saveSkill(env, skill) {

    await env.SKILLS_DB.put(
        `skill_${skill.name}`,
        JSON.stringify(skill)
    );

}

export async function removeSkill(env, name) {

    await env.SKILLS_DB.delete(
        `skill_${name}`
    );

}

export async function buildSkillPrompt(env, names) {

    if (!names.length) return "";

    const prompts = [];

    for (const name of names) {

        const skill = await getSkill(env, name);

        if (
            skill &&
            skill.enabled !== false
        ) {

            prompts.push(skill.prompt);

        }

    }

    return prompts.join("\n\n");

}