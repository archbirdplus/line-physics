var sketchProc = function(processingInstance) {
 with (processingInstance) {
    size(400, 400); 
    frameRate(60);

var DEBUG = false;

function coalesceNaN() {
    var i = 0;
    while(i < arguments.length && isNaN(arguments[i++])) {}
    return arguments[i-1]; // sus minus
}

PVector.prototype.normalized = function() {
    var tmp = this.get();
    tmp.normalize();
    return tmp;
};

// hitline stretching from m to n, preventing travel from left to right
function HitLine(mx, my, nx, ny) {
    this.m = new PVector(mx, my);
    this.n = new PVector(nx, ny);
}
HitLine.prototype.slope = function() {
    return (this.n.y-this.m.y)/(this.n.x-this.m.x);
};
// whether the position is within the range of the line
HitLine.prototype.inside = function(p) {
    return (p.x - this.n.x) * (p.x - this.m.x) < 0 ||
           (p.y - this.n.y) * (p.y - this.m.y) < 0;
};
// more like positive intersect
HitLine.prototype.signedDistance = function(pp) {
    if(!this.inside(pp)) {
        return min(PVector.sub(pp, this.m).mag(), PVector.sub(pp, this.n).mag());
    }
    if(DEBUG) {
        fill(0);
        text("inside", this.m.x, this.m.y);
    }
    var nh = PVector.sub(this.n, this.m).normalized();
    var p = PVector.sub(pp, this.m);
    var mVertexCheckP = PVector.add(p, PVector.mult(nh, -20));
    var sd = -p.x*nh.y + p.y*nh.x;
    return -sd;
};
HitLine.prototype.render = function() {
    line(this.m.x, this.m.y, this.n.x, this.n.y);
};
HitLine.prototype.nearestPoint = function(p) {
    var s = this.slope();
    var x = abs(s) === 1/0 ? this.m.x : (this.m.x * s*s + p.y*s + p.x - this.m.y*s)/(1 + s*s);
    var y = abs(s) === 1/0 ? p.y : (s*s*p.y + s*p.x - s*this.m.x + this.m.y)/(1 + s*s); // idk how s = 0 works
    // idk how to prove the p.y in the definition of y but it feels correct
    return new PVector(x, y);
};

var lines = [
    new HitLine(1, 1, 1, 399),
    new HitLine(1, 399, 399, 399),
    new HitLine(399, 399, 399, 1),
    new HitLine(399, 1, 1, 1),
    new HitLine(100, 100, 350, 250), // x
    new HitLine(150, 300, 330, 150), // x
    new HitLine(120, 400, 120, 350), // bottom box
    new HitLine(120, 350, 280, 350), // bottom box
    new HitLine(280, 350, 280, 400), // bottom box
];

var x = 200;
var y = 5;
var vx = 0;
var vy = 0;
var r = 20;
var contact = false;

var keys = [];
keyPressed = function() {
    keys[keyCode] = true;
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
    if(keys[UP] && (contact || vy > 0)) { vy = -1; }
    vy += 0.01;
    var px = x;
    var py = y;
    x += vx;
    y += vy;
    var pp = new PVector(px, py);
    var p = new PVector(x, y);
    contact = false;
    lines.forEach(function(l) {
        var d = l.signedDistance(p);
        strokeWeight(1);
        if(DEBUG) {
            stroke(-(d-r)*5, (d-r)*5, 0);
        }
        l.render();
        //var nearest = l.nearestPoint(new PVector(mouseX, mouseY));
        //strokeWeight(5);
        //stroke(255, 0, 0);
        //point(nearest.x, nearest.y);
        
        if(l.inside(pp) && l.inside(p) && l.signedDistance(pp) - r >= 0 && d - r < 0) {
            var nearest = l.nearestPoint(p);
            var s = 1/l.slope();
            //var dx = (s === 1/0 || !(isFinite(s))) ? 0 : abs(sqrt(1/(1+s*s)))*(s > 0 ? 1 : -1);
            //var dy = (s === 1/0 || !(isFinite(s))) ? 1 : abs(dx*s)*-1;
            //if(isNaN(dx) || dx === 1/0) { println("dx"); }
            //if(isNaN(dy) || dy === 1/0) { println("dy" + (s === 1/0)); }
            var normal = PVector.sub(l.m, l.n).normalized();
            var dx = -normal.y;
            var dy = normal.x;
            var e = 0.1;
            x = nearest.x + dx*(r+e);
            y = nearest.y + dy*(r+e);
            var speed = -PVector.dot(new PVector(vx, vy).normalized(), new PVector(dx, dy)) * sqrt(vx*vx+vy*vy);
            vx += dx*speed;
            vy += dy*speed;
            if(DEBUG) {
                stroke(255, 0, 0);
                strokeWeight(3);
                line(x, y, l.m.x, l.m.y);
                stroke(0, 0, 255);
                strokeWeight(1);
                line(x, y, x+dx*(r+e), y+dy*(r+e));
            }
            contact = true;
        }
    });
    stroke(0);
    strokeWeight(2);
    noFill();
    ellipse(x, y, r*2, r*2);
    if(DEBUG) { line(x, y, x+vx*10, y+vy*10); }
};


    }};


    // Get the canvas that Processing-js will use
    var canvas = document.getElementById("mycanvas"); 
    // Pass the function sketchProc (defined in myCode.js) to Processing's constructor.
    var processingInstance = new Processing(canvas, sketchProc); 
