//  colors: https://www.color-hex.com/color-palette/83132
// 	(67,174,112)
//	(255,255,255)
//	(255,154,0)
//	(67,174,166)
//	(159,112,208)

// colors: https://www.color-hex.com/color-palette/83036
// #4e7377	(78,115,119)
// #d3b19c	(211,177,156)
// #e4d0c3	(228,208,195)
// #f4ece6	(244,236,230)
// #545255	(84,82,85)
let capture;
let div;
let w = 360;
let h = 280;
let slogan = "";
let sloganBottom = "";

let video;
let poseNet;
let poses = [];
let ready = false;
let modelReady = false;
let playersReady = false;

// Game
let playing = false;
let score = 0;
let target = { x: 50, y: 50 };

let positions;

function HSLToHex(h, s, l) {
  s /= 100;
  l /= 100;

  let c = (1 - Math.abs(2 * l - 1)) * s,
    x = c * (1 - Math.abs(((h / 60) % 2) - 1)),
    m = l - c / 2,
    r = 0,
    g = 0,
    b = 0;

  if (0 <= h && h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (60 <= h && h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (120 <= h && h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (180 <= h && h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (240 <= h && h < 300) {
    r = x;
    g = 0;
    b = c;
  } else if (300 <= h && h < 360) {
    r = c;
    g = 0;
    b = x;
  }
  // Having obtained RGB, convert channels to hex
  r = Math.round((r + m) * 255).toString(16);
  g = Math.round((g + m) * 255).toString(16);
  b = Math.round((b + m) * 255).toString(16);

  // Prepend 0s, if necessary
  if (r.length == 1) r = "0" + r;
  if (g.length == 1) g = "0" + g;
  if (b.length == 1) b = "0" + b;

  return "#" + r + g + b;
}

let bc = HSLToHex(Math.random() * 360, 100, 50);

function toDb(value) {
  return 20 * Math.log(value);
}

function setup() {
  document.body.style.background = bc;
  const canvas = createCanvas(640, 480);

  canvas.parent("p5-canvas");
  fill(255, 255, 255);
  rect(-1, -1, width + 2, height + 2);

  // video
  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();

  // model

  poseNet = ml5.poseNet(video, () => {
    modelReady = true;
    document.getElementById("play-btn").innerHTML = "play";
    ready = true;
  });
  poseNet.on("pose", results => {
    poses = results;
  });

  positions = [
    { x: 0.5 * width, y: 0.5 * height },
    { x: 0.5 * width, y: 0.5 * height },
    { x: 0.5 * width, y: 0.5 * height }
  ];

  let count = 8;
  while (count > 0) {
    slogan += "TRAPBOY🔥";
    sloganBottom += "9/10💵✨";
    count--;
  }
}

function draw() {
  translate(width, 0);
  scale(-1, 1);
  image(video, 0, 0, width, height);
  filter(INVERT);

  if (playing) {
    drawPositions();
  } else {
    // fill(67, 174, 166, 200);
    fill(150, 150, 150, 200);
    rect(-1, -1, width + 2, height + 2);
  }
}

function drawPositions() {
  if (poses.length > 0) {
    const pose = poses[0].pose;
    textSize(40);
    textAlign(LEFT, TOP);
    fill(bc);
    textStyle(ITALIC);
    text(slogan, (frameCount % 200) - 200, 5);
    text(sloganBottom, ((frameCount * 1.5) % 250) - 250, height - 40);

    textSize(25);
    textStyle(NORMAL);
    textAlign(CENTER, CENTER);

    text("🔥", pose.rightEye.x, pose.rightEye.y);
    text("🔥", pose.leftEye.x, pose.leftEye.y);

    let x = (pose.rightEye.x + pose.leftEye.x) * 0.5;
    let y = (pose.rightEye.y + pose.leftEye.y) * 0.5;
    y = y - (pose.nose.y - y) * 1.1;

    textSize(28);
    text("✞", x, y);

    textSize(20);
    text("💧", pose.rightEye.x - 15, pose.rightEye.y + 30);
    text("💧", pose.rightEye.x - 10, pose.rightEye.y + 50);

    let xShift = (pose.nose.x - pose.rightEye.x) * 0.6;
    let yShift = (pose.nose.y - pose.rightEye.y) * 1.7;
    text("✨", pose.nose.x + xShift, pose.nose.y + yShift);
  }
}

function mousePressed() {
  // console.log(poses[0].pose);
}

const playBtn = document.getElementById("play-btn");

playBtn.addEventListener("click", () => {
  if (ready) {
    playBtn.style.display = "none";
    playing = true;
  }
});
