/* A spin-off of loop subdivision! Wake me up when I learn how to choose colors interestingly. */
let can;
let canw = 800, canh = 800;
let aspectWidth = 1, aspectHeight = 1;

class Triangle {
    constructor(A, B, C, speed, parent, lerpDist, color) {
        this.A = A
        this.B = B
        this.C = C
        this.speed = speed
        this.parent = parent
        this.lerpDist = lerpDist
        this.color = color
    }
}

let arr = [];
let totalTri = 20;

let starth;
let start;
let startt;
let bgcol;

function findCanvSize() {
   let scale = Math.min(windowWidth / aspectWidth, windowHeight / aspectHeight);
   return scale;
}

function windowResized() {
    frameRate(60)
    let size = canh = canw = Math.min(windowWidth, windowHeight);
    starth = Math.sqrt((3*canh)*(3*canh) - (1.5*canw)*(1.5*canw))
    start = [[-1.5*canw, canh], [0, canh-starth], [1.5*canw, canh]]
    startt = new Triangle(start[0], start[1], start[2], pickSpeed(), 0, 0, pickColor())
    can = createCanvas(size, size)
    can.show()
}


function setup() {
    windowResized()
    bgcol = color(pickColor());
    for(let i = 0; i < 2; i++) {
        appendSmallest()
    }
    // print(arr)
}

let base = r = 300;
function draw() {
    background(bgcol)
    startt.color = bgcol
    translate(canw/2, canh/2)

    // The same thing as DrawTriangle, but for start, TODO move to helper
    // let a1 = lerp(start[0][0], start[1][0], arr[0].lerpDist)
    // let a2 = lerp(start[0][1], start[1][1], arr[0].lerpDist)
    // let b1 = lerp(start[1][0], start[2][0], arr[0].lerpDist)
    // let b2 = lerp(start[1][1], start[2][1], arr[0].lerpDist)
    // let c1 = lerp(start[2][0], start[0][0], arr[0].lerpDist)
    // let c2 = lerp(start[2][1], start[0][1], arr[0].lerpDist)
    // arr[0].A = [a1, a2]
    // arr[0].B = [b1, b2]
    // arr[0].C = [c1, c2]
    // arr[0].lerpDist += arr[0].speed
    // arr[0].lerpDist = arr[0].lerpDist % 1;
    // if(arr[0].lerpDist < 0) arr[0].lerpDist += 1;
    // drawTriangle(arr[0])

    // beginShape()
    // let tri = arr[0][0]
    // vertex(tri.A[0], tri.A[1])
    // vertex(tri.B[0], tri.B[1])
    // vertex(tri.C[0], tri.C[1])
    // endShape(CLOSE)

    // beginShape()
    // tri = arr[1][0]
    // fill("lightblue")
    // vertex(tri.A[0], tri.A[1])
    // vertex(tri.B[0], tri.B[1])
    // vertex(tri.C[0], tri.C[1])
    // endShape(CLOSE)

    // beginShape()
    // tri = arr[1][1]
    // fill("red")
    // vertex(tri.A[0], tri.A[1])
    // vertex(tri.B[0], tri.B[1])
    // vertex(tri.C[0], tri.C[1])
    // endShape(CLOSE)


    for(let i=0; i<arr.length; i++){
        for(let split = 0; split < 4; split++) {
            moveTriangle(arr[i][split])
            drawTriangle(arr[i][split])
        }
    }
    let midpoint = [lerp(arr[0][0].A[0], arr[0][0].B[0], 0.5), lerp(arr[0][0].A[1], arr[0][0].B[1], 0.5)]
    let startMidpoint = [lerp(startt.A[0], startt.B[0]), lerp(startt.A[1], startt.B[1], 0.5)]
    if (getDistToOrigin(midpoint) >= getDistToOrigin(startMidpoint)-10) {  // todo: remove bandage
        bgcol = arr[0][0].color;
        replaceLargest();
        appendSmallest();
        arr[0][0].parent = startt
        let m = arr[0][0]
        arr[0][1].parent = new Triangle(startt.A.slice(), m.B.slice(), m.C.slice(), pickSpeed(), 0, 0, pickColor())
        arr[0][2].parent = new Triangle(m.A.slice(), startt.B.slice(), m.C.slice(), pickSpeed(), 0, 0, pickColor())
        arr[0][3].parent = new Triangle(m.A.slice(), m.B.slice(), startt.C.slice(), pickSpeed(), 0, 0, pickColor())
    }
}

