var sketchProc = function(processingInstance) {
 with (processingInstance) {
    size(400, 400)
    frameRate(60)

    otherSketchProc(processingInstance)
    playerProc(processingInstance)

var world = new World([
    new HitLine(1, 1, 1, 399),
    new HitLine(1, 399, 399, 399),
    new HitLine(399, 399, 399, 1),
    new HitLine(399, 1, 1, 1),
    new HitLine(100, 100, 350, 250), // x
    new HitLine(150, 300, 330, 150), // x
    new HitLine(120, 400, 120, 350), // bottom box
    new HitLine(120, 350, 280, 350), // bottom box
    new HitLine(280, 350, 280, 400), // bottom box
]);

let player = new Player()

keyPressed = function() {
    keys[keyCode] = true;
    if(keyCode === 68) { DEBUG = !DEBUG; } // d
};
keyReleased = function() {
    keys[keyCode] = false;
};

draw = function() {
    background(255);

    player.tick()
    let b = player.hitBall
    let col = world.collision(b)
    if(col.t !== undefined) {
        player.collide(col)
    } else { player.noCollide() }

    stroke(0)
    strokeWeight(1)
    world.render()

    player.render()

    if(DEBUG) {
        fill(0)
        text(this.__frameRate, 20, 20)
    }
};


    }};

function focusCanvas() {
    console.log("focusing?")
    document.getElementById("mycanvas").focus()
}

// Get the canvas that Processing-js will use
var canvas = document.getElementById("mycanvas"); 
// Pass the function sketchProc (defined in myCode.js) to Processing's constructor.
var processingInstance = new Processing(canvas, sketchProc); 


