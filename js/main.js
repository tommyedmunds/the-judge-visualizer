let song, analyzer;
let r, g, b;
let fft;

let prevYspec = 0;

let xSpec, ySpec;

function preload() {
  song = loadSound(
    'https://tommyedmunds.github.io/the-judge-visualizer/assets/thejudge.mp3'
  );
}

let cells = [];
const history = [];

let ruleSet;
let w = 10;

// a selection of rules
let ruleCollection = [
  13, 18, 22, 25, 24, 45, 60, 73, 75, 77, 82, 86, 89, 90, 100, 99, 102, 101, 110, 105,
  118, 124, 126, 129, 135, 137, 146, 150, 149, 153, 169, 182, 193, 210, 225, 236, 252,
  254, 244, 241, 225, 217, 216, 215, 2, 3, 5, 88, 90, 12, 123, 49, 44, 48,
];

let startRule = 68;

function setRules(ruleValue) {
  ruleSet = ruleValue.toString(2);
  while (ruleSet.length < 8) {
    ruleSet = '0' + ruleSet;
  }
}

function setup() {
  createCanvas(displayWidth, displayHeight);

  song.loop();

  // create a new Amplitude analyzer
  analyzer = new p5.Amplitude();

  // Patch the input to an volume analyzer
  analyzer.setInput(song);

  fft = new p5.FFT();

  button = createButton('play');
  button.mousePressed(togglePlaying);
  song.amp(0.2);
  song.pause();

  setRules(startRule);

  let total = width / w;
  for (let i = 0; i < total; i++) {
    cells[i] = 0;
  }
  cells[floor(total / 2)] = 1;
}

function draw() {
  const spectrum = fft.analyze();

  if (song.isPlaying()) {
    background(255);

    // for (let i = 0; i < spectrum.length; i++) {
    //   xSpec = map(i, 0, spectrum.length, 0, width);
    // }
    ySpec = spectrum.reduce(function (avg, value, _, { length }) {
      return avg + value / length;
    }, 0);

    history.push(cells);

    if (Math.abs(prevYspec - ySpec) > 8) {
      let nextRule = random(ruleCollection);
      // console.log(nextRule);
      setRules(nextRule);
      cells[floor(cells.length / 2)] = 1;

      prevYspec = ySpec;
    }

    let cols = height / w;
    if (history.length > cols + 1) {
      history.splice(0, 1);
    }

    let y = 0;
    background(255);
    for (let cells of history) {
      for (let i = 0; i < cells.length; i++) {
        let x = i * w;
        if (cells[i] == 1) {
          // strokeWeight(1);
          fill(0);
          square(x, y - w, w);
        }
      }
      y += w;
    }

    let nextCells = [];
    let len = cells.length;
    for (let i = 0; i < cells.length; i++) {
      let left = cells[(i - 1 + len) % len];
      let right = cells[(i + 1) % len];
      let state = cells[i];
      nextCells[i] = calculateState(left, state, right);
    }
    cells = nextCells;
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

function calculateState(a, b, c) {
  let neighborhood = '' + a + b + c;
  let value = 7 - parseInt(neighborhood, 2);
  return parseInt(ruleSet[value]);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
