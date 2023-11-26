const fs = require("fs/promises");

// Hàm hỗ trợ để lấy giá trị từ một đường dẫn biến
function getValueFromPath(object, path) {
  const parts = path.split(".");
  let value = object;
  for (const part of parts) {
    if (value.hasOwnProperty(part)) {
      value = value[part];
    } else {
      return "";
    }
  }
  return value;
}
function render(rendered, data) {
  // Thực hiện thay thế các biến trong template
  const variableRegex = /21461{\s*([\w.]+)\s*}/g;
  let match;
  while ((match = variableRegex.exec(rendered)) !== null) {
    const [fullMatch, variableName] = match;
    const value = getValueFromPath(data, variableName);
    if (value != "") {
      rendered = rendered.replace(fullMatch, value);
    }
  }
  return rendered;
}

const renderTemplate = async function (filePath, options, callback) {
  const content = await fs.readFile(filePath, { encoding: "utf-8" });
  let rendered = content;
  rendered = render(rendered, options);

  // Thêm hỗ trợ cho câu lệnh if-else
  const ifElseRegex =
    /21461{\s*if\s+(\w+)\s*}([\s\S]*?){\s*else\s*}([\s\S]*?){\s*\/if\s*}/gs;
  let match;
  while ((match = ifElseRegex.exec(rendered)) !== null) {
    const [fullMatch, condition, ifContent, elseContent] = match;
    const value = options[condition];
    // Thực hiện thay thế nội dung dựa trên điều kiện
    const replacement = value ? ifContent : elseContent || "";
    rendered = rendered.replace(fullMatch, replacement);
  }

  //Thêm hỗ trợ cho câu lệnh for
  const forRegex =
    /21461{for\s+(\w+)\s+in\s+(\w+)\s*}([\s\S]*?){\s*\/for\s*}/gs;
  while ((match = forRegex.exec(rendered)) !== null) {
    const [fullMatch, variable, array, content] = match;
    const items = options[array];

    if (Array.isArray(items)) {
      // Thực hiện vòng lặp và thay thế nội dung vòng lặp trong template
      const replacement = items
        .map((item, index) => {
          // Thay thế biến trong phần nội dung vòng lặp
          const object = { [variable]: item };
          const itemContent = render(content, object);
          return itemContent;
        })
        .join("");

      rendered = rendered.replace(fullMatch, replacement);
    } else {
      // Nếu không phải mảng, loại bỏ vòng lặp
      rendered = rendered.replace(fullMatch, "");
    }
  }

  return callback(null, rendered);
};
module.exports = renderTemplate;
