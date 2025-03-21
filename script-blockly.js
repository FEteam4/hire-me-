// Start 블록 테마
const theme = Blockly.Theme.defineTheme("customTheme", {
  base: Blockly.Themes.Classic,
  blockStyles: {
    start_blocks: {
      colourPrimary: "#00aaff",
      colourSecondary: "#0088cc",
      hat: "cap",
    },
  },
});

// 사용자 정의 블록
const blocks = Blockly.common.createBlockDefinitionsFromJsonArray([
  {
    type: "start",
    message0: "Start",
    nextStatement: null,
    style: "start_blocks",
  },
  {
    type: "output",
    message0: "Print %1",
    args0: [
      {
        type: "input_value",
        name: "ARG",
      },
    ],
    nextStatement: null,
    previousStatement: null,
    colour: 285,
  },
]);

Blockly.common.defineBlocks(blocks);

// start text output controls_if controls_for controls_repeat_ext controls_whileUntil
// variables_get variables_set logic_compare math_number math_arithmetic
// 추가할 블록: if 변형, 논리 연산
const toolbox = {
  kind: "flyoutToolbox",
  contents: [
    {
      kind: "block",
      type: "text",
    },
    {
      kind: "block",
      type: "output",
    },
    {
      kind: "block",
      type: "controls_if",
    },
    {
      kind: "block",
      type: "controls_for",
    },
    {
      kind: "block",
      type: "controls_repeat_ext",
    },
    {
      kind: "block",
      type: "controls_whileUntil",
    },
    {
      kind: "block",
      type: "variables_get",
    },
    {
      kind: "block",
      type: "variables_set",
    },
    {
      kind: "block",
      type: "logic_compare",
    },
    {
      kind: "block",
      type: "math_number",
    },
    {
      kind: "block",
      type: "math_arithmetic",
    },
  ],
};

// JavaScript 코드 생성 함수
const functions = Object.create(null);

functions["start"] = () => 'console.log("start");';

functions["text"] = (block) => {
  const text = block.getFieldValue("TEXT") || "";
  return [`"${text}"`, Blockly.JavaScript.ORDER_ATOMIC];
};

functions["output"] = (block) => {
  const arg =
    Blockly.JavaScript.valueToCode(
      block,
      "ARG",
      Blockly.JavaScript.ORDER_ATOMIC
    ) || "''";
  return `console.log(${arg});\n`;
};

// 조건문
functions["controls_if"] = (block) => {
  if (block.alreadyGenerated) return "";
  block.alreadyGenerated = true;
  const condition =
    Blockly.JavaScript.valueToCode(
      block,
      "IF0",
      Blockly.JavaScript.ORDER_NONE
    ) || "false";
  const statements = Blockly.JavaScript.statementToCode(block, "DO0") || "";
  return `if (${condition}) {\n${statements}}`;
};

functions["controls_for"] = (block) => {
  if (block.alreadyGenerated) return "";
  block.alreadyGenerated = true;

  const variable = Blockly.JavaScript.nameDB_.getName(
    block.getFieldValue("VAR"),
    Blockly.VARIABLE_CATEGORY_NAME
  );
  const start =
    Blockly.JavaScript.valueToCode(block, "FROM", Blockly.JavaScript.ORDER_ASSIGNMENT) ||
    "0";
  const end =
  Blockly.JavaScript.valueToCode(block, "TO", Blockly.JavaScript.ORDER_ASSIGNMENT) ||
    "10";
  const increment =
  Blockly.JavaScript.valueToCode(block, "BY", Blockly.JavaScript.ORDER_ASSIGNMENT) ||
    "1";
  const statements = Blockly.JavaScript.statementToCode(block, "DO");

  return `for (let ${variable} = ${start}; ${variable} <= ${end}; ${variable} += ${increment}) {\n${statements}}\n`;
};

// 횟수 반복
functions["controls_repeat_ext"] = (block) => {
  if (block.alreadyGenerated) return "";
  block.alreadyGenerated = true;
  const times =
    Blockly.JavaScript.valueToCode(
      block,
      "TIMES",
      Blockly.JavaScript.ORDER_ATOMIC
    ) || "0";
  return `for (let i = 0; i < ${times}; i++) {\n  // 반복 실행 코드\n}\n`;
};

// 조건 반복
functions["controls_whileUntil"] = (block) => {
  if (block.alreadyGenerated) return "";
  block.alreadyGenerated = true;
  const condition =
    Blockly.JavaScript.valueToCode(
      block,
      "BOOL",
      Blockly.JavaScript.ORDER_NONE
    ) || "false";
  const isUntil = block.getFieldValue("MODE") === "UNTIL";
  const operator = isUntil ? "!" : "";
  const statements = Blockly.JavaScript.statementToCode(block, "DO") || "";
  return `while (${operator}${condition}) {\n${statements}}\n`;
};

// 비교 연산
functions["logic_compare"] = (block) => {
  const OPERATORS = {
    EQ: "==",
    NEQ: "!=",
    LT: "<",
    LTE: "<=",
    GT: ">",
    GTE: ">=",
  };
  const operator = OPERATORS[block.getFieldValue("OP")] || "==";
  const op1 =
    Blockly.JavaScript.valueToCode(
      block,
      "A",
      Blockly.JavaScript.ORDER_RELATIONAL
    ) || "0";
  const op2 =
    Blockly.JavaScript.valueToCode(
      block,
      "B",
      Blockly.JavaScript.ORDER_RELATIONAL
    ) || "0";
  return [`${op1} ${operator} ${op2}`, Blockly.JavaScript.ORDER_RELATIONAL];
};

