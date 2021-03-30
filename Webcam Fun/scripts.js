// get the element from HTML
const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');
const snapButton = document.querySelector('#snapMe');
const defaultButton = document.querySelector('#normal');
const redButton = document.querySelector('#red');
const greenButton = document.querySelector('#green');
const transparentButton = document.querySelector('#transparent');

// get the video from the webcam with permission from user
const getVideo = () => {
  // this call returns a promise
  navigator.mediaDevices.getUserMedia({ video: true, audio: false })
    .then((localMediaStream) => {
      video.srcObject = new MediaStream(localMediaStream);
      video.play();
    })
    .catch((err) => {
      console.log('Error accessing video', err);
    });
};

// add some red filter effect
const redEffect = (pixels) => {
  for (let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i + 0] = pixels.data[i + 0] + 150; // red
    pixels.data[i + 1] = pixels.data[i + 1] - 50; // green
    pixels.data[i + 2] = pixels.data[i + 2] - 50; // blue
  }
  return pixels;
};

// add some green shadow effect
const rgbSplit = (pixels) => {
  for (let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i - 200] = pixels.data[i + 0]; // red
    pixels.data[i - 150] = pixels.data[i + 1]; // green
    pixels.data[i * 3] = pixels.data[i + 2]; // blue
  }
  return pixels;
};

// add some transparent effect
const greenScreen = (pixels) => {
  const levels = {};

  document.querySelectorAll('.rgb input').forEach((input) => {
    levels[input.name] = input.value;
  });

  for (let i = 0; i < pixels.data.length; i += 4) {
    const red = pixels.data[i + 0];
    const green = pixels.data[i + 1];
    const blue = pixels.data[i + 2];
    const alpha = pixels.data[i + 3];

    if (red >= levels.rmin
      && green >= levels.gmin
      && blue >= levels.bmin
      && red <= levels.rmax
      && green <= levels.gmax
      && blue <= levels.bmax) {
      // take it out!
      pixels.data[i + 3] = 0;
    }
  }

  return pixels;
};

// normal effect, no changes
const normal = (pixels) => pixels;

// function to draw the video on the canvas
const draw = (method, width, height) => {
  const drawID = setInterval(() => {
    ctx.drawImage(video, 0, 0, width, height);
    let pixels = ctx.getImageData(0, 0, width, height);
    pixels = method(pixels);
    ctx.putImageData(pixels, 0, 0);
  }, 10);
  return drawID;
};

let drawId = 0;

// put the video to the canvas with the video width and height setting
const paintToCanvas = (e) => {
  const height = video.videoHeight;
  const width = video.videoWidth;
  canvas.height = height;
  canvas.width = width;

  // if drawId is not 0, clear the previous interval & hide the rgb slider
  if (drawId !== 0) clearInterval(drawId);
  document.querySelector('.rgb').style.display = 'none';

  // draw on first video load & redraw on button click to add effects
  if (e.type === 'canplay') {
    drawId = draw(normal, width, height);
  } else {
    if (e.target.id === 'red') {
      drawId = draw(redEffect, width, height);
    } if (e.target.id === 'green') {
      drawId = draw(rgbSplit, width, height);
    } if (e.target.id === 'transparent') {
      document.querySelector('.rgb').style.display = 'block'; // show the rgb slider
      drawId = draw(greenScreen, width, height);
    } if (e.target.id === 'normal') {
      drawId = draw(normal, width, height);
    }
  }
};

// function to take the picture and show them in the strip
const takePhoto = () => {
  // play the shutter click sound
  snap.currentTime = 0;
  snap.play();

  // grab a snapshot of the video images and make it downloadable as "screenshot" name
  // then push it into the strip div
  const data = canvas.toDataURL('image/jpeg');
  const link = document.createElement('a');
  link.href = data;
  link.setAttribute('download', 'screenshot');
  link.innerHTML = `<img src=${data} />`;
  strip.insertBefore(link, strip.firstChild);
};

// run the getVideo function and add event listener to get the size (width & height)
// as well as event listener for buttons to add effects to video
getVideo();
video.addEventListener('canplay', paintToCanvas);
snapButton.addEventListener('click', takePhoto);
defaultButton.addEventListener('click', paintToCanvas);
redButton.addEventListener('click', paintToCanvas);
greenButton.addEventListener('click', paintToCanvas);
transparentButton.addEventListener('click', paintToCanvas);
