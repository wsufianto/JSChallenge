// Get the video elements
const player = document.querySelector('.player');
const video = player.querySelector('.viewer');
const progress = player.querySelector('.progress');
const progressBar = player.querySelector('.progress__filled');
const toggle = player.querySelector('.toggle');
const skipButtons = player.querySelectorAll('[data-skip]');
const ranges = player.querySelectorAll('.player__slider');
const fScreen = player.querySelector('.btn-fullscreen');

// Create the functions
// function to play and pause the video
const togglePlay = () => {
    video.paused ? video.play() : video.pause();
};

// function to update the play / pause button
const updateButton = (e) => {
    toggle.textContent = e.target.paused ? '►' : '❚ ❚';
};

// function to skip the video back 10s or forward 25s
const skip = (e) => {
    video.currentTime += parseFloat(e.target.dataset.skip);
};

// function to update the volume and playback rate of the video
const rangeUpdate = (e) => {
    video[e.target.name] = e.target.value;
};

// function to set the progress bar to the video time
const handleProgressBar = () => {
    const percent = (video.currentTime / video.duration) * 100;
    progressBar.style.flexBasis = `${percent}%`;
};

// function to scrub/slide the progress bar to forward / rewind the video
const scrub = (e) => {
    const scrubTime = (e.offsetX / progress.offsetWidth) * video.duration;
    video.currentTime = scrubTime;
};

// Hook up the elements
// event listener for the video & button to play and pause on click
video.addEventListener('click', togglePlay);
toggle.addEventListener('click', togglePlay);

// event listener to change the button logo to pause or play
video.addEventListener('play', updateButton);
video.addEventListener('pause', updateButton);

// event listener for the skip 10s & 25s
skipButtons.forEach((skipButton) => {
    skipButton.addEventListener('click', skip);
});

// event listener for the volume & playback rate change
ranges.forEach((range) => {
    range.addEventListener('change', rangeUpdate);
    range.addEventListener('mousemove', rangeUpdate);
});

// function to toggle fullscreen on and off for Chrome & Safari
const openFullscreen = () => {
    if (document.webkitIsFullScreen) {
        document.webkitExitFullscreen();
    } else {
        player.webkitRequestFullscreen();
    }
};

// event listener to update the current progress bar
video.addEventListener('timeupdate', handleProgressBar);

// event listener to scrub the progress bar to forward/rewind the movie on click
let scrubState = false;
progress.addEventListener('click', scrub);
progress.addEventListener('mousemove', (e) => scrubState && scrub(e));
progress.addEventListener('mousedown', () => scrubState = true);
progress.addEventListener('mouseup', () => scrubState = false);

// event listener for toggling full screen mode
fScreen.addEventListener('click', openFullscreen);
