// let mn;
let capture;
let div;
let w = 360;
let h = 280;
let slogan = "";
let sloganBottom = "";

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

function setup() {
	colorMode(HSL, 360, 100, 100, 1);
	document.body.style.background = bc;
	capture = createCapture(
		{
			audio: false,
			video: {
				width: w,
				height: h
			}
		},
		function() {
			console.log("capture ready.");
		}
	);
	capture.elt.setAttribute("playsinline", "");
	createCanvas(w, h);
	capture.size(w, h);
	capture.hide();

	colorMode(HSB);

	tracker = new clm.tracker();
	tracker.init();
	tracker.start(capture.elt);

	document.getElementById("sc").addEventListener("click", () => {
		save("trapboy.jpg");
	});

	let count = 8;
	while (count > 0) {
		slogan += "TRAPBOY🔥";
		sloganBottom += "9/10💵✨";
		count--;
	}
}

function draw() {
	image(capture, 0, 0, w, h);
	filter(INVERT);
	var positions = tracker.getCurrentPosition();
	if (positions) {
		textSize(40);
		textAlign(LEFT, TOP);
		fill(bc);
		textStyle(ITALIC);
		text(slogan, (frameCount % 200) - 200, 5);
		text(sloganBottom, ((frameCount * 1.5) % 250) - 250, height - 40);

		textSize(20);
		textStyle(NORMAL);
		textAlign(CENTER, CENTER);
		text("🔥", positions[27][0], positions[27][1]);
		text("🔥", positions[32][0], positions[32][1]);
		text("✞", positions[33][0], positions[33][1] - 30);
		textSize(16);
		text("💧", positions[32][0] + 8, positions[32][1] + 20);
		text("💧", positions[32][0] + 5, positions[32][1] + 40);
		text("✨", positions[58][0], positions[58][1]);

		// noFill();
		// stroke(bc);
		// strokeWeight(5);
		// beginShape();
		// for (var i = 44; i < 59; i++) {
		// 	vertex(positions[i][0], positions[i][1]);
		// }
		// endShape();

		// noStroke();
		// if (positions) {
		// 	for (var i = 0; i < positions.length; i++) {
		// 		drawPosition(positions, i);
		// 	}
		// }
	}
}

function drawPosition(positions, i) {
	fill(map(i, 0, positions.length, 0, 360), 50, 100);
	ellipse(positions[i][0], positions[i][1], 4, 4);
	text(i, positions[i][0], positions[i][1]);
}
