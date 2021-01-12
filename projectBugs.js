//Declerations
var w = window.innerWidth;
var h = window.innerHeight;
animationCounter = 0;
var tick = 0;
var bugToggle = false;
var move = true;
var zoneToggle = false;
const scale = 2;
const height = 32;
const width = 32;

//Containers
var objects = [];
var zones = [];
var selected = [];

//Colors
var activeButtonColor = "lightgreen";
var normalButtonColor = "rgb(150,150,150,.3)";
var selectedColor = "rgba(255,0,255,1)";

//Start
let img = new Image();
img.src = 'marine.png'

let imgL = new Image();
imgL.src = 'marine-l.png'

var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");
ctx.canvas.width  = w;
ctx.canvas.height = h;
createZone(w/2, h/5, w/10);
createOBJ(200,200, 2);


//---------------------------------------------------------------------------------------
// C L E A R   F U N C T I O N S

function clearBugs() {
	objects = [];
}

function clearZones() {
	zones = [];
}

function clearSelected() {
	for (o in objects) {
		objects[o].selected = false;
	}
}

//---------------------------------------------------------------------------------------
// T O G G L E   F U N C T I O N S

function toggleBugs() {
	if (bugToggle == true) {
		document.getElementById("toggleBugs").style.backgroundColor = normalButtonColor;
		bugToggle = false;
	} else {
		document.getElementById("toggleBugs").style.backgroundColor = activeButtonColor;
		bugToggle = true;
	}
}


function toggleZones() {
	if (zoneToggle == true) {
		zoneToggle = false;
		document.getElementById("toggleZones").style.backgroundColor = normalButtonColor;
	} else {
		zoneToggle = true;
		document.getElementById("toggleZones").style.backgroundColor = activeButtonColor;
	}
}

//---------------------------------------------------------------------------------------
// C R E A T E   O B J E C T S

function createZone(x, y, r) {
	var obj = {
		"name":"zone",
		"x":x,
		"y":y,
		"r":r,
		"state":"off",
		"fillColor":"rgba(255, 0, 0, 0.2)"
	}	
	zones.push(obj);	
}

function createOBJ(x, y, s) {
	var obj = {
		"angle":0,
		"angleDeg":0,
		"x":x,
		"y":y,
		"px":x,
		"py":y,
		"h":16 * s,
		"w":16 * s,
		"moving": false,
		"xTarget":200,
		"yTarget":200,
		"velocity":Math.random()*3 + 5,
		"xVelocity":0,
		"yVelocity":0,
		"moveDirection": "R",
		"moveLeft":false,
		"moveRight":false,
		"animationSpeed":20,
		"animationPosition":0,
		"scale":s,
		"selected": true,
		"objType": 1//32 * 4 //getRandomInt(16) * 32
	}
	objects.push(obj);
}

//---------------------------------------------------------------------------------------
// B A S E   F U N C T I O N S

function distance(x1, y1, x2, y2) {
	return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
}


//---------------------------------------------------------------------------------------
// E V E N T S

function mouseClick(event){
	var x = event.clientX;
	var y = h - event.clientY;
	
	//Select Closest Object
	for (o in objects) {
		if (distance(x, y, objects[o].x, objects[o].y) < 20) {
			if (objects[o].selected == false) {
				objects[o].selected = true;
			}else if (objects[o].selected == true) {
				objects[o].selected = false;
			}
			
		} 
	}
	
	if (zoneToggle) {
		createZone(x,y,w/10);
	}
	if (bugToggle) {
		createOBJ(x, y, 2);
	}
	for (o in objects) {
		if (objects[o].selected == true) {
			objects[o].xTarget = x;
			objects[o].yTarget = y;
			if (objects[o].x > objects[o].xTarget) {
				objects[o].moveDirection = "L";
			} else {
				objects[o].moveDirection = "R";
			}
			var deltaX = objects[o].xTarget - objects[o].x
			var deltaY = objects[o].yTarget - objects[o].y
			objects[o].angle = Math.atan2((objects[o].yTarget - objects[o].y), (objects[o].xTarget - objects[o].x)) - (Math.PI)
			objects[o].xVelocity = Math.cos(objects[o].angle) * objects[o].velocity;
			objects[o].yVelocity = Math.sin(objects[o].angle) * objects[o].velocity;
			objects[o].angleDeg = Math.atan2((objects[o].yTarget - objects[o].y), (objects[o].xTarget - objects[o].x)) * (180 / Math.PI)
			objects[o].angleDeg  = 360 - objects[o].angleDeg + 90;
			objects[o].angleDeg = (objects[o].angleDeg + 360) % 360
			

		}
	}
	
	
}

