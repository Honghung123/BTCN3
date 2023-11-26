const fs = require("fs/promises");
const arrSkip = ["settings", "_locals", "cache"];
const renderTemplate = async function (filePath, options, callback) {
  console.log("Custom template engine");
  const content = await fs.readFile(filePath, { encoding: "utf-8" });
  let rendered = content;

  for (const key in options) {
    if (options.hasOwnProperty(key) && arrSkip.indexOf(key) === -1) {
      const placeholder = `21461{\\s*${key}\\s*}`;
      rendered = rendered.replace(new RegExp(placeholder, "g"), options[key]);
    }
  }

  // Thêm hỗ trợ cho câu lệnh if-else
  const ifElseRegex =
    /21461{\s*if\s+(\w+)\s*}(.*?){\s*else\s*}(.*?){\s*\/if\s*}/gs;
  let match;
  while ((match = ifElseRegex.exec(rendered)) !== null) {
    const [fullMatch, condition, ifContent, elseContent] = match;
    const value = options[condition];

    // Thực hiện thay thế nội dung if hoặc else dựa trên điều kiện
    const replacement = value ? ifContent : elseContent || "";
    rendered = rendered.replace(fullMatch, replacement);
  }

  return callback(null, rendered);
};
module.exports = renderTemplate;
