var sketchProc = function(processingInstance) {
 with (processingInstance) {
    size(400, 400)
    frameRate(60)

    otherSketchProc(processingInstance)

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

var x = 200;
var y = 35;
var vx = 0;
var vy = 0;
var r = 20;
var contact = false;

var keys = [];
keyPressed = function() {
    keys[keyCode] = true;
    if(keyCode === 68) { DEBUG = !DEBUG; } // d
};
keyReleased = function() {
    keys[keyCode] = false;
};

draw = function() {
    background(255);
    if(keys[82]) { // r
        x = 200;
        y = 0;
        vx = 0;
        vy = 0;
    }
    if(keys[LEFT]) { vx -= 0.1; }
    if(keys[RIGHT]) { vx += 0.1; }
    if(keys[UP] && (contact)) { vy = -1; contact = false }
    vy += 0.01;
    var px = x;
    var py = y;
    x += vx;
    y += vy;
    var pp = new PVector(px, py);
    var p = new PVector(x, y);
    var newContact = false;
    var mb = new HitBall(20, new PVector(200, 320), new PVector(mouseX, mouseY))
    let b = new HitBall(r, new PVector(px, py), new PVector(x, y))
    stroke(0)
    strokeWeight(1)
    world.render()
    let col = world.collision(b)
    if(col.t != undefined) {
        //x = col.p.x + dx*(r+e);
        //y = col.p.y + dy*(r+e);
        x = col.t * (b.p.x-b.o.x) + b.o.x
        y = col.t * (b.p.y-b.o.y) + b.o.y
        let normal = PVector.sub(new PVector(x, y), col.p).normalized()
        var speed = -PVector.dot(new PVector(vx, vy).normalized(), normal) * sqrt(vx*vx+vy*vy)*1;
        let e = 0.01;
        x += normal.x*e;
        y += normal.y*e;
        vx += normal.x*speed;
        vy += normal.y*speed;
        newContact = true;
    }
    
    if(newContact) { contact = true }
    stroke(0)
    if(DEBUG) { if(contact) { stroke(255, 0, 255) } }
    strokeWeight(2);
    noFill();
    ellipse(x, y, r*2, r*2);
    if(DEBUG) {
        line(x, y, x+vx*10, y+vy*10)
        if(col.t != undefined) {
            stroke(0, 0, 255)
            strokeWeight(5)
            point(col.p.x, col.p.y)
        }
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


