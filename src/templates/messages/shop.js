import * as Message from "../../services/message.js";

const COLOR = 0x0099ff;

const content = (fields) => [Message.space, ...fields, Message.space];

export const message = ({ fields, ...props }) => {
  const template = {
    color: COLOR,
    fields: content(fields) /*: fields.map((field) => ({ ...field, inline: true }))*/,
    ...props
  };
  return Message.build(template);
};
