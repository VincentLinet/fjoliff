import * as Shop from "../shop.js";
import Data from "../../../../data/shops/botanist.js";

const COLOR = 0x0099ff;

export const build = (props) => {
  const { title, description } = Data;
  const template = { color: COLOR, title, description, ...props };
  return Shop.message(template);
};
