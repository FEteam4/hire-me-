document.addEventListener("DOMContentLoaded", () => {
  // 로컬스토리지에서 데이터 가져오기
  const option1 = localStorage.getItem("option1");
  const option2 = localStorage.getItem("option2");

  // 하나만 존재하는 경우 찾기
  const selectedOption = option1 ? JSON.parse(option1) : option2 ? JSON.parse(option2) : null;

  if (!selectedOption) {
    console.error("선택된 데이터가 없습니다!");
    return;
  }

  console.log("불러온 데이터:", selectedOption);

  // 확률 계산 후 성공/실패 결과 얻기
  const result = determineSuccess(selectedOption.확률);

  // 결과를 페이지에 표시

  setTimeout(() => displayResult(selectedOption, result), 2000);
  
});
function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function updateStats(option) {
  const userDataRaw = localStorage.getItem("userData");
  const userData = JSON.parse(userDataRaw);
  const stats = userData.stats;

  const keysToUpdate = ["CS지식", "코테실력", "건강", "외국어", "개발능력", "PT능력"];

  keysToUpdate.forEach(key => {
    if (option[key] !== undefined) {
      stats[key] = clamp(stats[key] + option[key], 0, 100);

    }
  });

  userData.stats = stats;
  localStorage.setItem("userData", JSON.stringify(userData));
}
// 성공/실패 확률 계산
function determineSuccess(probability) {
  return Math.random() < probability ? "성공" : "실패";
}

// 결과를 화면에 출력하는 함수
function displayResult(data, result) {
  const resultDiv = document.getElementById("resultContainer");
  
  if (!resultDiv) {
    console.error("결과를 표시할 div가 없습니다!");
    return;
  }

  if (result === "성공") {
    updateStats(data);
    resultDiv.innerHTML = `
      <h2>🎉 성공! 🎉</h2>
      <p>${data.성공}</p>
    `;
  } else {
    resultDiv.innerHTML = `
      <h2>😞 실패... 😞</h2>
      <p>${data.실패}</p>
    `;
  }
}