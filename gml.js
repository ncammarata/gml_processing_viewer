var _stroke = 0, // current stroke
    onPt = 0, // current point on stroke
    onStroke = 0, // current point on stroke
    start = +(new Date()),
    x, y, 
    rotation = false,
    lastPoints = { x:0, y:0, x2: 0, y2: 0 };

setup = function() {
    size(800,580);    
    frameRate(50);
    smooth();
    reset();
    var si = setInterval(function() {
        if (!gml) return;
        clearInterval(si);
        strokes = gml.strokes;
        var tag = gml.data.gml.tag;
        var app_name = tag.header && tag.header.client && tag.header.client.name; 
        rotation = app_name == 'Graffiti Analysis 2.0: DustTag' || 
                   app_name == 'DustTag: Graffiti Analysis 2.0' || 
                   app_name == 'Fat Tag - Katsu Edition';
    }, 50);
};


draw = function() {
    var start; var hyp;
    if (!strokes) return;
    _stroke = strokes.length ? strokes[onStroke] : strokes;
    pt = _stroke.pt[onPt];
    if ((+(new Date())-start)/1000>pt.time) {
        var p = onPt;
        if (x !== null) drawLine(x,y,pt.x,pt.y);
        if (onPt) {
            if (++onPt >= _stroke.pt.length) {
                if (!strokes.length || ++onStroke >= strokes.length) return reset();
                onPt = 0;
            }
        }
        x = pt.x;    
        y = pt.y;    
        beads.draw();
        if (onPt==p) onPt++; //went back to 0
    }
};

var d2r = function(d) { return (d * Math.PI)/180; } //degrees to radians
var r2d = function(r) { return (r / Math.PI) * 180; } //radians to degrees

var beads = { 
    data: [],
    drawTimer: 0,
    lastAdd: +new Date,
    friction: .85, 
    maxBeads: 20,
    draw: function() {
        //if (this.drawTimer++ % 2) return; 
        this.data.forEach(function(bead) {
            if (bead.radius > 1.5) return;
            bead.vel *= beads.friction;
            var cos = bead.theta + Math.random()*0;
            var sin = bead.theta + Math.random()*0;
            bead.y += Math.sin(sin) * bead.vel;
            bead.x += Math.cos(cos) * bead.vel;
            bead.radius *= 1.15; 
            fill(200 - (bead.radius * 30));
            strokeWeight(1);
            stroke(0);
            ellipse(bead.x, bead.y, bead.radius*10, bead.radius*10);
        });
    },
    add: function(x, y, vel, theta) {
        if (+(new Date) - this.lastAdd < 100) return;
        if (this.data.length > this.maxBeads) {
            delete this.data[0];    
        }
        this.data.push({ x: x, y: y, radius:0.4, vel: vel, theta: theta })
        this.lastAdd = +new Date;
    }    
}

var rnd = function(min, max) {
    return Math.floor(Math.random()*(max-min)) + min;
}

var beadCounter = 0;
function drawLine(x,y,x2,y2) {
    var _x, _y, _x2, _y2;
    _x = rotation ? y * height : x * width;
    _y = rotation ? width - (x * width) : y * height;
    _x2 = rotation ? y2 * height : x2 * width;
    _y2 = rotation ? width - (x2 * width) : y2 * height;

    //lets do some trig!
    var h = Math.sqrt(Math.pow(_x2-_x, 2) + Math.pow(_y2-_y, 2));
    var inside = (_x2-_x)/(lastPoints.x2 - lastPoints.x);
    var deg = r2d(Math.atan(inside));
    if (deg > 40) { 
       //add up to three beads
       var beadCount = 0;
       var len = Math.random()*4;
       while (beadCount++ < len) beads.add(_x, _y, (1/(h+50))*rnd(500,2000), deg); 
    }
    stroke(0);
    strokeWeight(1 / ( h+50 ) * 400);
    line(_x,_y,_x2,_y2);
    fill(200);
    stroke(200);
    strokeWeight(10)
    line(_x,_y,_x2,_y2);
    lastPoints = { x: _x, y: _y, x2: _x2, y2: _y2 };
}

function reset() {
    fill(120);
    rect(0,0,width*2,height*2);
    onPt = onStroke = 0;
    beads.data = [];
    x = y = null;
}
