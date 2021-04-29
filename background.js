var w = window.innerWidth;
var h = window.innerHeight;
var c = document.getElementById("backgroundCanvas");
var ctxb = c.getContext("2d");
ctxb.canvas.width  = w;
ctxb.canvas.height = h;
ctxb.imageSmoothingEnabled = false;

const TILE_SIZE = 32
var mapTileHeight = Math.floor(h/TILE_SIZE) + 1
var mapTileWidth = Math.floor(w/TILE_SIZE) + 1

// Sprite Map
const TERRAIN = new Image();
TERRAIN.src = 'terrain.png'

// Sprite Coordinates
const GRASS = [1, 9]
const GRASS_LONG = [0, 11]
const GRASS_MEDIUM = [1, 11]
const GRASS_SHORT = [2, 11]
const GRASS_FLOWER1 = [3, 11]
const GRASS_FLOWER2 = [4, 11]
const GRASS_FLOWER3 = [5, 11]



const COBBLE1 = [1, 3]
const COBBLE1_VARIENT1 = [0, 5]
const COBBLE1_VARIENT2 = [1, 5]
const COBBLE1_VARIENT3 = [2, 5]
const COBBLE1_1 = [0 , 4]
const COBBLE1_2 = [1 , 4]
const COBBLE1_3 = [2 , 4]
const COBBLE1_4 = [0 , 3]
const COBBLE1_6 = [2, 3]
const COBBLE1_7 = [0 , 2]
const COBBLE1_8 = [1 , 2]
const COBBLE1_9 = [2 , 2]
const COBBLE1_INNER_TOP_LEFT = [1, 0]
const COBBLE1_INNER_TOP_RIGHT = [2, 0]
const COBBLE1_INNER_BOTTOM_LEFT = [1, 1]
const COBBLE1_INNER_BOTTOM_RIGHT = [2, 1]


const COBBLE2 = [4, 3]



const COBBLE3 = [7, 3]
const COBBLE4 = [10, 3]
const COBBLE5 = [13, 3]
const LAVA = [15, 3]

// Create Map
var borderMap = []
for (let i  = 0; i < mapTileWidth; i++) {
    let row = []
    for (let j  = 0; j < mapTileHeight; j++) {
        row.push(null)
    }
    borderMap.push(row)
}

// Create Map
var map = []
for (let i  = 0; i < mapTileWidth; i++) {
    let row = []
    for (let j  = 0; j < mapTileHeight; j++) {
        row.push(GRASS)
    }
    map.push(row)
}


// Add Random Seeds
function getRandomInt(max) {
	return Math.floor(Math.random() * Math.floor(max));
}

function chance(percent) {
    let c = Math.random();
    if (c < percent) {
        return true
    }
    return false
}

function addVarient(varientChance, base, varient) {
    for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map[i].length; j++) {
            if ((map[i][j] == base) && chance(varientChance) && (borderMap[i][j] == null)) {
                map[i][j] = varient
            }
        }
    }
}

function grow(base, spreadChance, itterations) {
    for (let a = 0; a < itterations; a++) {
        // Map Buffer
        var mBuf = []
        for (let i  = 0; i < mapTileWidth; i++) {
            let row = []
            for (let j  = 0; j < mapTileHeight; j++) {
                row.push(0)
            }
            mBuf.push(row)
        }

        // Spread To Buffer
        for (let i = 0; i < map.length; i++) {
            for (let j = 0; j < map[i].length; j++) {
                if (map[i][j] == base) {
                    if ((i > 0) && chance(spreadChance)) {
                        mBuf[i - 1][j] = base
                    }
                    if ((i < mapTileWidth - 1) && chance(spreadChance)) {
                        mBuf[i + 1][j] = base
                    }
                    if ((j > 0) && chance(spreadChance)) {
                        mBuf[i][j - 1] = base
                    }
                    if ((j < mapTileHeight - 1) && chance(spreadChance)) {
                        mBuf[i][j + 1] = base
                    }
                }
            }
        }

        // Apply Buffer to Map
        for (let i = 0; i < map.length; i++) {
            for (let j = 0; j < map[i].length; j++) {
                if (mBuf[i][j] != 0) {
                    map[i][j] = mBuf[i][j]
                }
            }
        }
    }

}

