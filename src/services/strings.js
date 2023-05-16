// TMP Default Character
const CHARACTER = {
  gender: 0
};

const build = (acc, [title, value]) => acc.replace(`%${title}`, value);

export const genderize = (text, gender) => {
  if (!text || gender === undefined) return "";
  return text.replace(/é\.e/i, !gender ? "é" : "ée");
};

export const inject = (text, injections) => {
  if (!injections) return text;
  return Object.entries(injections).reduce(build, text);
};

export const format = (text, injections, character = CHARACTER) => {
  const { gender } = character;
  const fill = inject(text, injections);
  return genderize(fill, gender);
};
