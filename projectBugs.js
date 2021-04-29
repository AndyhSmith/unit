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
var dashOffset = 0

//Containers
var money = 0
var objects = [];
var zones = [];
var selected = [];
var enemies = []
var deaths = []
var player = {
	"angle":0,
	"angleDeg":0,
	"damage": 3,
	"range": 100,
	"x": 200,
	"y": 200,
	"moving": false,
	"xTarget":200,
	"yTarget":200,
	"velocity":7,
	"xVelocity":0,
	"yVelocity":0,
	"animationSpeed":20,
	"animationPosition":0,
	"scale": 3,
	"selected": true,
	"state": "walking",
	"objType": 1,
	"health": 100,
	"maxHealth" : 200
}

//Colors
var activeButtonColor = "lightgreen";
var normalButtonColor = "rgb(150,150,150,.3)";
var selectedColor = "rgba(255,0,255,1)";

//Start
let img = new Image();
img.src = 'marine.png'

let imgL = new Image();
imgL.src = 'marine-l.png'

const ZERGLING_IMG = new Image();
ZERGLING_IMG.src = 'zergling.png'

const ZERGLING_IMG_L = new Image();
ZERGLING_IMG_L.src = 'zergling-l.png'

var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");
ctx.canvas.width  = w;
ctx.canvas.height = h;



//---------------------------------------------------------------------------------------
// C L E A R   F U N C T I O N S



//---------------------------------------------------------------------------------------
// C R E A T E   O B J E C T S

function createEnemy(x, y, s) {
	var enemy = {
		"animationPosition": 0,
		"animationCounter": 0,
		"angle": 0,
		"damage": .1,
		"health": 100,
		"scale": s,
		"state": "walking",
		"velocity": 4,
		"x": x,
		"xVelocity": 0,
		"pX": 0,
		"y": y,
		"yVelocity": 0,
		"pY": 0,
	}
	enemies.push(enemy)
}

function createDeath(x, y, width, height, s, frames, yOffset, img) {
	var enemy = {
		"animationPosition": 0,
		"angle": 0,
		"damage": .1,
		"health": 100,
		"frames": frames,
		"scale": s,
		"width": width,
		"height": height,
		"x": x,
		"y": y,
		"yOffset": yOffset,
		"img": img
	}
	deaths.push(enemy)
}



//---------------------------------------------------------------------------------------
// B A S E   F U N C T I O N S

function distance(x1, y1, x2, y2) {
	return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
}

function fastDistance(x1, y1, x2, y2) {
	return (x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2)
}

function randomNumber(min, max) {  
    return Math.floor(Math.random() * (max - min) + min); 
} 

function getRandomInt(max) {
	return Math.floor(Math.random() * Math.floor(max));
}
//---------------------------------------------------------------------------------------
// E V E N T S

function mouseClick(event){
	var x = event.clientX;
	var y = h - event.clientY;
	
	player.xTarget = x;
	player.yTarget = y;
	if (player.x > player.xTarget) {
		player.moveDirection = "L";
	} else {
		player.moveDirection = "R";
	}
	var deltaX = player.xTarget - player.x
	var deltaY = player.yTarget - player.y
	player.angle = Math.atan2((player.yTarget - player.y), (player.xTarget - player.x)) - (Math.PI)
	player.xVelocity = Math.cos(player.angle) * player.velocity;
	player.yVelocity = Math.sin(player.angle) * player.velocity;

	player.angleDeg = (player.angle + Math.PI) * (180 / Math.PI)
	player.angleDeg  = 360 - player.angleDeg + 90;
	player.angleDeg = (player.angleDeg + 360) % 360
			
}

//---------------------------------------------------------------------------------------
// L O G I C   F U N C T I O N S

function horizontalCollision(obj1, obj2) {
	let dist = fastDistance(obj1.x - obj1.xVelocity, obj1.y, obj2.x, obj2.y) 
	if (dist < 25*25) {
		return true
	}
	return false
}

function verticleCollision(obj1, obj2) {
	let dist = fastDistance(obj1.x, obj1.y - obj1.yVelocity, obj2.x, obj2.y) 
	if (dist < 25*25) {
		return true
	}
	return false
}

