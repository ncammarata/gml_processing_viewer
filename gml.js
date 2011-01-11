var _stroke = 0, // current stroke
    onPt = 0, // current point on stroke
    onStroke = 0, // current point on stroke
    start = +(new Date()),
    x, 
    y, 
    rotation = false, //pjs dies on comma seperation
    lastHyp,
    ol; // oldLine - redraws last line to remove border overflow
setup = function() {
    size(800,580);    
    frameRate(60);
    smooth();
    reset();
    var si = setInterval(function() {
        if (!gml) return;
        clearInterval(si);
        var tag = gml.gml.tag;
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
        if (onPt==p) onPt++; //went back to 0
    }
};

function drawLine(x,y,x2,y2) {
    _x = rotation ? y*height : x*width;
    _y = rotation ? width-(x*width) : y*height;
    _x2 = rotation ? y2 * height : x2*width;
    _y2 = rotation ? width - (x2 * width) : y2*height;
    stroke(0);
    strokeWeight(5);
    line(_x,_y,_x2,_y2);
    stroke(255);
    line(_x,_y,_x2,_y2);
    //ol = { x: _x, y: _y, x2: _x2, y2: _y2 };
}

function reset() {
    fill(120);
    rect(0,0,width*2,height*2);
    onPt = onStroke = 0;
    x = y = null;
}
