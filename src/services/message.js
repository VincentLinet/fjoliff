/* PROPS
 ** Color:       HEX
 ** Title:       String
 ** Image:       String
 ** URL:         String
 ** Description: String
 ** Thumbnail:   String
 ** Footer       Object { String text, String icon_url }
 ** Author:      Object { String name, String icon_url, String url }
 ** Fields:      Array [ { String name, String value, Boolean inline } ]
 */

export const build = ({ components, ...props }) => {
  const embed = { ...props, timestamp: new Date().toISOString() };
  return { embeds: [embed], components };
};

export const space = { name: "\u200B", value: "\u200B" };