function moveToLocation() {


	// Set initial movement false
	player.moving = false;
	player.state = "standing"

	// Check If Arrived
	if (Math.abs(player.x - player.xTarget) > Math.abs(player.xVelocity)) {
		player.x -= player.xVelocity;
		player.moving = true;
		player.state = "walking"
	}

	if (Math.abs(player.y - player.yTarget) > Math.abs(player.yVelocity)) {
		player.y -= player.yVelocity;
		player.moving = true;
		player.state = "walking"
	}

	// If holding still find the closest enemy
	if (((player.state == "standing") || (player.state == "attacking")) && (enemies.length > 0)) {
		closestEnemyDistance = 99999999
		closestEnemyIndex = 0
		for (e in enemies) {
			let dist = fastDistance(player.x, player.y, enemies[e].x, enemies[e].y)
			if (dist < closestEnemyDistance) {
				closestEnemyDistance = dist
				closestEnemyIndex = e
			}
		}

		// Check if enemy in range
		let dist = fastDistance(player.x, player.y, enemies[closestEnemyIndex].x, enemies[closestEnemyIndex].y)
		if (dist < player.range*player.range) {
			// Shoot at Enemy
			player.angle = Math.atan2((enemies[closestEnemyIndex].y - player.y), (enemies[closestEnemyIndex].x - player.x)) 
			player.angleDeg = player.angle * (180 / Math.PI)
			player.angleDeg  = 360 - player.angleDeg + 90;
			player.angleDeg = (player.angleDeg + 360) % 360

			player.state = "attacking"

			// Remove enemy if dead
			enemies[closestEnemyIndex].health -= player.damage
			if (enemies[closestEnemyIndex].health <= 0) {
				createDeath(enemies[closestEnemyIndex].x,h - enemies[closestEnemyIndex].y,50,50, 1, 7, 42 * 13 + 3, ZERGLING_IMG)
				money += 1
				enemies.splice(closestEnemyIndex, 1)
			}

			
		}
	}


}

function updateEnemies() {
	for (e in enemies) {
		// Update Angle On Occassion
		if (tick % getRandomInt(50) == 0) {
			enemies[e].angle = Math.atan2((player.y - enemies[e].y), (player.x - enemies[e].x)) - (Math.PI)
			enemies[e].xVelocity = Math.cos(enemies[e].angle) * enemies[e].velocity; //xVelocities
			enemies[e].yVelocity = Math.sin(enemies[e].angle) * enemies[e].velocity; //yVelocities
		}

		let horizontalCollisionCheck = false
		let verticleCollisionCheck = false
		for (e2 in enemies){
			if (e != e2) {
				if(horizontalCollision(enemies[e], enemies[e2])) {
					horizontalCollisionCheck = true
				}
				if(verticleCollision(enemies[e], enemies[e2])) {
					verticleCollisionCheck = true
				}
			}
		}

		// Check if close to player
		let dist = fastDistance(player.x, player.y, enemies[e].x, enemies[e].y)
		if (dist < 35*35) {
			console.log("Attacking Player")
			enemies[e].state = "attacking"
			player.health -= enemies[e].damage
		} else {
			enemies[e].state = "walking"
		}

		// Check if Player is dead
		if (player.health <= 0) {
			player.health = 100
		}

		enemies[e].pX = enemies[e].x
		enemies[e].pY = enemies[e].y

		if ((!horizontalCollisionCheck) && (enemies[e].state == "walking")) {
			enemies[e].x -= enemies[e].xVelocity
		}
		if ((!verticleCollisionCheck) && (enemies[e].state == "walking")) {
			enemies[e].y -= enemies[e].yVelocity
		}
		
		// Check if not moving
		if ((enemies[e].pX == enemies[e].x) && (enemies[e].pY == enemies[e].y) && (enemies[e].state != "attacking")) {
			enemies[e].state = "standing"
		}
	}
}


function createEnemyChance() {
	let chance = randomNumber(0, 200) 
	if (chance == 2) {
		createEnemy(randomNumber(0,w),h + 50, 1.5);
	}
	else if (chance == 3) {
		createEnemy(randomNumber(0,w),-50, 1.5);
	}
	else if (chance == 4) {
		createEnemy(w + 50,randomNumber(0,h), 1.5);
	}
	else if (chance == 5) {
		createEnemy(-50,randomNumber(0,h), 1.5);
	}
}