let lastCol = Math.random(0,360);
function pickColor() {
    colorMode(HSB)
    let h = lastCol + random(40,50);
    h = h % 360;
    // while(abs(lastCol-h) < 40) h = random(0, 360) // 0 to 360
    lastCol = h;
    let s = 50
    let b = 100
    return color(h, s, b, 255)
}

function pickLerpDist() {
    return random(0, 1);
    // return 0.5
}

function pickSpeed() {
    let sign = Math.round(Math.random()) * 2 - 1 ;
    let speed = random(0.004, 0.0055) * sign;
    return speed;
}

function getDistToOrigin(pair) {
    return dist(0, 0, pair[0], pair[1])  // Origin is 0,0 because we translate when drawing
}

function replaceLargest() {
    arr.shift();
    // r = getDistToOrigin(arr[0].A)  // adjust the radius
}

function appendSmallest(lerpDist = 0) {
    let split4 = [];
    let p;
    let m;

    if(arr.length != 0) {
        p = arr[arr.length-1]
        split4.push(m)
        split4.push(new Triangle(p[0].A.slice(), m.B.slice(), m.C.slice(), pickSpeed(), p[0], lerpDist, pickColor()))
        split4.push(new Triangle(m.A.slice(), p[0].B.slice(), m.C.slice(), pickSpeed(), p[0], lerpDist, pickColor()))
        split4.push(new Triangle(m.A.slice(), m.B.slice(), p[0].C.slice(), pickSpeed(), p[0], lerpDist, pickColor()))
        arr.push(split4)
    }
    else
    {
        m = new Triangle(startt.A.slice(), startt.B.slice(), startt.C.slice(), pickSpeed(), startt, lerpDist, pickColor())
        pa = new Triangle(startt.A.slice(), startt.B.slice(), startt.C.slice(), pickSpeed(), startt, lerpDist, pickColor())
        split4.push(m)
        split4.push(new Triangle(startt.A.slice(), m.B.slice(), m.C.slice(), pickSpeed(), , lerpDist, pickColor()))
        split4.push(new Triangle(m.A.slice(), p[0].B.slice(), m.C.slice(), pickSpeed(), p[0], lerpDist, pickColor()))
        split4.push(new Triangle(m.A.slice(), m.B.slice(), p[0].C.slice(), pickSpeed(), p[0], lerpDist, pickColor()))
        p = [startt, startt, startt, startt];
    }

}

function moveTriangle(tri) {
    if(tri.parent){
        tri.A[0] = lerp(tri.parent.A[0], tri.parent.B[0], tri.lerpDist)
        tri.A[1] = lerp(tri.parent.A[1], tri.parent.B[1], tri.lerpDist)
        tri.B[0] = lerp(tri.parent.B[0], tri.parent.C[0], tri.lerpDist)
        tri.B[1] = lerp(tri.parent.B[1], tri.parent.C[1], tri.lerpDist)
        tri.C[0] = lerp(tri.parent.C[0], tri.parent.A[0], tri.lerpDist)
        tri.C[1] = lerp(tri.parent.C[1], tri.parent.A[1], tri.lerpDist)
    }
    else {
        print("no parent found")
    }
    tri.lerpDist += tri.speed
    tri.lerpDist = tri.lerpDist % 1;
    if(tri.lerpDist < 0) tri.lerpDist += 1;
}

function drawTriangle(tri) {
    beginShape()
    fill(tri.color)
    // noStroke()
    strokeWeight(1)
    endShape(CLOSE)
}
