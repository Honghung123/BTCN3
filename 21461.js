const fs = require("fs/promises");
const math = require("mathjs");
// Hàm hỗ trợ để lấy giá trị từ một đường dẫn biến
function getValueFromPath(object, path) {
  const parts = path.split(".");
  let value = object;
  for (const part of parts) {
    if (value.hasOwnProperty(part)) {
      value = value[part];
    } else {
      return null;
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
    if (value != null && value != undefined) {
      rendered = rendered.replace(fullMatch, value);
    }
  }
  return rendered;
}

// Hàm đánh giá biểu thức tính toán
function evaluateExpression(rendered, options) {
  let matchList = [];
  let matchValue = [];
  const expRegex = /21461{(\s*([\w.]+)\s*([+\-*\/%]\s*([\w.]+)\s*)+)}/g;
  while ((match = expRegex.exec(rendered)) !== null) {
    let [fullMatch, expression] = match;
    const operands = expression.split(/\s+/);
    for (let op of operands) {
      if (!op.match(/[+\-*\/%\d]/)) {
        const value = getValueFromPath(options, op);
        expression = expression.replace(op, value);
      }
    }
    try {
      // Sử dụng thư viện math.js để đánh giá biểu thức
      matchList.push(fullMatch);
      matchValue.push(math.evaluate(expression));
    } catch (error) {
      console.error("Error evaluating expression:", error);
    }
  }
  for (let i = 0; i < matchList.length; i++) {
    rendered = rendered.replace(matchList[i], matchValue[i]);
  }
  return rendered;
}
function compareExpressions(rendered, options) {
  let cmpRegex =
    /21461{(\s*if\s+(\d+)\s*(==|!=|===|>=|>|<=|<)\s*(\d+)\s*)}([\s\S]*?){\s*\/if\s*}/gs;
  while ((match = cmpRegex.exec(rendered)) !== null) {
    const [fullMatch, ifstatement, first, op, second, content] = match;
    if (fullMatch.match(/{\s*else\s*}/) != null) continue;
    let condition = ifstatement.replace("if", "").trim();
    const value = eval(condition);
    // Thực hiện thay thế nội dung dựa trên điều kiện
    const replacement = value ? content : "";
    rendered = rendered.replace(fullMatch, replacement);
  }

  cmpRegex =
    /21461{(\s*if\s+(\d+)\s*(==|!=|===|>=|>|<=|<)\s*(\d+)\s*)}([\s\S]*?){\s*else\s*}([\s\S]*?){\s*\/if\s*}/gs;
  while ((match = cmpRegex.exec(rendered)) !== null) {
    const [fullMatch, ifstatement, first, op, second, ifContent, elseContent] =
      match;
    let condition = ifstatement.replace("if", "").trim();
    const value = eval(condition);
    // Thực hiện thay thế nội dung dựa trên điều kiện
    const replacement = value ? ifContent : elseContent;
    rendered = rendered.replace(fullMatch, replacement);
  }
  return rendered;
}

// Hàm đệ quy để xử lý các phần template nhỏ
async function renderPartials(rendered, options) {
  console.log(options);
  // Thêm hỗ trợ cho các phần template nhỏ
  const partialRegex = /21461{\+\s*([\w.]+)\s*}/g;
  let match;
  while ((match = partialRegex.exec(rendered)) !== null) {
    const [fullMatch, partialName] = match;
    // Đọc nội dung của file partial
    const partialContent = await fs.readFile(`./views/${partialName}.html`, {
      encoding: "utf-8",
    });
    // Đệ quy để xử lý các phần template nhỏ bên trong
    const replacedPartialContent = await renderPartials(partialContent);
    // Thay thế phần template nhỏ trong template chính
    rendered = rendered.replace(fullMatch, replacedPartialContent);
    rendered = renderFor(rendered, options);
    rendered = renderForAlongWithIndex(rendered, options);
    rendered = renderNestedFor(rendered, options);
  }
  return rendered;
}

function renderFor(rendered, options) {
  const forRegex =
    /21461{for\s+(\w+)\s+in\s+([\w.]+)\s*}([\s\S]*?){\s*\/for\s*}/g;
  let forNested = [];
  while ((match = forRegex.exec(rendered)) !== null) {
    const [fullMatch, variable, array, content] = match;
    let items = [];
    array.split(".").forEach((prop, idx) => {
      if (idx == 0) {
        items = options[[prop]];
      } else {
        let value = items[[prop]];
        items = value;
      }
    });
    if (Array.isArray(items)) {
      // Thực hiện vòng lặp và thay thế nội dung vòng lặp trong template
      const replacement = items
        .map((item) => {
          // Thay thế biến trong phần nội dung vòng lặp
          const object = { [variable]: item };
          // console.log(content);
          const itemContent = render(content, object);
          return itemContent;
        })
        .join("");
      rendered = rendered.replace(fullMatch, replacement);
    } else {
      // Nếu không phải mảng, loại bỏ vòng lặp
      forNested.push(fullMatch);
      rendered = rendered.replace(fullMatch, `NESTED LOOP${forNested.length}`);
    }
  }
  // Restore
  for (let idx = 0; idx < forNested.length; idx++) {
    rendered = rendered.replace(`NESTED LOOP${idx + 1}`, forNested[idx]);
  }
  return rendered;
}

function renderForAlongWithIndex(rendered, options) {
  const forRegex =
    /21461{for\s+(\w+)\s*,\s*(\w+)\s+in\s+([\w.]+)\s*}([\s\S]*?){\s*\/for\s*}/;
  while ((match = forRegex.exec(rendered)) !== null) {
    const [fullMatch, varName, varIndex, array, content] = match;
    if (
      fullMatch.match(
        /21461{for\s+(\w+)\s*,\s*(\w+)\s+in\s+([\w.]+)\s*}([\s\S]*?)\s*21461{for\s+(\w+)\s+in\s+(\w+)\s*}([\s\S]*?){\s*\/for\s*}/
      ) != null
    ) {
      break;
    }
    // console.log(fullMatch);
    let items = [];
    array.split(".").forEach((prop, idx) => {
      if (idx == 0) {
        items = options[[prop]];
      } else {
        let value = items[prop];
        items = value;
      }
    });
    let startIdx = 0;
    if (Array.isArray(items)) {
      // Thực hiện vòng lặp và thay thế nội dung vòng lặp trong template
      const replacement = items
        .map((item) => {
          // Thay thế biến trong phần nội dung vòng lặp
          const object = { [varName]: item, [varIndex]: startIdx };
          // console.log(content);
          const itemContent = render(content, object);
          startIdx++;
          return itemContent;
        })
        .join("");
      rendered = rendered.replace(fullMatch, replacement);
    } else {
      // Nếu không phải mảng, loại bỏ vòng lặp
      rendered = rendered.replace(fullMatch, "");
    }
  }
  return rendered;
}

function renderForIndex(rendered, options) {
  const forRegex =
    /21461{for\s+(\w+)\s+from\s+(\w+)\s+to\s+([\w.]+)\s*}([\s\S]*?){\s*\/for\s*}/;
  while ((match = forRegex.exec(rendered)) !== null) {
    const [fullMatch, variable, start, end, content] = match;
    // Thực hiện vòng lặp và thay thế nội dung vòng lặp trong template
    let startInt = 0;
    let endInt = 0;
    if (!start.match(/\s*\d+\s*/)) {
      startInt = getValueFromPath(options, start);
    } else {
      startInt = parseInt(start);
    }
    if (!end.match(/\s*\d\s*/)) {
      endInt = getValueFromPath(options, end);
    } else {
      endInt = parseInt(end);
    }
    let replacement = "";
    for (let idx = startInt; idx < endInt; idx++) {
      // replacement += render(content, { [variable]: idx });
      let cons = render(content, { [variable]: idx });
      cons = compareExpressions(cons, { [variable]: idx });
      // console.log(cons);
      replacement += cons;
    }
    rendered = rendered.replace(fullMatch, replacement);
  }
  return rendered;
}

function renderNestedFor(rendered, options) {
  // console.log(rendered);
  // Thêm hỗ trợ cho vòng lặp lồng nhau
  const nestedForRegex =
    /21461{for\s+(\w+)\s*,\s*(\w+)\s+in\s+([\w.]+)\s*}([\s\S]*?)\s*21461{for\s+(\w+)\s+in\s+(\w+)\s*}([\s\S]*?){\s*\/for\s*}([\s\S]*?){\s*\/for\s*}/;
  let match;
  while ((match = nestedForRegex.exec(rendered)) !== null) {
    const [
      fullMatch,
      outerVar,
      outerIdx,
      outerArrName,
      outerContent,
      innerVar,
      innerArrName,
      innerInnerVar,
      innerContent,
    ] = match;
    const outerArrays = getValueFromPath(options, outerArrName);
    console.log(outerIdx);
    if (Array.isArray(outerArrays)) {
      // Thực hiện vòng lặp ngoại và thay thế nội dung vòng lặp trong template
      const outerReplacement = outerArrays
        .map((outerArr, index) => {
          // console.log(outerArr);
          const innerArr = outerArr;
          if (Array.isArray(innerArr)) {
            // Thực hiện vòng lặp nội và thay thế nội dung vòng lặp trong template
            const innerReplacement = innerArr
              .map((innerItem) => {
                const object = { [innerVar]: innerItem };
                const itemContent = render(innerInnerVar, object);
                // console.log(itemContent);
                return itemContent;
              })
              .join("");
            let finalContent = outerContent + innerReplacement + innerContent;
            finalContent = render(finalContent, { [outerIdx]: index });
            finalContent = compareExpressions(finalContent, {
              [outerIdx]: index,
            });
            return finalContent;
          }
          return "";
        })
        .join("");

      // Thay thế vòng lặp lồng nhau trong template
      rendered = rendered.replace(fullMatch, outerReplacement);
    } else {
      // Nếu không phải mảng, loại bỏ vòng lặp
      rendered = rendered.replace(fullMatch, "");
    }
  }
  return rendered;
}

function renderIf(rendered, options) {
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
  return rendered;
}

const renderTemplate = async function (filePath, options, callback) {
  const content = await fs.readFile(filePath, { encoding: "utf-8" });
  let rendered = content;
  rendered = await renderPartials(rendered, options);
  rendered = render(rendered, options);
  // console.log(rendered);
  rendered = evaluateExpression(rendered, options);

  // Thêm hỗ trợ cho câu lệnh if-else
  rendered = renderIf(rendered, options);

  // Thêm hỗ trợ cho vòng lặp lồng nhau
  // rendered = renderFor(rendered, options);
  // rendered = renderForAlongWithIndex(rendered, options);
  // rendered = renderNestedFor(rendered, options);

  //Thêm hỗ trợ cho câu lệnh for
  // console.log(rendered);
  rendered = renderForIndex(rendered, options);
  // console.log(rendered);

  // If lồng trong if else
  const ifRegex = /21461{\s*if\s+(\w+)\s*}([\s\S]*?){\s*\/if\s*}/gs;
  while ((match = ifRegex.exec(rendered)) !== null) {
    const [fullMatch, condition, ifContent, elseContent] = match;
    const value = options[condition];
    // Thực hiện thay thế nội dung dựa trên điều kiện
    const replacement = value ? ifContent : elseContent || "";
    rendered = rendered.replace(fullMatch, replacement);
  }
  rendered = compareExpressions(rendered, options);

  // Phân chia template

  return callback(null, rendered);
};
module.exports = renderTemplate;
