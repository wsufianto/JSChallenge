// get the element from HTML
const timeLeft = document.querySelector('.display__time-left');
const endTime = document.querySelector('.display__end-time');
const buttons = document.querySelectorAll('[data-time]');
const formInput = document.customForm;
const cuckooAudio = document.querySelector('#cuckoo');
let countdown;

// function to display the time left
const displayTimeLeft = (seconds) => {
  const hour = Math.floor(seconds / 3600);
  const min = Math.floor((seconds % 3600) / 60);
  const sec = seconds % 60;
  const textDisplay = `${hour < 10 ? '0' : ''}${hour}:${min < 10 ? '0' : ''}${min}:${sec < 10 ? '0' : ''}${sec}`;
  timeLeft.textContent = textDisplay;
};

// function to display the end time
const displayEndTime = (timeStamp) => {
  const end = new Date(timeStamp);
  const endHour = end.getHours();
  const endMin = end.getMinutes();
  const endSec = end.getSeconds();
  const endTimeText = `Be Back At ${endHour < 10 ? '0' : ''}${endHour}:${endMin < 10 ? '0' : ''}${endMin}:${endSec < 10 ? '0' : ''}${endSec}`;
  endTime.textContent = endTimeText;
};

// function to calculate the end time
const timer = (seconds) => {
  // clear previous interval ran
  clearInterval(countdown);
  const currentTime = Date.now();
  const thenTime = currentTime + seconds * 1000;

  displayTimeLeft(seconds);
  displayEndTime(thenTime);

  // workaround for safari browser, setting the html tag to muted and autoplay
  cuckooAudio.muted = true;
  cuckooAudio.play();

  // set the countdown interval that update every second.
  countdown = setInterval(() => {
    const secondLeft = Math.round((thenTime - Date.now()) / 1000);

    displayTimeLeft(secondLeft);

    // if countdown reaches 0, play cuckoo sound and clear the interval
    if (secondLeft === 0) {
      cuckooAudio.muted = false;
      cuckooAudio.play();
      clearInterval(countdown);
    }
  }, 1000);
};

// function to countdown timer from selected buttons
const countTime = (e) => {
  timer(Number(e.target.dataset.time));
};

// function to countdown timer from manual time input
const countInputTime = (e) => {
  e.preventDefault();
  timer(Number(e.target.minutes.value) * 60);
  e.target.reset();
};

// buttons event listener
buttons.forEach((button) => {
  button.addEventListener('click', countTime);
});

// form manual input event listener
formInput.addEventListener('submit', countInputTime);