function updateObjects() {
	moveToLocation();
	createEnemyChance();
	updateEnemies();
}

//---------------------------------------------------------------------------------------
// V I S U A L

// createDeath(200, 200,50,50,2,8, 1000, img)

function updateGraphics() {
	ctx.clearRect(0,0,w,h);


	// Draw Deaths
	for (d in deaths) {
		// console.log("Deaths")
		ctx.drawImage(deaths[d].img, 
			68 * deaths[d].animationPosition + 3,
			42 * 13 + 3,
			60,
			51,
			deaths[d].x - 30, //deaths[d].x - 16, // X Position
			deaths[d].y - 25, //h - deaths[d].y - 32, // Y Position
			64 * deaths[d].scale, //* deaths[d].scale, // Image Height
			64 * deaths[d].scale//* deaths[d].scale// Image Width)
		)

		if (deaths[d].animationPosition <= 5) {
			if (tick % 3 == 0) {
				deaths[d].animationPosition += 1
			}
		}
		else {
			if (tick % randomNumber(0,120) == 1) {
				deaths[d].animationPosition += 1
			}
		}
		
		// Remove After Animation
		if (deaths[d].animationPosition >= 7) {
			deaths.splice(d, 1)
		}
	}

	

	//Draw Player
	// Draw Selection Circle

	// ctx.beginPath();
	// ctx.fillStyle = "lightgreen";
	// // ctx.arc(player.x, h - player.y, 20, 0, 2 * Math.PI);
	// ctx.ellipse(player.x, h - player.y, 16, 12, 0, 0, 2 * Math.PI);
	// ctx.fill()
	
	// Draw Range
	ctx.beginPath();
	ctx.strokeStyle = 'red';
	ctx.lineWidth = 8
	ctx.setLineDash([5, 10]);
	ctx.lineDashOffset = dashOffset;
	dashOffset += 0.5
	ctx.ellipse(player.x, h - player.y, player.range * 1.2, player.range, 0, 0, 2 * Math.PI);
	ctx.stroke();
	
	
	if (player.state == "walking") {
		if (player.moving == true) {
			player.animationPosition = (animationCounter % 9) + 4;
		}
	} else if (player.state == "attacking") {	
		player.animationPosition = (animationCounter % 2) + 2;	
	} else if (player.state == "standing") {	
		player.animationPosition = 1;	
	}
		
	let tempImage = img;
	let rotationValue = Math.floor((player.angleDeg / 11))
	if (player.angleDeg > 180) {
		tempImage = imgL;
		rotationValue = Math.floor(((player.angleDeg - 180) / 11))
	}

	ctx.drawImage(tempImage, 
		64 * rotationValue - 16,
		64*player.animationPosition - 16,
		64,
		64,
		player.x - 42, // X Position
		h - player.y - 64, // Y Position
		32 * player.scale, // Image Height
		32 * player.scale// Image Width)
	)

	

	// Draw Enemies
	for (e in enemies) {
		if (enemies[e].state == "walking") {
			enemies[e].animationPosition = (enemies[e].animationCounter % 7);
			enemies[e].animationCounter += 1
		}
		else if (enemies[e].state == "attacking") {
			enemies[e].animationPosition = (enemies[e].animationCounter % 6) + 5;
			if (tick % 3 == 0) {
				enemies[e].animationCounter += 1
			}
		}
		else if (enemies[e].state == "standing") {
			enemies[e].animationPosition = 1;
		}
		let angle = ((enemies[e].angle * (180 / Math.PI) * - 1) + 90) % 360
		let tempImage = ZERGLING_IMG_L;
		let rotationValue = Math.floor((angle / 22))
		if (angle > 180) {
			tempImage = ZERGLING_IMG;
			rotationValue = Math.floor(((angle - 180) / 22))
		}
		ctx.drawImage(tempImage, 
			43 * rotationValue + 4,
			42 * enemies[e].animationPosition + 3,
			37,
			37,
			enemies[e].x - 16, // X Position
			h - enemies[e].y - 32, // Y Position
			32 * enemies[e].scale, // Image Height
			32 * enemies[e].scale// Image Width)
		)

		// Draw enemy health
		// D R A W   H E A L T H
		// ctx.fillStyle = "grey"
		// ctx.fillRect(w / 2 - 200, h - 20, 20, 20);
		if (enemies[e].health < 99) {
			ctx.fillStyle = "red"
			ctx.fillRect(enemies[e].x - 5, h - enemies[e].y - 20, enemies[e].health / 6, 3);
		}
		
	}

	


	// D R A W   H E A L T H
	ctx.fillStyle = "grey"
	ctx.fillRect(w / 2 - 150, h - 20, 300, 20);
	ctx.fillStyle = "red"
	ctx.fillRect(w / 2 - 150, h - 20, player.health * 3, 20);
	
	ctx.fillStyle = "black"
	ctx.font = "20px Arial";
	ctx.fillText("Health " + Math.floor(player.health) , w / 2 - 150, h - 22);
	ctx.fillText("Zerg Pelts " + Math.floor(money) , w / 2 - 150, h - 44);
	
}




