fetch("../json/schoolClub.json")
  .then((response) => response.json())
  .then((data) => {
    const selectedData = getSelectedData(data);
    displaySelectedData(selectedData);
    saveToLocalStorage(selectedData); // 미리 로컬 스토리지에 저장
  })
  .catch((error) =>
    console.error("데이터를 불러오는 중 오류가 발생했습니다:", error)
  );

function getTwoRandomNumbers(min, max) {
  const numbers = [];
  while (numbers.length < 1) {
    const randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
    if (!numbers.includes(randomNum)) {
      numbers.push(randomNum);
    }
  }
  return numbers;
}

// 랜덤으로 선택된 번호에 해당하는 데이터 가져오기
function getSelectedData(data) {
  const selectedNumbers = getTwoRandomNumbers(1, 5);

  // data가 배열인지 확인하고 필터링
  if (Array.isArray(data)) {
    return data.filter((item) => selectedNumbers.includes(item.NO));
  } else {
    console.error("data가 배열이 아닙니다.", data);
    return [];
  }
}

// 선택된 데이터를 div에 표시하기
function displaySelectedData(selectedData) {
  // 첫 번째 선택지를 첫 번째 div에 표시
  const firstDiv = document.getElementById("option1");
  if (firstDiv && selectedData[0]) {
    firstDiv.innerHTML = `
        <h3>${selectedData[0].선지}</h3>
        <p>성공 확률: ${selectedData[0].확률 * 100}%</p>
`;
  }
  const secondDiv = document.getElementById("option2");
  if (secondDiv && selectedData[1]) {
    secondDiv.innerHTML = `
        <h3>${selectedData[1].선지}</h3>
        <p>성공 확률: ${selectedData[1].확률 * 100}%</p>
`;
  }
}
// 선택된 데이터를 미리 로컬 스토리지에 저장
function saveToLocalStorage(selectedData) {
  if (selectedData.length >= 2) {
    localStorage.setItem("option1", JSON.stringify(selectedData[0]));
    localStorage.setItem("option2", JSON.stringify(selectedData[1]));
  } else {
    console.error("저장할 데이터가 부족합니다!");
  }
}
// 다음 페이지로 이동
document
  .querySelector(".left_c")
  .addEventListener("click", () => goToNextPage_l());
document
  .querySelector(".right_c")
  .addEventListener("click", () => goToNextPage_r());

function goToNextPage_l() {
  localStorage.removeItem("option2");
  window.location.href = "./11_schoolClub_3.html"; // 다음 페이지로 이동
}
function goToNextPage_r() {
  localStorage.removeItem("option1");
  window.location.href = "./11_schoolClub_3.html"; // 다음 페이지로 이동
}
