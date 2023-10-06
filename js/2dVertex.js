let particles = [];
const num = 400;

const noiseScale = 10;

let song, analyzer;
let r, g, b;
let mic, fft;

let x, y;

function preload() {
  song = loadSound('../assets/thejudge.mp3');
}

function setup() {
  createCanvas(displayWidth, displayHeight);
  // fullScreen();

  song.loop();

  // create a new Amplitude analyzer
  analyzer = new p5.Amplitude();

  // Patch the input to an volume analyzer
  analyzer.setInput(song);

  fft = new p5.FFT();
  fft.setInput(mic);

  for (let i = 0; i < num; i++) {
    particles.push(createVector(random(width), random(height)));
  }

  button = createButton('play');
  button.mousePressed(togglePlaying);
  fft = new p5.FFT();
  song.amp(0.2);

  stroke(255);
  // For a cool effect try uncommenting this line
  // And comment out the background() line in draw
  // stroke(255, 50);
  // clear();
}

function draw() {
  const randomNum = Math.round(random(1, 1000));
  const even = randomNum % 2 === 0;

  background(0, 25);
  var spectrum = fft.analyze();
  let waveform = fft.waveform();

  noFill();
  beginShape();
  for (i = 0; i < waveform.length; i++) {
    // var amp = waveform[i];
    //  x = map(i, 0, spectrum.length, 0, width);
    //  y =  map(spectrum[i], 0, 255, height, 0);
    x = map(i, 0, waveform.length, 0, width);
    if (i % 2 === 0) {
      y = map(waveform[i], -1, 1, 0, height);
    }

    if (i < num) {
      // for (let i = 0; i < num; i++) {
      let p = particles[i];
      // stroke(color(random(255), random(255), random(255)));
      let n = noise(x * noiseScale, y * noiseScale, x * noiseScale * noiseScale);
      let a = TAU * n;
      let gradientColor = lerpColor(color('white'), color('red'), p.x / width);

      if (randomNum < 600) {
        if (y > 550) {
          for (let i = 1; i < height * 0.03; i++) {
            p.x += cos(a);
            p.y += sin(a);
            stroke(color('white'));
            // stroke(color(random(0, 255), random(0, 255), random(0, 255)));
            strokeWeight(1);
            point(x * 3, random(0, p.y) * 2);
            // vertex(x * 3, random(0, p.y) * 2)
          }
          // stroke(gradientColor);
          // stroke(color(random(0, 255), random(0, 255), random(0, 255)));
          // strokeWeight(3);
          // point(p.x, p.y);
        } else {
          // stroke(gradientColor);
          // stroke(color(random(0, 255), random(0, 255), random(0, 255)));
          stroke(51, 255, 0);
          strokeWeight(1);
          // point(p.x, p.y);
          // stroke(51, 255, 0);
          vertex(p.x, p.y);
        }
      }

      if (song.isPlaying()) {
        p.x = map(x, 0, waveform.length, 0, width * 2);
        p.y = y;
      }
    }
  }
  endShape();
}

function onScreen(v) {
  return v.x >= 0 && v.x <= width && v.y >= 0 && v.y <= height;
}

function togglePlaying() {
  if (!song.isPlaying()) {
    song.play();
    song.setVolume(0.3);
    button.html('pause');
  } else {
    song.pause();
    button.html('play');
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