// 변수 조회
functions["variables_get"] = (block) => {
  const variable = block.getFieldValue("VAR");

  // 저장된 변수가 없으면 기본값 반환
  if (!(variable in workspaceVariables)) {
    console.warn(`🚨 변수 '${variable}'가 아직 정의되지 않았습니다!`);
    return ["0", Blockly.JavaScript.ORDER_ATOMIC];
  }

  return [workspaceVariables[variable], Blockly.JavaScript.ORDER_ATOMIC];
  //   const variable = Blockly.JavaScript.nameDB_.getName(
  //     block.getField("VAR").getText(),
  //     Blockly.VARIABLE_CATEGORY_NAME
  //   );
  //   return [variable, Blockly.JavaScript.ORDER_ATOMIC];
};

// 변수 할당
const workspaceVariables = {};

functions["variables_set"] = (block) => {
  const variable = Blockly.JavaScript.nameDB_.getName(
    block.getField("VAR").getText(),
    Blockly.VARIABLE_CATEGORY_NAME
  );

  const value =
    Blockly.JavaScript.valueToCode(
      block,
      "VALUE",
      Blockly.JavaScript.ORDER_ASSIGNMENT
    ) || "0";

  workspaceVariables[variable] = value;

  return `${variable} = ${value};\n`;
};

functions["math_number"] = (block) => {
  const number = block.getFieldValue("NUM") || "0";
  return [number, Blockly.JavaScript.ORDER_ATOMIC];
};

// 대수 연산
functions["math_arithmetic"] = (block) => {
  const OPERATORS = {
    ADD: "+",
    MINUS: "-",
    MULTIPLY: "*",
    DIVIDE: "/",
    POWER: "**",
  };
  const operator = OPERATORS[block.getFieldValue("OP")] || "+";
  const op1 =
    Blockly.JavaScript.valueToCode(
      block,
      "A",
      Blockly.JavaScript.ORDER_ATOMIC
    ) || "0";
  const op2 =
    Blockly.JavaScript.valueToCode(
      block,
      "B",
      Blockly.JavaScript.ORDER_ATOMIC
    ) || "0";
  return [`${op1} ${operator} ${op2}`, Blockly.JavaScript.ORDER_ATOMIC];
};

var workspace = Blockly.inject("blocklyDiv", {
  toolbox: toolbox,
    scrollbars: false,
    horizontalLayout: false,
  toolboxPosition: "start",
  theme: theme,
  renderer: "zelos",
});

// 블록이 작업대 범위를 넘어가지 못하도록 조정
workspace.addChangeListener((event) => {
  if (event.type === Blockly.Events.BLOCK_DRAG) {
    let block = workspace.getBlockById(event.blockId);
    if (!block) return;

    let metrics = workspace.getMetrics();
    let blockXY = block.getRelativeToSurfaceXY();

    let minX = metrics.viewLeft;
    let minY = metrics.viewTop;
    let maxX = metrics.viewLeft + metrics.viewWidth - block.width;
    let maxY = metrics.viewTop + metrics.viewHeight - block.height;

    let newX = Math.max(minX, Math.min(blockXY.x, maxX));
    let newY = Math.max(minY, Math.min(blockXY.y, maxY));

    if (newX !== blockXY.x || newY !== blockXY.y) {
      block.moveBy(newX - blockXY.x, newY - blockXY.y);
    }
  }
});

// start 블록 생성 함수 정의 및 workspace 초기화
const createStartBlock = () => {
  let startBlock = workspace.newBlock("start");
  startBlock.initSvg();
  startBlock.render();
  startBlock.moveBy(50, 50);
  startBlock.setDeletable(false);
};

Blockly.JavaScript.init(workspace);
createStartBlock();

for (const key in functions) {
  Blockly.JavaScript[key] = functions[key];
}

// 코드 실행 - startBlock과 연결된 블록들만 실행
function runCode() {
  const workspace = Blockly.getMainWorkspace();
  let startBlock = workspace.getBlocksByType("start", false)[0];

  let code = "";
  let currentBlock = startBlock.getNextBlock();

  while (currentBlock) {
    let blockCode = Blockly.JavaScript.blockToCode(currentBlock);
    if (blockCode) {
      code += blockCode + "\n";
    }
    currentBlock = currentBlock.getNextBlock();
  }

  //   console.log("실행할 코드:\n", code);
  eval(code);
  document.getElementById("codeOutput").innerText += code;
}

document.getElementById("execute").addEventListener("click", () => {
  runCode();
});

// const testCases = [
//   ["10", "5"],
//   ["x", "5"],
//   ["10", "y"],
//   ["x", "y"],
//   ["10", '"Hello"'],
//   ["'Text'", "5"],
// ];

// testCases.forEach(([a, b]) => {
//   x = 10;
//   y = 15;
//   const code = `${a} > ${b}`;
//   console.log(code);
//   console.log(`🚀 Testing: ${code} ->`, eval(code));
// });
