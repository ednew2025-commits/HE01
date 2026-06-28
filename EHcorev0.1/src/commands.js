import {
    COMMANDS,
    OWNER_ID,
    ADMIN_IDS,
    MODEL
} from "./constants.js";

import {
    getSkill,
    getSkillIndex,
    saveSkill,
    saveSkillIndex,
    removeSkill
} from "./skills.js";

import { clearMemory } from "./memory.js";

function isOwner(id) {
    return id === OWNER_ID;
}

function isAdmin(id) {
    return ADMIN_IDS.includes(id);
}

export async function runCommand(env, message) {

    const text = (message.text || "").trim();

    const args = text.split(/\s+/);

    const cmd = args.shift().toLowerCase();

    const userId = message.from.id;

    switch (cmd) {

        case COMMANDS.START:

            return "👋 Hermes Online";

        case COMMANDS.STATUS:

            return `
🤖 Hermes

Model : ${MODEL}

Status : Online
`.trim();

        case COMMANDS.WHOAMI:

            return `
ID : ${userId}

Role :
${isOwner(userId)
? "Owner"
: isAdmin(userId)
? "Admin"
: "User"}
`.trim();

        case COMMANDS.SKILLS: {

            const list = await getSkillIndex(env);

            if (!list.length)
                return "No Skills.";

            return list
                .map(s =>
                    `• ${s.name}`
                )
                .join("\n");

        }

        case COMMANDS.SKILL: {

            const name = args[0];

            if (!name)
                return "Usage:\n/skill <name>";

            const skill =
                await getSkill(env, name);

            if (!skill)
                return "Skill not found.";

            return `
📄 ${skill.name}

Enabled : ${skill.enabled}

Priority : ${skill.priority}

${skill.description}
`.trim();

        }

        case COMMANDS.MEMORYCLEAR:

            await clearMemory(env, userId);

            return "✅ Memory Cleared.";

        default:

            if (
                !isOwner(userId)
            ) {
                return null;
            }

    }

    // -------- OWNER --------

    switch (cmd) {

        case COMMANDS.ADDSKILL: {

            return `
Owner Command

/addskill

در نسخه بعدی
Wizard اضافه می‌شود.
`.trim();

        }

        case COMMANDS.REMOVESKILL: {

            const name = args[0];

            if (!name)
                return "Usage:\n/removeskill <name>";

            await removeSkill(
                env,
                name
            );

            const list =
                await getSkillIndex(env);

            await saveSkillIndex(
                env,
                list.filter(
                    s => s.name !== name
                )
            );

            return "✅ Skill Removed.";

        }

        default:

            return null;

    }

}