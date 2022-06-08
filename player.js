
function Player() {
    this.p = new PVector(200, 0)
    this.v = new PVector(0, 0)
    this.r = 20
    this.contact = false
    this.hitBall = new HitBall(this.r, this.p, this.p)
}

var keys = [];

var playerProc = function(processingInstance) {
 with (processingInstance) {

    keyPressed = function() {
        keys[keyCode] = true;
        if(keyCode === 68) { DEBUG = !DEBUG; } // d
    };
    keyReleased = function() {
        keys[keyCode] = false;
    };

    Player.prototype.tick = function() {
        if(keys[82]) { // r
            x = 200;
            y = 0;
            vx = 0;
            vy = 0;
        }
        var pp = this.p.get()
        if(keys[LEFT]) { this.v.x -= 0.1 }
        if(keys[RIGHT]) { this.v.x += 0.1 }
        if(keys[UP] && (this.contact)) {
            this.v.y = min(this.v.y, 0) - 2
            this.contact = false
        }
        this.v.add(new PVector(0, 0.03))
        this.p.add(this.v)
        this.hitBall = new HitBall(this.r, pp, this.p)
    }
    Player.prototype.collide = function(col) {
        this.contact = true
        let b = this.hitBall
        this.p = PVector.add(PVector.mult(PVector.sub(b.p, b.o), col.t), b.o)
        let normal = PVector.sub(this.p, col.p).normalized()
        var speed = -PVector.dot(this.v.normalized(), normal) * this.v.mag() * 1.5;
        let e = 0.01;
        this.p.add(PVector.mult(normal, e))
        this.v.add(PVector.mult(normal, speed))
        newContact = true;
    }
    Player.prototype.noCollide = function() { }
    Player.prototype.render = function() {
        strokeWeight(2);
        stroke(0)
        if(DEBUG) { if(this.contact) { stroke(255, 0, 255) } }
        noFill();
        ellipse(this.p.x, this.p.y, this.r*2, this.r*2);
        if(DEBUG) {
            line(this.p.x, this.p.y, this.p.x+this.v.x*10, this.p.y+this.v.y*10)
        }
    }
}};

