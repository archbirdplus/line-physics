var sketchProc = function(processingInstance) {
 with (processingInstance) {
    otherSketchProc(processingInstance)
    playerProc(processingInstance)
    cameraProc(processingInstance)
    size(1000, 1000)
    frameRate(60)

var world = new World(savelines)

let player = new Player()
let camera = new Camera(player.p)

var pause = false

var hold = { }
// a/A
// key: 65, shifted: false, start: PVector? // on provide end no hold
// key: 65, shifted: true, start: PVector

// x/X
// key: 88, shifted: false
// key: 88, shifted: true

mouseClicked = function() {
    var gameMouse = camera.fromScreenSpace(new PVector(mouseX, mouseY))
    if(keys[SHIFT] && world.lines.length > 0) {
        gameMouse = world.lines.flatMap(l => [l.m, l.n]).reduce((a, b) => dist(a.x, a.y, gameMouse.x, gameMouse.y) < dist(b.x, b.y, gameMouse.x, gameMouse.y) ? a : b)
    }
    switch(hold.key) {
    case 65:
        if(hold.start === undefined) { hold.start = gameMouse }
        else {
            let l = new HitLine(hold.start.x, hold.start.y, gameMouse.x, gameMouse.y)
            world.lines.push(l)
            if(hold.shifted) { hold.start = gameMouse }
            else { hold = { } }
        }
        break
    case 88:
        if(world.lines.length === 0) { break }
        //var index = world.lines.map((x, n) => { d: x.unsignedDistance(gameMouse), i: n })
        var index = world.lines.map(function(x, n) { return { d: x.unsignedDistance(gameMouse), i: n } })
            .reduce((a, b) => a.d < b.d ? a : b).i
        world.lines.splice(index, 1)
        if(hold.shifted) { } else { hold = { } }
    }
}

keyPressed = function() {
    keys[keyCode] = true;
    if(keyCode === 68) { DEBUG = !DEBUG; } // d
    //if(keyCode === 78 && pselect) { // n
        //world.lines.push(new HitLine(pselect.x, pselect.y, mouseX, mouseY))
    //}
    if(keyCode === 65) { // a
        hold = { key: 65, shifted: keys[SHIFT], start: undefined }
    }
    if(keyCode === 88) { // x
        hold = { key: 88, shifted: keys[SHIFT] }
    }
    if(keyCode === 187) { // + (zoom in)
        camera.scale *= 1.2
    }
    if(keyCode === 189) { // - (zoom out)
        camera.scale /= 1.2
    }
    if(keyCode === 48) { // 0
        camera.scale = 1
    }
    if(keyCode === 80) { // p
        console.log("[" + world.lines.map(l => "new HitLine(" + l.m.x + "," + l.m.y + "," + l.n.x + "," + l.n.y + ")").join(",") + "]")
    }
    if(keyCode === 32) { // space
        pause = !pause
    }
};
document.onkeydown = function(e) { if(e.key === "Escape") { hold = { } } }

keyReleased = function() {
    keys[keyCode] = false;
};

draw = function() {
    var gameMouse = camera.fromScreenSpace(new PVector(mouseX, mouseY))
    if(keys[SHIFT] && world.lines.length > 0) {
        gameMouse = world.lines.flatMap(l => [l.m, l.n]).reduce((a, b) => dist(a.x, a.y, gameMouse.x, gameMouse.y) < dist(b.x, b.y, gameMouse.x, gameMouse.y) ? a : b)
    }

    background(255);

    if(!pause) {
        player.tick()
        let b = player.hitBall
        let col = world.collision(b)
        if(col.t !== undefined) { player.collide(col) }
        else { player.noCollide() }
    }

    camera.follow(player.p)
    camera.pushMatrix()

    stroke(0)
    strokeWeight(2/sqrt(camera.scale))
    world.render()

    strokeWeight(1)
    player.render()

    noFill()
    stroke(0)
    strokeWeight(1/camera.scale)
    var curSize = 10/camera.scale

    switch(hold.key) {
    case 65:
        var start = hold.start || gameMouse
        noFill()
        stroke(0, 0, 255)
        ellipse(start.x, start.y, curSize, curSize)
        line(start.x, start.y, gameMouse.x, gameMouse.y)
        var center = PVector.mult(PVector.add(gameMouse, start), 1/2)
        var diff = PVector.sub(gameMouse, start)
        var normal = PVector.mult(new PVector(diff.y, -diff.x).normalized(), curSize*3)
        line(center.x, center.y, center.x + normal.x, center.y + normal.y)
        break
    case 88:
        if(world.lines.length === 0) { break }
        //var index = world.lines.map(x, n => { d: x.unsignedDistance(gameMouse), i: n })
        var index = world.lines.map(function(x, n) { return { d: x.unsignedDistance(gameMouse), i: n } })
            .reduce((a, b) => a.d < b.d ? a : b).i
        var l = world.lines[index]
        stroke(255, 0, 0)
        var center = PVector.mult(PVector.add(l.n, l.m), 1/2)
        var diff = PVector.sub(l.n, l.m)
        var normal = PVector.mult(new PVector(diff.y, -diff.x).normalized(), curSize*3)
        line(center.x, center.y, center.x + normal.x, center.y + normal.y)
        line(l.m.x, l.m.y, l.n.x, l.n.y)
    }

    camera.popMatrix()

    var status = { 65: (hold.shifted === true) ? "Append" : "append", 88: (hold.shifted === true) ? "Delete" : "delete" }[hold.key]
    if(status) {
        fill(0)
        textAlign(LEFT, TOP)
        text(status, 10, 10)
    }
    stroke(0, 255, 0)

    if(DEBUG) {
        fill(0)
        text(this.__frameRate, 20, 20)
        text(world.lines.length + " lines", 20, 35)
    }
};


levelpaste = function() {
    document.getElementById("mytextarea").innerHTML = "var savelines = [" + world.lines.map(l => "new HitLine(" + l.m.x + "," + l.m.y + "," + l.n.x + "," + l.n.y + ")").join(",") + "]"
}

    }};

var levelpaste

function focusCanvas() {
    console.log("focusing?")
    document.getElementById("mycanvas").focus()
}

// Get the canvas that Processing-js will use
var canvas = document.getElementById("mycanvas"); 
// Pass the function sketchProc (defined in myCode.js) to Processing's constructor.
var processingInstance = new Processing(canvas, sketchProc); 




