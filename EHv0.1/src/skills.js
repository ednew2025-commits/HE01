javascript
const PREFIX = "skill_";

/**
 * ساخت کلید KV
 */
function skillKey(name) {
  return `${PREFIX}${name.trim()}`;
}

/**
 * ذخیره یا بروزرسانی یک Skill
 */
export async function saveSkill(env, name, value) {
  if (!name || !value) {
    throw new Error("Skill name/value required.");
  }

  await env.SKILLS_DB.put(
    skillKey(name),
    value.trim()
  );

  return true;
}

/**
 * حذف Skill
 */
export async function removeSkill(env, name) {
  await env.SKILLS_DB.delete(
    skillKey(name)
  );
}

/**
 * گرفتن Skill
 */
export async function getSkill(env, name) {

  return await env.SKILLS_DB.get(
    skillKey(name)
  );

}

/**
 * لیست همه Skillها
 */
export async function listSkills(env) {

  const result =
    await env.SKILLS_DB.list({
      prefix: PREFIX
    });

  const skills = [];

  for (const item of result.keys) {

    const value =
      await env.SKILLS_DB.get(item.name);

    skills.push({
      name: item.name.replace(PREFIX, ""),
      value
    });

  }

  return skills;

}

/**
 * پاک کردن همه Skillها
 */
export async function clearSkills(env) {

  const list =
    await env.SKILLS_DB.list({
      prefix: PREFIX
    });

  for (const key of list.keys) {

    await env.SKILLS_DB.delete(
      key.name
    );

  }

}

/**
 * ساخت Context برای AI
 */
export async function getSkillsContext(env) {

  const skills =
    await listSkills(env);

  if (skills.length === 0) {
    return "No stored skills.";
  }

  let text = "";

  for (const skill of skills) {

    text +=
`- ${skill.name}: ${skill.value}

`;

  }

  return text.trim();

}

/**
 * خروجی JSON
 */
export async function exportSkills(env) {

  return JSON.stringify(
    await listSkills(env),
    null,
    2
  );

}

/**
 * وارد کردن JSON
 */
export async function importSkills(
  env,
  json
) {

  const skills = JSON.parse(json);

  for (const skill of skills) {

    await saveSkill(
      env,
      skill.name,
      skill.value
    );

  }

}