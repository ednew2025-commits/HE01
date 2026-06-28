javascript
export function checkAccess({ env, chatId, userId }) {

    const TARGET_GROUP_ID = Number(env.TARGET_GROUP_ID);
    const ADMIN_ID = Number(env.ADMIN_ID);

    const allowedUsers =
        String(env.ALLOWED_USERS || "")
            .split(",")
            .map(id => Number(id.trim()))
            .filter(id => !Number.isNaN(id));

    // فقط گروه مشخص شده
    if (chatId !== TARGET_GROUP_ID) {
        return {
            allowed: false,
            reason: "INVALID_GROUP"
        };
    }

    // مالک
    if (userId === ADMIN_ID) {
        return {
            allowed: true,
            isAdmin: true
        };
    }

    // کاربران مجاز
    if (allowedUsers.includes(userId)) {
        return {
            allowed: true,
            isAdmin: false
        };
    }

    return {
        allowed: false,
        reason: "USER_NOT_ALLOWED"
    };
}

export function isAdmin(env, userId) {

    return Number(env.ADMIN_ID) === Number(userId);

}