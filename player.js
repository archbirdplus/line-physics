
function Player() {
    this.p = new PVector(200, 0)
    this.v = new PVector(0, 0)
    this.r = 20
    this.jumpNormal = undefined
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
            this.x = 200;
            this.y = 0;
            this.vx = 0;
            this.vy = 0;
        }
        var pp = this.p.get()
        if(keys[LEFT]) { this.v.x -= 0.1 }
        if(keys[RIGHT]) { this.v.x += 0.1 }
        if(keys[UP] && this.jumpNormal !== undefined) {
            //this.v.add(PVector.mult(this.jumpNormal, 3))
            //if(PVector.dot(this.v, this.jumpNormal) < 0) {
                this.v.add(PVector.mult(this.jumpNormal, this.v.mag()+3))
            //} else {
                //this.v.add(PVector.mult(this.jumpNormal, 3))
            //}
            this.jumpNormal = undefined
        }
        this.v.add(new PVector(0, 0.1))
        let c = 0.47
        let v = this.v.mag()
        let m = 10000
        this.v.sub(PVector.mult(this.v, c*v/m)) // F_air = c v v
        this.p.add(this.v)
        this.hitBall = new HitBall(this.r, pp, this.p)
    }
    Player.prototype.collide = function(col) {
        let b = this.hitBall
        let pp = PVector.add(PVector.mult(PVector.sub(b.p, b.o), max(col.t, 0)), b.o) // point of bounce
        this.p = pp.get()
        let normal = PVector.sub(this.p, col.p).normalized()
        var speed = -PVector.dot(this.v.normalized(), normal) * this.v.mag() * 1.5;
        this.v.add(PVector.mult(normal, speed))
        this.p.add(PVector.mult(this.v, 1-col.t))
        this.jumpNormal = normal
        this.hitBall = new HitBall(this.r, pp, this.p)
    }
    Player.prototype.haltCollide = function() { this.p = this.hitBall.o }
    Player.prototype.render = function() {
        strokeWeight(2);
        stroke(0)
        noFill();
        ellipse(this.p.x, this.p.y, this.r*2, this.r*2);
        if(DEBUG) {
            line(this.p.x, this.p.y, this.p.x+this.v.x*10, this.p.y+this.v.y*10)
        }
    }
}};

