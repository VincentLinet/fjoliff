import * as Strings from "./strings.js";

const locate = (context) => {
  const path = context.join("/");
  return `../../data/${path}.js`;
};

export const build = async (context, name, character, injections) => {
  const path = locate(context);
  const { default: data } = await import(path);
  const { [name]: text } = data;
  return Strings.format(text, injections, character);
};