function addBorders() {
    for (let a = 0; a < 4; a++) {
        // Check for three sided borders
        for (let i = 0; i < map.length; i++) {
            for (let j = 0; j < map[i].length; j++) {
                let count = 0
                // Check Left
                if ((i > 0) && (map[i - 1][j] == COBBLE1)) {
                    count += 1
                }
                // Check Right
                if ((i < mapTileWidth - 1) && (map[i + 1][j] == COBBLE1)) {
                    count += 1
                }
                // Check Top
                if ((j > 0) && (map[i][j - 1] == COBBLE1)) {
                    count += 1
                }
                // Check Bottom
                if ((j < mapTileHeight - 1) && (map[i][j + 1] == COBBLE1)) {
                    count += 1
                }
                // Fill Square
                if (count >= 3) {
                    map[i][j] = COBBLE1
                }

                // Top Bottom
                if ((j > 0) && (map[i][j - 1] == COBBLE1) && (j < mapTileHeight - 1) && (map[i][j + 1] == COBBLE1)) {
                    map[i][j] = COBBLE1
                }

                // Left Right
                if ((i > 0) && (map[i - 1][j] == COBBLE1) && (i < mapTileWidth - 1) && (map[i + 1][j] == COBBLE1)) {
                    map[i][j] = COBBLE1
                }

                // Check If not on edge
                if ((i > 0) && (i < mapTileWidth - 1) && (j > 0) && (j < mapTileHeight - 1)) {
                    // TOP LEFT, BOTTOM RIGHT
                    if ((map[i - 1][j] == COBBLE1) && (map[i][j - 1] == COBBLE1) && (map[i + 1][j + 1] == COBBLE1)) {
                        map[i][j] = COBBLE1
                    }

                    // TOP RIGHT, BOTTOM Left
                    if ((map[i + 1][j] == COBBLE1) && (map[i][j - 1] == COBBLE1) && (map[i - 1][j + 1] == COBBLE1)) {
                        map[i][j] = COBBLE1
                    }

                    // Top Left & Bottom Right
                    if ((map[i - 1][j - 1] == COBBLE1) && (map[i + 1][j + 1] == COBBLE1)) {
                        map[i][j] = COBBLE1
                    }

                    // Top Right & Bottom Left
                    if ((map[i + 1][j - 1] == COBBLE1) && (map[i - 1][j + 1] == COBBLE1)) {
                        map[i][j] = COBBLE1
                    }
                }


                // Top Double Bottom
                if ((j > 2) && (map[i][j - 2] == COBBLE1) && (j < mapTileHeight - 1) && (map[i][j + 1] == COBBLE1)) {
                    map[i][j] = COBBLE1
                    map[i][j - 1] = COBBLE1
                }

                // Left Double Right
                if ((i > 2) && (map[i - 2][j] == COBBLE1) && (i < mapTileWidth - 1) && (map[i + 1][j] == COBBLE1)) {
                    map[i][j] = COBBLE1
                    map[i - 1][j] = COBBLE1
                }
            }
        }
    }



    for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map[i].length; j++) {
            if(map[i][j] != COBBLE1) {
                // C H E C K   O N L Y   C O R N E R S
                // Check if only above and left
                if ((j > 0) && (i > 0)) {
                    if ((map[i - 1][j - 1] == COBBLE1)) {
                        borderMap[i][j] = COBBLE1_3
                    } 
                }

                // Check if only above and right
                if ((j > 0) && (i < mapTileWidth - 1)) {
                    if ((map[i + 1][j - 1] == COBBLE1)) {
                        borderMap[i][j] = COBBLE1_1
                    } 
                }

                // Check if only bellow and right
                if ((j < mapTileHeight - 1) && (i < mapTileWidth - 1)) {
                    if ((map[i + 1][j + 1] == COBBLE1)) {
                        borderMap[i][j] = COBBLE1_7
                    } 
                }

                // Check if only bellow and left
                if ((j < mapTileHeight - 1) && (i > 0)) {
                    if ((map[i - 1][j + 1] == COBBLE1)) {
                        borderMap[i][j] = COBBLE1_9
                    } 
                }

                // C H E C K   S I D E S
                // Check if on below
                if (j < mapTileHeight - 1) {
                    if (map[i][j + 1] == COBBLE1) {
                        borderMap[i][j] = COBBLE1_8
                    } 
                }

                // Check if on right
                if (i < mapTileWidth - 1) {
                    if (map[i + 1][j] == COBBLE1) {
                        borderMap[i][j] = COBBLE1_4
                    } 
                }

                // Check if on left
                if (i > 0) {
                    if (map[i - 1][j] == COBBLE1) {
                        borderMap[i][j] = COBBLE1_6
                    } 
                }
                // Check if above
                if (j > 0) {
                    if (map[i][j - 1] == COBBLE1) {
                        borderMap[i][j] = [COBBLE1[0], COBBLE1[1] + 1]
                    } 
                }

                // C H E C K   2   S I D E S
                // Check if below and right
                if ((j < mapTileHeight - 1) && (i < mapTileWidth - 1)) {
                    if ((map[i][j + 1] == COBBLE1) && (map[i + 1][j] == COBBLE1)) {
                        borderMap[i][j] = COBBLE1_INNER_BOTTOM_RIGHT
                    } 
                }

                // Check if below and left
                if ((j < mapTileHeight - 1) && (i > 1)) {
                    if ((map[i][j + 1] == COBBLE1) && (map[i - 1][j] == COBBLE1)) {
                        borderMap[i][j] = COBBLE1_INNER_BOTTOM_LEFT
                    } 
                }

                // Check if above and Left
                if ((j > 0) && (i > 0)) {
                    if ((map[i][j - 1] == COBBLE1) && (map[i - 1][j] == COBBLE1)) {
                        borderMap[i][j] = COBBLE1_INNER_TOP_LEFT
                    } 
                }

                // Check if above and Right
                if ((j > 0) && (i < mapTileWidth - 1)) {
                    if ((map[i][j - 1] == COBBLE1) && (map[i + 1][j] == COBBLE1)) {
                        borderMap[i][j] = COBBLE1_INNER_TOP_RIGHT
                    } 
                }

                

              
            }
        }
    }
}


