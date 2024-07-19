const GAME_TIME = 10;
let score = 0;
let time = GAME_TIME;
let isPlaying = false;
let timeInterval;
let words = [];
let checkInterval;

const wordInput = document.querySelector('.word-input');
const wordDisplay = document.querySelector('.word-display');
const scoreDisplay = document.querySelector('.score');
const timeDisplay = document.querySelector('.time');
const button = document.querySelector('.button');

init();

function init() {
  buttonChange('game loading..');
  getWords();
  wordInput.addEventListener('input', checkMatch);
}

//게임 실행
function run() {
  if (isPlaying) {
    return;
  }
  isPlaying = true;
  time = GAME_TIME;
  wordInput.focus();
  scoreDisplay.innerText = 0;
  //1초마다 실행
  timeInterval = setInterval(countDown, 1000);
  checkInterval = setInterval(checkStatus, 50);
  buttonChange('playing game !');
}

//게임실행중 체크
function checkStatus() {
  if (!isPlaying && time === 0) {
    buttonChange('game start');
    clearInterval(checkInterval);
  }
}

//단어불러오기
function getWords() {
  //random word API 사용 (herocu 참조 추정: 서버 자주 터질 수 있음)
  //https://random-word-api.herokuapp.com/word?number=100
  
  axios
    .get('https://random-word-form.herokuapp.com/random/noun/a?count=100')
    .then(function (response) {
      response.data.forEach((word) => {
        if (word.length < 10) {
          words.push(word);
        }
      });
      buttonChange('game start');
      console.log(words);
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    });
}

//단어 일치 체크
function checkMatch() {
  if (wordInput.value.toLowerCase() === wordDisplay.innerText.toLowerCase()) {
    wordInput.value = '';
    if (!isPlaying) {
      return;
    }
    score++;
    scoreDisplay.innerText = score;

    //단어 랜덤하게 나오게 하기
    const randomIndex = Math.floor(Math.random() * words.length);
    wordDisplay.innerText = words[randomIndex];
  }
}

//버튼 클릭시 시간이 흘러가도록
function countDown() {
  time > 0 ? time-- : (isPlaying = false);
  if (!isPlaying) {
    clearInterval(timeInterval);
  }
  timeDisplay.innerText = time;
}

function buttonChange(text) {
  button.innerText = text;
  text === 'game start'
    ? button.classList.remove('loading')
    : button.classList.add('loading');
}

//input에 단어를 기입 후 정답일 경우 time이 초기화됨
