
var Camera

var cameraProc = function(processingInstance) {
 with (processingInstance) {

    Camera = function(p) {
        this.p = p
        this.v = new PVector(0, 0)
        this.scale = 1
    }

    Camera.prototype.follow = function(p) {
        this.v.add(PVector.mult(PVector.sub(p, this.p), 0.01))
        this.v.mult(0.8)
        this.p.add(this.v)
    }

    Camera.prototype.pushMatrix = function() {
        pushMatrix()
        translate(width/2, height/2)
        scale(this.scale)
        translate(-this.p.x, -this.p.y)
    }

    Camera.prototype.popMatrix = function() {
        popMatrix()
    }

    Camera.prototype.fromScreenSpace = function(p) {
        return PVector.add(PVector.mult(PVector.sub(p, new PVector(width/2, height/2)), 1/this.scale), this.p)
    }
}}
