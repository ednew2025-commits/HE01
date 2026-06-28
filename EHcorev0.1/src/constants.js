// ===== API =====

export const API_BASE_URL = "https://router.bynara.id/v1";
export const MODEL = "mimo-2.5";


// ===== Memory =====

export const MAX_HISTORY = 20;
export const MEMORY_TTL = 600; // 10 Minutes


// ===== Telegram =====

export const OWNER_ID = 6346107345;

export const ADMIN_IDS = [
    111111111,
    222222222
];

export const TARGET_GROUP_ID = -1001234567890;


// ===== Commands =====

export const COMMANDS = {
    START: "/start",
    HELP: "/help",
    STATUS: "/status",
    WHOAMI: "/whoami",

    SKILLS: "/skills",
    SKILL: "/skill",

    ADDSKILL: "/addskill",
    EDITSKILL: "/editskill",
    REMOVESKILL: "/removeskill",
    RELOADSKILLS: "/reloadskills",

    REMEMBER: "/remember",
    FORGET: "/forget",

    MEMORYCLEAR: "/memoryclear",

    MUTE: "/mute",
    UNMUTE: "/unmute",

    BROADCAST: "/broadcast"
};