//---------------------------------------------------------------------------------------
// I N T E R V A L

var paused = true;
setInterval(function(){ 
	if (!paused) {
		updateObjects();
		updateGraphics(); 
		tick += 1;
		if (tick % 2 == 0) {	
			animationCounter += 1;
		}
	}
}, 40);



// var stop = false;
// var frameCount = 0;
// var fps, fpsInterval, startTime, now, then, elapsed;


// initialize the timer variables and start the animation

// function startAnimating(fps) {
//     fpsInterval = 1000 / fps;
//     then = Date.now();
//     startTime = then;
//     animate();
// }
// startAnimating(30)
// the animation loop calculates time elapsed since the last loop
// and only draws if your specified fps interval is achieved

// function animate() {

//     // request another frame
// 	// var progress = timestamp - lastRender
// 	// console.log(progress)
// 	// lastRender = timestamp
//     requestAnimationFrame(animate);

//     // calc elapsed time since last loop
	
//     now = Date.now();
//     elapsed = now - then;
	

//     // if enough time has elapsed, draw the next frame

//     if (elapsed > fpsInterval) {

//         // Get ready for next frame by setting then=now, but also adjust for your
//         // specified fpsInterval not being a multiple of RAF's interval (16.7ms)
//         then = now - (elapsed % fpsInterval);

//         if (!paused) {
// 			updateObjects();
// 			updateGraphics(); 
// 			tick += 1;
// 			if (tick % 2 == 0) {	
// 				animationCounter += 1;
// 			}
// 		}

//     }
// }



function infoToggle() {
    var x = document.getElementById("info-dark-background");
    if (x.style.display === "none") {
        x.style.display = "block";
		paused = true
    } else {
        x.style.display = "none";
		paused = false
    }
}

//---------------------------------------------------------------------------------------
// S H O P 
var shop = {
	"rangeLevel": 0,
	"rangePrice": 3,
	"rangeBoostAmount": 5,
	"damageLevel": 0,
	"damagePrice": 5,
	"damageBoostAmount": 1,
}
function updateShopDOM() {
	document.getElementById("zerg-pelts").innerHTML = money

	document.getElementById("player-range-level").innerHTML = shop.rangeLevel
	document.getElementById("range-price").innerHTML = shop.rangePrice
	document.getElementById("player-range").innerHTML = player.range
	document.getElementById("player-range-add").innerHTML = player.range + shop.rangeBoostAmount

	document.getElementById("player-damage-level").innerHTML = shop.damageLevel
	document.getElementById("damage-price").innerHTML = shop.damagePrice
	document.getElementById("player-damage").innerHTML = player.damage
	document.getElementById("player-damage-add").innerHTML = player.damage + shop.damageBoostAmount
}


function shopToggle() {
    var x = document.getElementById("shop-dark-background");
    if (x.style.display === "none") {
		updateShopDOM()
        x.style.display = "block";
		paused = true
    } else {
        x.style.display = "none";
		paused = false
    }
}

function boostRange() {
	player.range += shop.rangeBoostAmount
	money -= shop.rangePrice
	shop.rangePrice = Math.floor((shop.rangePrice + 1) * 1.1)
	shop.rangeLevel += 1
	updateShopDOM()
}

function boostDamage() {
	player.damage += 1
	shop.damagePrice = Math.floor((shop.damagePrice + 1) * 1.1)
	shop.damageLevel = shop.damageLevel + 1
	updateShopDOM()
}

function boostSpeed() {
	player.velocity += 0.5
}