new p5();

// Coordinates corresponding to position of pendulum
let cx;
let cy; 

// coefficient of friction
let mu = 1

// Length, mass and angle of pendulum
let r1 = 140;
let r2 = 140;
let m1 = 20;
let m2 = 20;
let a1 = PI /2; // Starts at 90 DEGREES
let a2 = PI /2; // Starts at 90 DEGREES

// Position of pendulum
let x1;
let y1;
let x2;
let y2;

// Velocity of pendulum
let a1_v = 0;
let a2_v = 0;

// Acceleration of gravity on Earth (cheezed)
let g = 1;

// Previous position of secodn pendulum
let px2;
let py2; 

// Background (used to draw trail)
let pg;

function getWindowWidth(element) {
	return element.clientWidth;
}

function getWindowHeight(element) {
	return element.clientHeight;
}

function setup() {
	// Get flex_canvas div's height and width
	let divWidth = flex_canvas.clientWidth;
	let divHeight = flex_canvas.clientHeight;
	
	// Create canvas and background
	let myCanvas = createCanvas(divWidth, divHeight);
	pg = createGraphics(width, height);

	cx = width / 2;
	cy = 200;
	
	pg.background('white');	

	// Apply canvas to flex_canvas div
	myCanvas.parent("flex_canvas");
}

function windowResized() {
	let flex_canvas = document.getElementById("flex_canvas");
	let divWidth = flex_canvas.clientWidth;
	let divHeight = flex_canvas.clientHeight;
	resizeCanvas(divWidth, divHeight);
	console.log(divWidth);
	console.log(divHeight);
	console.log("This:" + getWindowWidth(flex_canvas));
	console.log("That:" + getWindowHeight(flex_canvas));
}

function draw() {
	image(pg, 0, 0);

	console.log(mousePressed());

	if (myMouseMoved()) {

		let a = atan2(mouseY - height / 2, mouseX - width / 2);
		console.log(a);

		a1_v = 0;
		a2_v = 0;
		a1_a = 0;
		a2_a = 0;

		if (closerPendulum()){
			a1 += a;
			calculations();
			sketchPendulum();
		} else {
			a2 += a;
			calculations();
			sketchPendulum();
		}

	} else {
		calculations();
		sketchPendulum();
		sketchTrail();
	}

	px2 = x2;
	py2 = y2;
}

function mousePressed() {
	return true;
}

function myMouseMoved() {
	return pmouseX < mouseX || pmouseY < mouseY; 
}

function distanceToPendulum(x, y) {
	let deltaX = mouseX - (x + cx); 
	let deltaY = mouseY - (y + cy);

	return sqrt(sq(deltaX) + sq(deltaY));
}

function closerPendulum() {
	return distanceToPendulum(x1, y1) > distanceToPendulum(x2, y2);
}

function sketchPendulum() {
	translate(cx, cy);
	
	// Pendulum 1
	push();
	stroke('black');
	strokeWeight(2);
	fill('black');	
	
	line(0, 0, x1, y1);
	ellipse(x1, y1, m1);
	pop();
	
	// Pendulum 2
	push();
	stroke('black');
	strokeWeight(2);
	fill('black');

	line(x1, y1, x2, y2);
	ellipse(x2, y2, m2);
	pop();
}

function sketchTrail() {
	pg.push();
	pg.translate(cx, cy);
	pg.strokeWeight(2);
	pg.stroke('black');
	if (frameCount > 1) {
		pg.line(px2, py2, x2, y2);
	}
	pg.pop();
}

function calculations() {
	// Calculating the acceleraion of the double pendulum (see: https://www.myphysicslab.com/pendulum/double-pendulum-en.html)
	let num1 = -g * (2 * m1 + m2) * sin(a1);
	let num2 = -m2 * g * sin(a1 - 2 * a2);
	let num3 = -2 * sin(a1 - a2) * m2;
	let num4 = sq(a2_v) * r2 + sq(a1_v) * r1 * cos(a1 - a2);

	let numerator = num1 + num2 + num3 * num4;
	let denominator = r1 * (2 * m1 + m2 - m2 * cos(2 * a1 - 2 * a2));
	
	let a1_a = numerator / denominator;
	
	
	num1 = 2 * sin(a1 - a2);
	num2 = sq(a1_v) * r1 * (m1 + m2);
	num3 = g * (m1 + m2) * cos(a1);
	num4 = sq(a2_v) * r2 * m2 * cos(a1 - a2);
	
	numerator = num1 * (num2 + num3 + num4);
	denominator = r2 * (2 * m1 + m2 - m2 * cos(2 * a1 - 2 * a2));
	
	let a2_a = numerator / denominator;

	// Velocity changed by acceleration of pendulum
	a1_v += a1_a;
	a2_v += a2_a;

	// Velocity affected by friction
	a1_v *= mu;
	a2_v *= mu;
	
	// Position changed by velocity of pendulum
	a1 += a1_v;
	a2 += a2_v;

	x1 = r1 * sin(a1);
	y1 = r1 * cos(a1);

	x2 = x1 + r2 * sin(a2);
	y2 = y1 + r2 * cos(a2);
	//console.log("x1: " + x1);
	//console.log("x2: " + x2);
}