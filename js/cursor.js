 const cursorSketch = (p) => {
    let particles = [];
    const numParticles = 300;
    let lastMouseX = 0, lastMouseY = 0;
    let lastMoveTime = 0;
    const idleThreshold = 2000;

    p.setup = () => {
        let canvas = p.createCanvas(p.windowWidth, p.windowHeight);
        canvas.parent('p5-cursor'); 
        for (let i = 0; i < numParticles; i++) {
            particles.push(new Particle(p.width / 2, p.height / 2));
        }
    };

    p.draw = () => {
        p.clear(); 
        
        if (p.mouseX !== lastMouseX || p.mouseY !== lastMouseY) {
            lastMoveTime = p.millis();
            lastMouseX = p.mouseX; lastMouseY = p.mouseY;
        }

        let isIdle = (p.millis() - lastMoveTime) > idleThreshold;
        let idleDuration = isIdle ? (p.millis() - lastMoveTime - idleThreshold) : 0;

        for (let pt of particles) {
            if (isIdle) pt.scatter(idleDuration);
            else pt.arrive(p.createVector(p.mouseX, p.mouseY));
            pt.update(isIdle);
            pt.show();
        }

        if (!isIdle) {
            p.noStroke();
            p.fill('#D5B942');
            p.rectMode(p.CENTER);
            p.rect(p.mouseX, p.mouseY, 4, 4);
            p.fill(255, 255, 255, 200);
            p.rect(p.mouseX, p.mouseY, 2, 2);
        }
    };

    p.windowResized = () => { p.resizeCanvas(p.windowWidth, p.windowHeight); };

    class Particle {
        constructor(x, y) {
            this.pos = p.createVector(x, y);
            this.vel = p.createVector(p.random(-1, 1), p.random(-1, 1));
            this.acc = p.createVector(0, 0);
            this.r = p.random(1.5, 2.5);
            this.maxSpeed = p.random(20, 35);
            this.maxForce = p.random(4.0, 6.0);
            this.noiseOffset = p.random(10000);
        }

        arrive(target) {
            let desired = p5.Vector.sub(target, this.pos);
            let d = desired.mag();
            let speed = (d < 40) ? p.map(d, 0, 40, 0, this.maxSpeed) : this.maxSpeed;
            desired.setMag(speed);
            let steer = p5.Vector.sub(desired, this.vel);
            steer.limit(this.maxForce);
            this.applyForce(steer);
        }

        scatter(idleTime) {
            let spreadFactor = p.map(p.min(idleTime, 5000), 0, 5000, 0.5, 4);
            let n = p.noise(this.pos.x * 0.005, this.pos.y * 0.005, this.noiseOffset + p.millis() * 0.0005);
            let angle = n * p.TWO_PI * 4;
            let noiseForce = p5.Vector.fromAngle(angle);
            noiseForce.mult(spreadFactor * 0.4);
            let jitter = p5.Vector.random2D();
            jitter.mult(spreadFactor * 0.5);
            this.applyForce(noiseForce);
            this.applyForce(jitter);
            this.vel.mult(0.9);
        }

        applyForce(force) { this.acc.add(force); }
        update(isIdle) {
            this.vel.add(this.acc);
            this.vel.limit(isIdle ? 6 : this.maxSpeed);
            this.pos.add(this.vel);
            this.acc.mult(0);
        }
        show() {
            p.noStroke();
            p.fill(213, 185, 66, 180); 
            p.rectMode(p.CENTER);
            p.rect(this.pos.x, this.pos.y, this.r, this.r);
        }
    }
};
new p5(cursorSketch);
