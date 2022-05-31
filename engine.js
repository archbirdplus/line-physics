
var DEBUG = false;

// radius, first position, position
function HitBall(r, o, p) {
    this.r = r
    this.o = o
    this.p = p
}

function Shape(verts) {
    var lines = []
    for(var i = 1; i < verts.length/2; i++) {
        lines.push(new HitLine(verts[i*2-2], verts[i*2-1], verts[i*2], verts[i*2+1]))
    }
    return lines
}

/*function World(shapes) {
    this.lines = shapes.joined() // shapes are arrays of lines
}*/
function World(lines) {
    this.lines = lines
}

function coalesceNaN() {
    var i = 0;
    while(i < arguments.length && isNaN(arguments[i++])) {}
    return arguments[i-1]; // sus minus
}

// hitline stretching from m to n, preventing travel from left to right
function HitLine(mx, my, nx, ny) {
    this.m = new PVector(mx, my)
    this.n = new PVector(nx, ny)
}

var otherSketchProc = function(processingInstance) {
 with (processingInstance) {

    PVector.prototype.normalized = function() {
        var tmp = this.get()
        tmp.normalize()
        return tmp
    }

    HitLine.prototype.slope = function() {
        return (this.n.y-this.m.y)/(this.n.x-this.m.x);
    };
    HitLine.prototype.normal = function() {
        let u = PVector.sub(this.m, this.n).normalized()
        return new PVector(-u.y, u.x)
    }
    // whether the position is within the range of the line
    //HitLine.prototype.inside = function(p) {
        //return (p.x - this.n.x) * (p.x - this.m.x) < 0 ||
               //(p.y - this.n.y) * (p.y - this.m.y) < 0;
    //};

    HitLine.prototype.planify = function(v) {
        let d = PVector.sub(this.n, this.m)
        let p = PVector.sub(v, this.m)
        let nh = d.normalized()
        let x = p.x*nh.x + p.y*nh.y
        let y = -p.x*nh.y + p.y*nh.x
        return new PVector(x, y)
    }

    HitLine.prototype.deplanify = function(p) {
        let d = PVector.sub(this.n, this.m)
        let nh = d.normalized()
        let x = p.x*nh.x - p.y*nh.y
        let y = p.x*nh.y + p.y*nh.x
        return PVector.add(new PVector(x, y), this.m)
    }

    HitLine.prototype.collision = function(b) {
        // planify everything
        let m = new PVector(0, 0)
        let n = new PVector(PVector.sub(this.n, this.m).mag(), 0)
        let o = this.planify(b.o)
        let p = this.planify(b.p)
        let d = PVector.sub(p, o)
        // ignore jumps from below
        if(d.y < 0) { return { } }
        let r = b.r
        var collision = { t: undefined, p: undefined }

        A: {
            let t = (-r - o.y)/d.y
            if(abs(t) == 1/0) { break A } // doenst matter, no collision
            if(t <= 0 || t > 1) { break A }
            let x = o.x + t*d.x
            if(!(0 < x && x < n.x)) { break A }
            if(t < collision.t || collision.t == undefined) {
                collision = {
                    t: t,
                    p: new PVector(x, 0)
                }
            }
        }

        B: {
            let a = d.x*d.x + d.y*d.y
            let b = 2*(o.x*d.x + o.y*d.y)
            let c = o.x*o.x + o.y*o.y - r*r

            if(b*b - 4*a*c < 0) { break B }

            t1: {
                let t = (-b - sqrt(b*b - 4*a*c)) / (2*a)
                if(t <= 0 || t > 1) { break t1 }
                let col = PVector.add(o, PVector.mult(d, t))
                if(!(col.y < 0 && col.x < 0)) { break t1 }
                if(t < collision.t || collision.t == undefined) {
                    collision = {
                        t: t,
                        p: m
                    }
                }
            }

            t2: {
                let t = (-b + sqrt(b*b - 4*a*c)) / (2*a)
                if(t <= 0 || t > 1) { break t2 }
                let col = PVector.add(o, PVector.mult(d, t))
                if(!(col.y < 0 && col.x < 0)) { break t2 }
                if(t < collision.t || collision.t == undefined) {
                    collision = {
                        t: t,
                        p: m
                    }
                }
            }
        }

        C: {

            let op = PVector.sub(o, n)
            let a = d.x*d.x + d.y*d.y
            let b = 2*(op.x*d.x + op.y*d.y)
            let c = op.x*op.x + op.y*op.y - r*r

            if(b*b - 4*a*c < 0) { break C }

            t1: {
                let t = (-b - sqrt(b*b - 4*a*c)) / (2*a)
                if(t <= 0 || t > 1) { break t1 }
                let col = PVector.add(op, PVector.mult(d, t))
                if(!(col.y < 0 && col.x > 0)) { break t1 }
                if(t < collision.t || collision.t == undefined) {
                    collision = {
                        t: t,
                        p: n
                    }
                }
            }

            t2: {
                let t = (-b + sqrt(b*b - 4*a*c)) / (2*a)
                if(t <= 0 || t > 1) { break t2 }
                let col = PVector.add(op, PVector.mult(d, t))
                if(!(col.y < 0 && col.x < 0)) { break t2 }
                if(t < collision.t || collision.t == undefined) {
                    collision = {
                        t: t,
                        p: n
                    }
                }
            }
        }

        if(collision.t < 0 || collision.t > 1) { assert(false) }
        if(collision.t == undefined) {
            return { }
        } else {
            return {
                t: collision.t,
                p: this.deplanify(collision.p)
            }
        }
    }



































    HitLine.prototype.directlyNormal = function(pp) {
        // rotate point p about m "by" n
        // such that n lays horizontal (0, 0) to (mag, 0)
        let d = PVector.sub(this.n, this.m)
        let nh = d.normalized();
        let p = PVector.sub(pp, this.m);
        let rx = p.x*nh.x + p.y*nh.y;
        return 0 <= rx && rx <= d.mag()
    }
    // more like positive intersect
    HitLine.prototype.signedDistance = function(pp) {
        if(DEBUG) {
            fill(0);
            text("inside", this.m.x, this.m.y);
        }
        let d = PVector.sub(this.n, this.m)
        var nh = d.normalized();
        var p = PVector.sub(pp, this.m);
        //var mVertexCheckP = PVector.add(p, PVector.mult(nh, -20));
        let rx = p.x*nh.x + p.y*nh.y;
        if(this.directlyNormal(pp)) {
            // left of line? is whether rotated p is above horizontal
            var sd = -p.x*nh.y + p.y*nh.x
            return -sd
        } else {
            return min(PVector.sub(pp, this.m).mag(), PVector.sub(pp, this.n).mag())
        }
    };
    HitLine.prototype.nearestPoint = function(p) {
        var s = this.slope()
        var x = abs(s) === 1/0 ? this.m.x : (this.m.x * s*s + p.y*s + p.x - this.m.y*s)/(1 + s*s)
        var y = abs(s) === 1/0 ? p.y : (s*s*p.y + s*p.x - s*this.m.x + this.m.y)/(1 + s*s) // idk how s = 0 works
        // idk how to prove the p.y in the definition of y but it feels correct
        return new PVector(x, y)
    }
    HitLine.prototype.render = function() {
        line(this.m.x, this.m.y, this.n.x, this.n.y);
    }

    World.prototype.render = function() {
        this.lines.forEach(l => l.render())
    }

    World.prototype.collision = function(b) {
        var cols = this.lines.map(l => l.collision(b))
            //.min((a, b) => a.t < b.t)
            .filter(col => col.t != undefined)
        return cols.length === 0 ? { } : cols.reduce(function (a, b) {
            return ( a.t > b.t ? b : a );
        });
    }

}}

