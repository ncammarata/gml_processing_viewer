	// big TODO: use the time data instead of just doing continuous time playback
	void setup() {
		console.log("setup()");
		console.log(gml);

		// setup our canvas
		size(800, 580);
		frameRate(60);
		background(0);
		// smooth();

		// read data from the GML (GSON), loaded via #000000book JSONp callback
		// the <script> tag is finicky if not at the bottom of the page, after the Processing.js sketch
		pts = []
		strokes = (gml.tag.drawing.stroke instanceof Array ? gml.tag.drawing.stroke : [gml.tag.drawing.stroke]);
		for(i in strokes){ 
			// console.log("reading stroke "+i);
			pts = pts.concat(strokes[i].pt);
			pts.push(undefined); //blank obj to indicate new stroke
		}
		
		// read orientation/scaling headers from the GML
		// FIXME - DustTag GML not specifying a orientation/scaling, so we're explicitly fixing known iPhone apps
		var app_name = gml.tag.header && gml.tag.header.client && gml.tag.header.client.name;
		if(app_name == 'Graffiti Analysis 2.0: DustTag' || app_name == 'DustTag: Graffiti Analysis 2.0' || app_name == 'Fat Tag - Katsu Edition'){
			rotation = 80;
			translation = [0, 800]; // still gets cropped; should scale down all values
			console.log('GML is known iPhone app, scaling...');
		} else {
			rotation = 0;
			translation = [0, 0];
			console.log("Unknown appplication source: "+app_name);		
			// console.log(gml.tag.header);
		}
		console.log("rotation="+rotation+" translation="+translation);
	}

	void draw() {
		i = frameCount % pts.length;
		prev = pts[i-1];
		pt = pts[i];
		
		// drawing rules
		if(i == 0){ background(0); } // clear on restart (first frame)
		if(pt == undefined || pt == []){ return; } // if missing current pt, we are skipping		
		if(prev == undefined || prev == []){ prev = pt; } // if missing the prev, we're at the beginning of a new stroke
		
		// calculations
		dimx = (prev.x -pt.x)*width;
		dimy = (prev.y -pt.y)*height;
		hyp = 1/(sqrt(pow(dimx,2),pow(dimy,2)) + 25);
		// console.log('stroke prev.x='+prev.x+' prev.y='+prev.y+' pt.x='+pt.x+' pt.y='+pt.y+' |  dimx='+dimx+' dimy='+dimy+' hyp='+hyp);

		// transform display space if specified
		translate(translation[0], translation[1]);
		rotate(rotation);

		// finally... draw!
		strokeWeight(hyp * 200);
		stroke(255);		
		line(prev.x*width, prev.y*height, pt.x*width, pt.y*height);

	}