//---------------------------------------------------------------------------------------
// L O G I C   F U N C T I O N S

function collision(o1, o2, x, y) {
	var distance = Math.sqrt((objects[o1].x + x - objects[o2].x)*(objects[o1].x + x - objects[o2].x) + (objects[o1].y + y - objects[o2].y)*(objects[o1].y + y - objects[o2].y)) 
	var deltaX = objects[o2].xTarget - objects[o2].x
	var deltaY = objects[o2].yTarget - objects[o2].y
	objects[o2].angle = Math.atan((objects[o2].yTarget - objects[o2].y) / (objects[o2].xTarget - objects[o2].x));
	objects[o2].xVelocity = Math.cos(objects[o2].angle) * objects[o2].velocity;
	objects[o2].yVelocity = Math.sin(objects[o2].angle) * objects[o2].velocity;
	if (distance < (objects[o1].w / 1.5 + objects[o2].w / 1.5)) { //(objects[o1].w / 2) + (objects[o2].w / 2)) {
		return true;
	}
}

function checkHCollision(object1) {
	// console.log(objects)
	for (e in objects) {
	// 	// Rule out self collisions
		if (e != object1) {
			
			if (Math.abs(object1.x - e.x) < 30) {
				// console.log("collision")
	// 			return true;
			}
		}
	}
	return false;
}

function moveToLocation() {
	for (e in objects) {
		console.log(e)
	}
	for (o in objects) {
		if (objects[o].selected == true) {
			objects[o].px = objects[o].x;
			objects[o].py = objects[o].y;

			// Set initial movement false
			objects[o].moving = false;

			// Check If Arrived
			if (Math.abs(objects[o].x - objects[o].xTarget) > Math.abs(objects[o].xVelocity)) {
				if (!checkHCollision(objects[o])) {
					objects[o].x -= objects[o].xVelocity;
					objects[o].moving = true;
				}
			}

			if (Math.abs(objects[o].y - objects[o].yTarget) > Math.abs(objects[o].yVelocity)) {
				objects[o].y -= objects[o].yVelocity;
				objects[o].moving = true;
			}

			
			
		// 	if (objects[o].x > objects[o].xTarget) {
		
		// 		//Left Half
		// 		objects[o].moveLeft = true;
		// 		for (e in objects) {
		// 			if (e != o) {
		// 				if (collision(o,e, -objects[o].xVelocity, 0)) {
		// 					move = false;
		// 					objects[o].moving = false;
		// 				}
		// 			}
		// 		}
		// 		if (move) {
		// 			objects[o].x -= objects[o].xVelocity;
		// 		}
		// 		move = true;
		
		// 		for (e in objects) {
		// 			if (e != o) {
		// 				if (collision(o,e, 0, -objects[o].yVelocity)) {
		// 					move = false;
		// 				}
		// 			}
		// 		}
		// 		if (move) {
		// 			objects[o].y -= objects[o].yVelocity;
		// 		}
		// 		move = true;
		


		// 	} else {
		// 		objects[o].moveLeft = false;
		// 	}
		// 	if ((objects[o].x < objects[o].xTarget)) {
		// 		for (e in objects) {
		// 			if (e != o) {
		// 				if (collision(o,e, objects[o].xVelocity, 0)) {
		// 					move = false;
		// 					objects[o].moving = false;
		// 				}
		// 			}
		// 		}
		// 		objects[o].moveRight = true;
		// 		if (move) {
		// 			objects[o].x += objects[o].xVelocity;
		// 		}
		// 		move = true;
			

		// 		for (e in objects) {
		// 			if (e != o) {
		// 				if (collision(o,e, 0, objects[o].yVelocity)) {
		// 					move = false;
		// 					objects[o].moving = false;
		// 				}
		// 			}
		// 		}
		// 		objects[o].moveRight = true;
		// 		if (move) {
		// 			objects[o].y += objects[o].yVelocity;
		// 		}
		// 		move = true;
				
		// 	} else {
		// 		objects[o].moveRight = false;
		// 	}
		// }
		}
		
	}
}

