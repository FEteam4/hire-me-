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
    type: "print",
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
  {
    type: "math_arithmetic",
    message0: "%1 %2 %3",
    args0: [
      {
        type: "input_value",
        name: "A",
      },
      {
        type: "field_dropdown",
        name: "OP",
        options: [
          ["+", "ADD"],
          ["-", "MINUS"],
          ["×", "MULTIPLY"],
          ["÷", "DIVIDE"],
          ["^", "POWER"],
          ["%", "MODULO"],
        ],
      },
      {
        type: "input_value",
        name: "B",
      },
    ],
    inputsInline: true,
    output: "Number",
    style: "math_blocks",
    helpUrl: "%{BKY_MATH_ARITHMETIC_HELPURL}",
    extensions: ["math_op_tooltip"],
  },
]);

Blockly.common.defineBlocks(blocks);

const toolbox = {
  kind: "flyoutToolbox",
  contents: [
    {
      kind: "block",
      type: "math_number",
    },
    {
      kind: "block",
      type: "text",
    },
    {
      kind: "block",
      type: "text_join",
    },
    {
      kind: "block",
      type: "math_arithmetic",
    },
    {
      kind: "block",
      type: "logic_compare",
    },
    {
      kind: "block",
      type: "logic_operation",
    },
    {
      kind: "block",
      type: "logic_negate",
    },
    {
      kind: "block",
      type: "controls_if",
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
      type: "print",
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
  ],
};

// JavaScript 코드 생성 함수

Blockly.JavaScript.forBlock["start"] = () => 'console.log("start");';

Blockly.JavaScript.forBlock["text"] = (block) => {
  if (block.alreadyGenerated) return ["", Blockly.JavaScript.ORDER_ATOMIC];
  block.alreadyGenerated = true;

  const text = block.getFieldValue("TEXT") || "";
  return [`"${text}"`, Blockly.JavaScript.ORDER_ATOMIC];
};

let outputText = "";

Blockly.JavaScript.forBlock["print"] = (block) => {
  const arg =
    Blockly.JavaScript.valueToCode(
      block,
      "ARG",
      Blockly.JavaScript.ORDER_ATOMIC
    ) || "''";
    return `document.getElementById('codeOutput').innerText += ${arg};\n`;
};

// 조건문
Blockly.JavaScript.forBlock["controls_if"] = (block) => {
  let n = 0;
  let code = "";
  do {
    const condition =
      Blockly.JavaScript.valueToCode(
        block,
        `IF${n}`,
        Blockly.JavaScript.ORDER_NONE
      ) || "false";
    const statements =
      Blockly.JavaScript.statementToCode(block, `DO${n}`) || "";
    code +=
      (n === 0 ? "if" : "else if") + ` (${condition}) {\n${statements}}\n`;
    n++;
  } while (block.getInput(`IF${n}`));

  if (block.getInput("ELSE")) {
    const elseBranch = Blockly.JavaScript.statementToCode(block, "ELSE");
    code += `else {\n${elseBranch}}\n`;
  }

  return code;
};

// for문
Blockly.JavaScript.forBlock["controls_for"] = (block) => {
  if (block.alreadyGenerated) return "";
  block.alreadyGenerated = true;

  const variable = Blockly.JavaScript.nameDB_.getName(
    block.getFieldValue("VAR"),
    Blockly.VARIABLE_CATEGORY_NAME
  );
  const start =
    Blockly.JavaScript.valueToCode(
      block,
      "FROM",
      Blockly.JavaScript.ORDER_ASSIGNMENT
    ) || "0";
  const end =
    Blockly.JavaScript.valueToCode(
      block,
      "TO",
      Blockly.JavaScript.ORDER_ASSIGNMENT
    ) || "10";
  const increment =
    Blockly.JavaScript.valueToCode(
      block,
      "BY",
      Blockly.JavaScript.ORDER_ASSIGNMENT
    ) || "1";
  const statements = Blockly.JavaScript.statementToCode(block, "DO");

  return `for (let ${variable} = ${start}; ${variable} <= ${end}; ${variable} += ${increment}) {\n${statements}}\n`;
};

// 횟수 반복
Blockly.JavaScript.forBlock["controls_repeat_ext"] = (block) => {
  if (block.alreadyGenerated) return "";
  block.alreadyGenerated = true;
  const times =
    Blockly.JavaScript.valueToCode(
      block,
      "TIMES",
      Blockly.JavaScript.ORDER_ATOMIC
    ) || "0";
  const statements = Blockly.JavaScript.statementToCode(block, "DO");
  const variable = Blockly.JavaScript.nameDB_.getDistinctName(
    "i",
    Blockly.VARIABLE_CATEGORY_NAME
  );
  const code = `for (let ${variable} = 0; ${variable} < ${times}; ${variable}++) {\n${statements}}\n`;
  return code;
};

// 조건 반복
Blockly.JavaScript.forBlock["controls_whileUntil"] = (block) => {
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
Blockly.JavaScript.forBlock["logic_compare"] = (block) => {
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

const workspaceVariables = {};
const declaredVariables = new Set();

// 변수 조회
Blockly.JavaScript.forBlock["variables_get"] = (block) => {
  const variable = Blockly.JavaScript.nameDB_.getName(
    block.getFieldValue("VAR"),
    Blockly.VARIABLE_CATEGORY_NAME
  );

  // 저장된 변수가 없으면 기본값 반환
  if (!(variable in workspaceVariables)) {
    console.warn(
      `변수 '${variable}'가 아직 정의되지 않았습니다. 0으로 초기화합니다.`
    );
  }

  return [variable, Blockly.JavaScript.ORDER_ATOMIC];
};

// 변수 할당
Blockly.JavaScript.forBlock["variables_set"] = (block) => {
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

// 수 값
Blockly.JavaScript.forBlock["math_number"] = (block) => {
  const number = block.getFieldValue("NUM") || "0";
  return [number, Blockly.JavaScript.ORDER_ATOMIC];
};

// 대수 연산
Blockly.JavaScript.forBlock["math_arithmetic"] = (block) => {
  const OPERATORS = {
    ADD: "+",
    MINUS: "-",
    MULTIPLY: "*",
    DIVIDE: "/",
    MODULO: "%",
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
  zoom: {
    startScale: 0.7,
  },
});

// 블록이 작업대 범위를 넘어가지 못하도록 조정
workspace.addChangeListener((event) => {
  if (event.type === Blockly.Events.BLOCK_CREATE) {
    setTimeout(() => {
      const newBlock = workspace.getBlockById(event.blockId);
      if (newBlock) {
        newBlock.render();
      }
    }, 10);
  }
  if (event.type === Blockly.Events.BLOCK_DRAG) {
    let block = workspace.getBlockById(event.blockId);
    if (!block) return;

    let metrics = workspace.getMetrics();
    let blockXY = block.getRelativeToSurfaceXY();

    let minX = metrics.viewLeft;
    let minY = metrics.viewTop;
    let maxX = 1.6 * (metrics.viewLeft + metrics.viewWidth - block.width);
    let maxY = 2 * (metrics.viewTop + metrics.viewHeight - block.height);

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

// 기존 코드 실행 이력을 reset
const resetGenerationFlags = () => {
  const blocks = workspace.getAllBlocks();
  blocks.forEach((block) => {
    if (block.alreadyGenerated) {
      delete block.alreadyGenerated;
    }
  });
};

// 코드 실행: startBlock과 연결된 블록들만 실행
function runCode() {
  resetGenerationFlags(); // 실행 누를 때마다 새로 코드를 생성하여 실행.
  const outputBox = document.querySelector("#codeOutput");
  const workspace = Blockly.getMainWorkspace();

  outputBox.innerText = "";
  console.log(outputBox);

  let code = "";
  let currentBlock = workspace.getBlocksByType("start", false)[0];

  while (currentBlock) {
    try {
      let blockCode = Blockly.JavaScript.blockToCode(currentBlock);
      if (blockCode) {
        code += blockCode + "\n";
      }
      currentBlock = currentBlock.getNextBlock();
    } catch (e) {
      outputBox.innerText += `${e.name}: ${e.message}\n`;
      console.error("블록 처리 중 오류:", e);
      return;
    }
  }

  try {
    console.log(code);
    eval(code);
  } catch (e) {
    outputBox.innerText += `${e.name}: ${e.message}\n`;
    console.error("Runtime Error:", e);
  }
}

document.getElementById("execute").addEventListener("click", () => {
  runCode();
});
