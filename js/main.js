const particles = [];
const particlesSpectrum = [];
const num = 800;

const noiseScale = 10;

let song, analyzer;
let r, g, b;
let fft;

let x, y, diffY;

const strWeight = 7;

function preload() {
  song = loadSound(
    'https://tommyedmunds.github.io/the-judge-visualizer/assets/thejudge.mp3'
  );
}

function setup() {
  createCanvas(displayWidth, displayHeight);

  song.loop();

  // create a new Amplitude analyzer
  analyzer = new p5.Amplitude();

  // Patch the input to an volume analyzer
  analyzer.setInput(song);

  fft = new p5.FFT();

  for (let i = 0; i < num; i++) {
    particles.push(createVector(random(width), random(height)));
    particlesSpectrum.push(createVector(random(width), random(height)));
  }

  button = createButton('play');
  button.mousePressed(togglePlaying);
  fft = new p5.FFT();
  song.amp(0.2);
  song.pause();
  //stroke(255);
}

function draw() {
  const randomNum = Math.round(random(1, width));

  const randColor1 = color(random(0, 255), random(0, 255), random(0, 255));
  const randColor2 = color(random(0, 255), random(0, 255), random(0, 255));

  // use this background call for thejudge.mp3
  // background(255);
  background(0);
  // background(0, 25);

  let waveform = fft.waveform();

  if (song.isPlaying()) {
    beginShape();
    for (i = 0; i < waveform.length / 2; i++) {
      x = map(i, 0, waveform.length, 0, displayWidth);
      y = map(waveform[i], -1, 1, 0, displayHeight);

      const vertexX = map(i, 0, waveform.length, 0, width);
      const vertexY = map(waveform[i], -1, 1, 0, height);

      diffY = map(waveform[i] * 2, -1, 1, 0, displayWidth);

      if (i < num) {
        let p = particles[i];
        let n = noise(x * noiseScale, y * noiseScale, x * noiseScale * noiseScale);
        let a = TAU * n;

        if (frameCount % 2 === 0 && y > 630) {
          const amplifiedX = x * 3;
          const amplifiedY = random(0, p.y) * 2;
          // for (let i = 1; i < height * 0.1; i++) {
          //   p.x = x;
          //   p.y += sin(a);

          //   const amplifiedX = x * 3;
          //   const amplifiedY = random(0, p.y) * 2;

          //   if (amplifiedX > 0 && amplifiedX < displayWidth) {
          //     // stroke(randColor1);
          //     // old viz
          //     // stroke(color(random(0, 255), random(0, 255), random(0, 255)));
          //     // strokeWeight(strWeight);
          //     // point(amplifiedX, amplifiedY);

          //     //
          //     //
          //     // new viz
          //     // const absDistance = Math.abs(displayWidth / 2 - y);

          //     // // take distance from center of screen and scale it
          //     // const scaledStroke = map(absDistance, 0, displayHeight / 2, 3, 10, true);
          //     // console.log(y, absDistance, displayHeight / 2, scaledStroke);
          //     // stroke(randColor1);
          //     // strokeWeight(scaledStroke);
          //     // // point(amplifiedX * 2, amplifiedY);
          //     // point(amplifiedY * 2, amplifiedX);
          //   }
          //   // point(random(0, width), y);
          // }
          vertex(
            randomNum % 2 === 0 ? amplifiedX : amplifiedY,
            randomNum % 2 === 0 ? amplifiedY : amplifiedX
          );
        } else {
          // old viz
          // stroke('white');
          // strokeWeight(4);
          // point(p.x, p.y);
          //
          //
          // new one
          //
          //
          // if (p.y > height || p.y < 0) p.y = 0;
          // p.x = x;
          // p.y += sin(a);
          // stroke(randColor2);
          // strokeWeight(strWeight);
          // // point(randomNum, p.y);
          // // point(randomNum, p.y);
          // point(diffY, x * 2);
          //
          // a more novel approach
          if (p.y > height || p.y < 0) p.y = 0;
          p.x = x;
          // p.y += sin(a);
          stroke(randColor2);
          strokeWeight(strWeight);
          // point(randomNum, p.y);
          // point(randomNum, p.y);
          // point(diffY, randomNum);
          vertex(diffY, randomNum);
        }

        if (song.isPlaying()) {
          p.x = map(x, 0, waveform.length, 0, width * 2);
          p.y = y;
        }
      }
    }
    endShape();
  }
}

function togglePlaying() {
  if (!song.isPlaying()) {
    song.play();
    song.setVolume(0.8);
    button.html('pause');
  } else {
    song.pause();
    button.html('play');
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
