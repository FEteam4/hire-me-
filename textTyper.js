class TextTyper {
    constructor(texts, nextPage, speed = 200) {
      this.texts = texts; // 표시할 텍스트 배열
      this.nextPage = nextPage; // 마지막에 이동할 페이지
      this.indexI = 0; // 현재 텍스트 인덱스
      this.text = this.texts[this.indexI]; // 현재 텍스트
      this.index = 0; // 글자 출력 인덱스
      this.speed = speed; // 출력 속도
      this.isTyping = false; // 타이핑 중 여부
    }
  
    showText() {
      if (this.index < this.text.length) {
        document.getElementById("text").innerHTML += this.text[this.index];
        this.index++;
        setTimeout(() => this.showText(), this.speed);
      } else {
        this.isTyping = false;
      }
    }
  
    showAllText() {
      document.getElementById("text").innerHTML = this.text;
      this.index = this.text.length;
      this.isTyping = false;
    }
  
    showNextChar() {
      if (this.indexI < this.texts.length - 1) {
        this.indexI++; // 다음 텍스트로 변경
        this.text = this.texts[this.indexI]; // 새로운 텍스트 업데이트
        this.index = 0; // 글자 출력 인덱스 초기화
        document.getElementById("text").innerHTML = ""; // 기존 텍스트 지우기
        this.showText(); // 새로운 텍스트 출력 시작
      } else {
        window.location.href = this.nextPage; // 마지막 텍스트 후 페이지 이동
      }
    }
  }
  