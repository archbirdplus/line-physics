var sketchProc = function(processingInstance) {
 with (processingInstance) {
    otherSketchProc(processingInstance)
    playerProc(processingInstance)
    size(400, 400)
    frameRate(60)

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

var pause = false

var hold = { }
// key: 65, shifted: false, start: PVector? // on provide end no hold
// key: 65, shifted: true, start: PVector

mouseClicked = function() {
    var mouse = new PVector(mouseX, mouseY)
    if(hold.key === 65) { // a
        if(hold.start === undefined) { hold.start = mouse }
        else {
            let line = new HitLine(hold.start.x, hold.start.y, mouse.x, mouse.y)
            world.lines.push(line)
            if(hold.shifted) { hold.start = mouse }
            else { hold = { } }
        }
    }
}

keyPressed = function() {
    keys[keyCode] = true;
    //if(keyCode === 68) { DEBUG = !DEBUG; } // d
    //if(keyCode === 78 && pselect) { // n
        //world.lines.push(new HitLine(pselect.x, pselect.y, mouseX, mouseY))
    //}
    if(keyCode === 65) { // a
        hold = { key: 65, shifted: keys[SHIFT], start: undefined }
    }
    if(key.key === "Escape") { // esc
        hold = { }
    }
};
document.onkeydown = function(e) { if(e.key === "Escape") { hold = { } } }

keyReleased = function() {
    keys[keyCode] = false;
};

draw = function() {
    var mouse = new PVector(mouseX, mouseY)

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

    noFill()
    stroke(0)
    strokeWeight(1)
    var curSize = 5
    //if(pselect) { ellipse(pselect.x, pselect.y, curSize*2, curSize*2) }
    if(hold.key === 65) {
        var start = hold.start || mouse
        noFill()
        stroke(0, 0, 255)
        ellipse(start.x, start.y, 10, 10)
        line(start.x, start.y, mouseX, mouseY)
    }
    var status = { 65: (hold.shifted === true) ? "Append" : "append" }[hold.key]
    fill(0)
    textAlign(LEFT, TOP)
    text(status, 10, 10)
    //line(mouseX-curSize, mouseY-curSize, mouseX+curSize, mouseY+curSize)
    //line(mouseX-curSize, mouseY+curSize, mouseX+curSize, mouseY-curSize)

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




