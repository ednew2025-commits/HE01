import {
    OWNER_ID,
    ADMIN_IDS,
    TARGET_GROUP_ID
} from "./constants.js";

/**
 * آیا کاربر مالک است؟
 */
export function isOwner(userId) {
    return userId === OWNER_ID;
}

/**
 * آیا کاربر ادمین است؟
 */
export function isAdmin(userId) {
    return ADMIN_IDS.includes(userId);
}

/**
 * آیا کاربر دسترسی مدیریتی دارد؟
 */
export function isStaff(userId) {
    return isOwner(userId) || isAdmin(userId);
}

/**
 * آیا پیام از گروه مجاز آمده؟
 */
export function isAllowedGroup(chatId) {
    return chatId === TARGET_GROUP_ID;
}