// Add Cobble
addVarient(.01, GRASS, COBBLE1)
grow(COBBLE1, .8, 3)
addBorders()
// Add Grass Varients
// const GRASS_LONG = [0, 11]
// const GRASS_MEDIUM = [1, 11]
// const GRASS_SHORT = [2, 11]
// const GRASS_FLOWER1 = [3, 11]
// const GRASS_FLOWER2 = [4, 11]
// const GRASS_FLOWER3 = [5, 11]
// addVarient(.05, GRASS, GRASS_LONG)

addVarient(.1, GRASS, GRASS_SHORT)
addVarient(.05, GRASS, GRASS_MEDIUM)
addVarient(.01, GRASS, GRASS_LONG)
addVarient(.002, GRASS, GRASS_FLOWER1)
addVarient(.002, GRASS, GRASS_FLOWER2)
addVarient(.002, GRASS, GRASS_FLOWER3)


// Add Cobble Varients
addVarient(.02, COBBLE1, COBBLE1_VARIENT1)
addVarient(.05, COBBLE1, COBBLE1_VARIENT2)
addVarient(.5, COBBLE1, COBBLE1_VARIENT3)





function drawTile(map, x, y) {
    if (map[x][y] != null) {
        ctxb.drawImage(TERRAIN, 
            32 * map[x][y][0],
            32 * map[x][y][1],
            32,
            32,
            x * TILE_SIZE, // X Position
            y * TILE_SIZE, // Y Position
            TILE_SIZE, // Image Height
            TILE_SIZE// Image Width)
        )
    }
}


TERRAIN.onload = function() {
    for (let i  = 0; i < mapTileWidth; i++) {
        for (let j  = 0; j < mapTileHeight; j++) {
            drawTile(map, i, j)
            drawTile(borderMap, i, j)
        }
    }    

}
