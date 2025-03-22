// 토글 상태 변화에 따라 상태창 표시 및 텍스트 업데이트
document.getElementById("toggle").addEventListener("change", function () {
    const statusContainer = document.querySelector(".status-container");
    const toggleText = document.getElementById("toggle-text");
    if (this.checked) {
      statusContainer.style.display = "block";
    } else {
      statusContainer.style.display = "none";
    }
  });

  document.addEventListener("DOMContentLoaded", () => {
    const gameData = JSON.parse(localStorage.getItem("gameData"));
    if (!gameData || !gameData.stats) return;
    const dev = gameData.stats["개발능력"] ?? 0;
    const cs = gameData.stats["CS지식"] ?? 0;
    const cote = gameData.stats["코테실력"] ?? 0;
    const pt = gameData.stats["PT능력"] ?? 0;
    const lang = gameData.stats["외국어"] ?? 0;
    const health = gameData.stats["건강"] ?? 0;
    document.getElementById("dev-fill").style.width = dev + "%";
    document.getElementById("cs-fill").style.width = cs + "%";
    document.getElementById("cote-fill").style.width = cote + "%";
    document.getElementById("pt-fill").style.width = pt + "%";
    document.getElementById("lang-fill").style.width = lang + "%";
    document.getElementById("health-fill").style.width = health + "%";
  });