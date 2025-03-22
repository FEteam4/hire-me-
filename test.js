const fizzbuzz = [
  1,
  2,
  "Fizz",
  4,
  "Buzz",
  "Fizz",
  7,
  8,
  "Fizz",
  "Buzz",
  11,
  "Fizz",
  13,
  14,
  "FizzBuzz",
  16,
  17,
  "Fizz",
  19,
  "Buzz",
  "Fizz",
  22,
  23,
  "Fizz",
  "Buzz",
  26,
  "Fizz",
  28,
  29,
  "FizzBuzz",
  31,
  32,
  "Fizz",
  34,
  "Buzz",
  "Fizz",
  37,
  38,
  "Fizz",
  "Buzz",
  41,
  "Fizz",
  43,
  44,
  "FizzBuzz",
  46,
  47,
  "Fizz",
  49,
  "Buzz",
];

const quiz = [
  {
    problem: "아래 문자열을 출력하세요.",
    output: "Hello World!",
    required: { output: true, loop: false, condition: false },
  },
  {
    problem: "구구단 8단을 출력하세요.\n출력 예시는 아래와 같습니다.",
    output:
      "8 X 1 = 8\n8 X 2 = 16\n8 X 3 = 24\n8 X 4 = 32\n8 X 5 = 40\n8 X 6 = 48\n8 X 7 = 56\n8 X 8 = 64\n8 X 9 = 72",
    required: { output: true, loop: true, condition: false },
  },
  {
    problem: "아래 결과와 같이 출력하세요.",
    output:
      "*\n**\n***\n****\n*****\n******\n*******\n********\n*********\n**********",
    required: { output: true, loop: true, condition: false },
  },
  {
    problem: `[FizzBuzz] 1에서 100까지 수를 출력하세요. 단 3의 배수는 Fizz, 5의 배수는 Buzz, 15의 배수는 FizzBuzz를 출력하세요. 예시는 다음과 같습니다.\n\n1\n2\nFizz\n4\nBuzz\nFizz\n...`,
    output: `${fizzbuzz.join("\n")}`,
    required: { output: true, loop: true, condition: true },
  },
];

const panel = document.querySelector(".message");
let randomId = Math.floor(Math.random() * 100) % 3;
panel.innerText = `${quiz[randomId].problem}\n\n${quiz[randomId].output}`;

function grade(quizIndex, userOutput, blockUsage) {
  const q = quiz[quizIndex];
  const result = {
    correct: false,
    correctOutput: false,
    loopUsage: false,
    ifUsage: false,
    message: "",
  };

  result.correctOutput = userOutput.trim() === q.output.trim();

  console.log(`used : ${blockUsage}`);
  console.log(`expected : ${userOutput.trim()}, real : ${q.output.trim()}`);
  console.log(`result : ${result.correctOutput}}`);

  if (!result.correctOutput) {
    result.message += "출력이 일치하지 않습니다.\n";
  } else {
    result.message += "출력이 일치합니다.\n";
    result.correct = true;
  }

  if (result.correct && q.required.loop && !result.loopUsage) {
    result.message += "반복문을 반드시 사용해야 합니다.\n";
    result.correct = false;
  }

  if (result.correct && q.required.condition && !result.ifUsage) {
    result.message += "조건문을 반드시 사용해야 합니다.\n";
    result.correct = false;
  }

  if (result.correct) {
    result.message = "정답입니다!";
  }

  return result;
}

function collectUsedBlocks() {
  const blockTypes = new Set();

  Blockly.getMainWorkspace()
    .getAllBlocks(false)
    .forEach((block) => blockTypes.add(block.type));

  return Array.from(blockTypes);
}

const backdrop = document.querySelector(".modal-backdrop");
const closeButton = document.querySelector(".close-button");

function openModal(success) {
  const content = document.getElementById("modal-title");

  if (success) {
    content.innerText = "✅ 정답입니다!";
  } else {
    content.innerText = "❌ 오답입니다.";
  }

  backdrop.classList.add("show");
  document.querySelector(".blocklyWidgetDiv").style.display = "none";
}

function closeModal() {
  backdrop.classList.remove("show");
}

closeButton.addEventListener("click", () => {
  closeModal();
  location.href = "24_email_toggle3.html";
});

document.querySelector("#submit").addEventListener("mousedown", () => {
  const userOutput = document.querySelector("#codeOutput").innerText;

  const result = grade(0, userOutput, collectUsedBlocks());
  console.log(result.message);
  if (result.correct) {
    const userDataRaw = localStorage.getItem("userData");
    const userData = JSON.parse(userDataRaw);
    const stats = userData.stats;
    stats["코테실력"] += 5;
    stats["CS지식"] += 5;
    if (stats["코테실력"] > 100) {
      stats["코테실력"] = 100;
    }
    if (stats["CS지식"] > 100) {
      stats["CS지식"] = 100;
    }
    userData.stats = stats;
    localStorage.setItem("userData", JSON.stringify(userData));
  }
    setTimeout(() => openModal(result.correct), 1000);
});
