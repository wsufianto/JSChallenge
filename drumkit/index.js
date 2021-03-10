// solve the issue in safari browser where the audio played is
// lagging, no idea why though. found it in stack overflow forum
const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext();

// method to play certain key pressed
function playKey(event) {
    // get the audio tag & key tag from html by setting it
    // to key pressed using (`audio[data-key="${event.keyCode}"]`);
    const audio = document.querySelector(`audio[data-key="${event.keyCode}"]`);
    const key = document.querySelector(`.keybox[data-key="${event.keyCode}"]`);

    // if no such tag (null), exit the function
    if (!audio) return;

    // to rewind the audio playback to start (0) to enable keypressed in succession
    audio.currentTime = 0;

    // play the audio src associated with key pressed
    audio.play();
    key.classList.add('playing');
}

// remove the effect of key pressed after the transition time end
function removeTransition(ev) {
    if (ev.propertyName !== 'transform') return;
    this.classList.remove('playing'); // this refer to the event that triggered it
}

// add an event listener to the window for key pressed down and
// play corresponding audio called in the method
window.addEventListener('keydown', playKey);

// get all the keys element tag from the html
const keys = document.querySelectorAll('.keybox');

// iterate the keys to add event listener on each key
keys.forEach((key) => {
    // when transition ends, call removeTransition function to remove
    // the playing class from key to simulate keypressed effect.
    key.addEventListener('transitionend', removeTransition);
});