function checkIfInZone() {
	for (o in objects) {
		//Check if in zone
		var inZone = false;
		for (z in zones) {
			inZone= false
			for (n in objects) {
				var distance = Math.sqrt((objects[n].x - zones[z].x)*(objects[n].x - zones[z].x)  + (objects[n].y - zones[z].y)*(objects[n].y - zones[z].y));
				if (distance < zones[z].r) {
					inZone = true;
				}
			}
			if (inZone) {
				zones[z].state = "green"
				zones[z].fillColor = "rgba(255, 0, 0, 0.1)"
				
			} else {
				zones[z].state = "black"
				zones[z].fillColor = "rgba(0, 255, 0, 0.1)"
			}
		}
	}	
}

function updateObjects() {
	moveToLocation();
	checkIfInZone();
}

//---------------------------------------------------------------------------------------
// V I S U A L

function updateGraphics() {
	ctx.clearRect(0,0,w,h);
	//draw zones
	for (o in zones) {
		ctx.beginPath();
		ctx.strokeStyle = zones[o].state;
		ctx.fillStyle = zones[o].fillColor;
		ctx.arc(zones[o].x, h - zones[o].y, zones[o].r, 0, 2 * Math.PI);
		ctx.stroke();
		ctx.fill();
	}
	
	//Draw Objects
	for (o in objects) {
		// Draw Selection Circle
		if (objects[o].selected == true) {
			ctx.beginPath();
			ctx.fillStyle = "lightgreen";
			// ctx.arc(objects[o].x, h - objects[o].y, 20, 0, 2 * Math.PI);
			ctx.ellipse(objects[o].x, h - objects[o].y, 16, 12, 0, 0, 2 * Math.PI);
			ctx.fill()
		}
		
		if (objects[o].moving == true) {
			objects[o].animationPosition = (animationCounter % 9) + 4;
		}
		
		
		if ((objects[o].px != objects[o].x) && (objects[o].py != objects[o].y)) {
			//objects[o].animationPosition = (animationCounter % objects[o].animationSpeed) + 1;
			objects[o].objType = 0//32 * 4
		} else {
			//objects[o].objType = 1//32 * 5
		}
		// ctx.save();
		// ctx.translate(objects[o].x , h - objects[o].y ) ;
		// if (objects[o].moveDirection == "L") {
		// 	ctx.rotate(-objects[o].angle - Math.PI/2 ); 
		// } else {
		// 	ctx.rotate(-objects[o].angle + Math.PI/2); 
		// }
		// // 544x 512y
		let tempImage = img;
		let rotationValue = Math.floor((objects[o].angleDeg / 11))
		if (objects[o].angleDeg > 180) {
			tempImage = imgL;
			rotationValue = Math.floor(((objects[o].angleDeg - 180) / 11))
		}

		ctx.drawImage(tempImage, 
			64 * rotationValue,
			64*objects[o].animationPosition,
			50,
			50,
			objects[o].x - 16, // X Position
			h - objects[o].y - 32, // Y Position
			32 * objects[o].scale, // Image Height
			32 * objects[o].scale// Image Width)
		)
		// ctx.drawImage(img,
		// 	width*objects[o].animationPosition,
		// 	objects[o].objType,
		// 	32,
		// 	32,
		// 	-16*objects[o].scale,
		// 	-16*objects[o].scale,
		// 	32 * objects[o].scale,
		// 	32 * objects[o].scale);
		// ctx.restore();	
	}
	// add bugs
	
}
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}



//---------------------------------------------------------------------------------------
// I N T E R V A L

setInterval(function(){ 
	updateObjects();
	updateGraphics(); 
	tick += 1;
	if (tick % 2 == 0) {	
		animationCounter += 1;
	}
}, 32);

