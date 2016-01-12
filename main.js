var horizon = 200;
var gameTime = 8;
var hourL = 60000;
var frameTime = 0;
var lastFrame = 0;
var drawFrame = false;
var lastHour = 0;
var sunrise,day,sunset,night,ground;
var orbAngle = 0;
var paused = false;
var lines;
var lastLine = 0;
var lineChance = 1/50;
var lineLife = 60;
var liveLines = Array();
var gameDate = new Date();
var BDAY_MONTH = 11;
var BDAY_DATE = 1;


function setup(){
  createCanvas(windowWidth-20,windowHeight-20);
  background(255);
  sunset = [color(0,150,200),color(224,153,255),color(255,224,224)];
  night = [color(0),color(0),color(128,0,64)];
  sunrise = [color(0,153,204),color(204,153,255),color(255,204,204)];
  day = [color(102,204,255),color(153,204,255),color(204,255,255)];
  ground = [color(200,255,200),color(64,255,64),color(64,255,64)];
  lines = ["...","CUBE GOOD HORSE?","CUBE GO FAST?","CUBE BAD","CUBE GET A PUSH?","CUBE NOT FAST","CUBE NO GO GOOD","OTHER HORSE PULL CUBE?","CUBE NEED A PUSH","CUBE WIN RACE?","OATS","NO OATS?","...","CUBE TRY CUBE'S BEST","CUBE TRY HARD THIS TIME","CUBE TRY HARDER","CUBE IN THE LEAD?","CUBE TIRED FROM TRYING"];
  textSize(16);
  textAlign(CENTER);
  drawScene();
}

function windowResized(){
  resizeCanvas(windowWidth-20,windowHeight-20);
}

function drawScene(){
  push();
    scale(width/600,height/400);
    drawSky();
    drawGround();
    drawCube(250,200,100,150,25,125);
    drawFence(415,120,60,8);
  pop();
}

function draw(){
  if(!paused){
    if(millis()-lastHour > hourL){
	  lastHour = millis();
	  gameTime= (gameTime+1) % 24;
	  gameDate.setDate(gameDate.getDate() + 1);
    }
  }
  
  if(millis()-lastFrame > 33){
    lastFrame = millis();
	  frameTime = (frameTime + 1) % 24;
    drawScene();
	  if(random()<=lineChance && lastLine>=30){
      var curLine = {};
	    curLine.age = lineLife;
	    curLine.x = random(-100,100);
	    curLine.y = random(0,-200);
	    curLine.line = lines[floor(random(lines.length))];
	    if (gameDate.getMonth()==BDAY_MONTH && gameDate.getDate()==BDAY_DATE){
	      curLine.line += " (+GLUE BONUS)"
	    }
	    liveLines.push(curLine);
      lastLine = 0;
	  }
	  else if(liveLines.length>0){
	    for(var i = 0;i<liveLines.length;i++){
		    liveLines[i].age--;
		    if(liveLines[i].age>0){
		      drawLine(liveLines[i]);
		    }
	    }
	    while(liveLines.length>0 && liveLines[liveLines.length-1].age<0){
	      liveLines.pop();
	    }
    }
	  lastLine++;
  }
}

function drawLine(aLine){
	push();
	  translate(width/2+aLine.x, height-50+aLine.y);
	  stroke(255,(aLine.age/lineLife)*255);
	  strokeWeight(2);
	  fill(0,0,200,(aLine.age/lineLife)*255);
	  rect(-(textWidth(aLine.line)/2)-5,0,textWidth(aLine.line)+10,32);
	  noStroke();
	  if(-100 - aLine.y >= 0){
	//    triangle(-aLine.x,-100 - aLine.y,-10,32,10,32); 
	  }
	  else{
	 //   triangle(-aLine.x,-100 - aLine.y,-10,-2,10,-2); 
	  }
	  fill(255,(aLine.age/lineLife)*255);
	  text(aLine.line,0,22);

	pop();
}

function drawCube(x,y,w1,w2,h1,h2){
	var sx = (w2-w1)/2;
	push();
	translate(x,y);
	noStroke();
	fill(240);
	quad(0,0,w1,0,w1+sx,h1,0-sx,h1);
	fill(128);
	rect(-sx,h1,w2,h2);
	pop();
}

function drawSky(){
  var curSky;
  if(gameTime<4 || gameTime>20){
    curSky = night;
  }
  else if(gameTime>8 && gameTime<16){
    curSky = day;
  }
  else if(gameTime<6){
    //sunrise
	var inter = ((gameTime-4)) + ((millis()-lastHour)/hourL);
	curSky = lerpGradient(night,sunrise,inter);
  }
  else if(gameTime<=8){
    //sunrise
	var inter = ((gameTime-6)) + ((millis()-lastHour)/hourL);
	curSky = lerpGradient(sunrise,day,inter);
  }
  else if(gameTime<18){
	var inter = ((gameTime-16)) + ((millis()-lastHour)/hourL);
	curSky = lerpGradient(day,sunset,inter);
    //sunset
  }
  else if(gameTime<=20){
	var inter = ((gameTime-18)) + ((millis()-lastHour)/hourL);
	curSky = lerpGradient(sunset,night,inter);
    //sunset
  }
  else{
  	curSky = night;
	console.log(gameTime);
  }
  drawGradient(0,0,width,horizon,curSky);
  var orbColor = (gameTime>=6 && gameTime<18) ? color(255,255,200) : color(255);
  var pastRise;
  if(gameTime>=6 && gameTime<18){
    pastRise = gameTime + ((millis()-lastHour)/hourL) - 5;
  }
  else{
    pastRise = (gameTime<6) ? gameTime + ((millis()-lastHour)/hourL) + 6 : gameTime + ((millis()-lastHour)/hourL) - 18;
  }

  push();
  orbAngle = map(pastRise,0,12,PI/8,-PI - (PI/8));
  fill(orbColor);
  stroke(color(255,32));
  strokeWeight(15 + (2*sin(frameTime/12*PI)));
  translate(width/2.0,horizon);
  rotate(orbAngle,0);
  translate((width/2)-100,0);
  ellipse(0,0,50,50);
  strokeWeight(1);
  pop();
  
}

function drawGround(){
  push();
  noStroke();
  
  if(gameTime>=8 && gameTime <=16){
 	 drawGradient(0,horizon,width,height-horizon,ground);
  }
  else if(gameTime<=4 || gameTime >=20){
	drawGradient(0,horizon,width,height-horizon,blendGradient(ground,color(100),0.75));
  }
  else if(gameTime<8){
	  var curTime = gameTime + ( (millis()-lastHour) / hourL) - 4;
	  drawGradient(0,horizon,width,height-horizon,blendGradient(ground,color(100),0.75 - (.75 * (curTime/4)) ));
  }
  else if(gameTime>16){
	  var curTime = gameTime + ( (millis()-lastHour) / hourL) - 16;
	  drawGradient(0,horizon,width,height-horizon,blendGradient(ground,color(100),(.75 * (curTime/4)) ));
  }
  pop();
  drawFence(horizon+5,30,10,2);
  drawTrack(horizon+10,20);
  drawFence(horizon+50,60,30,4);
  drawTrack(horizon+70,120);
}

function drawTrack(y,theight){
  push();
  translate(0,y);
  var tcolor = color(150,100,50); 
  if(gameTime>=8 && gameTime <=16){
	  tcolor = color(150,100,50);
  }
  else if(gameTime<=4 || gameTime >=20){
	  tcolor = lerpColor(tcolor, color(100),0.75);
  }
  else if(gameTime<8){
	  var curTime = gameTime + ( (millis()-lastHour) / hourL) - 4;
	  tcolor = lerpColor(tcolor, color(100),0.75 - (0.75 * (curTime/4)));
  }
  else if(gameTime>16){
	  var curTime = gameTime + ( (millis()-lastHour) / hourL) - 16;
	  tcolor = lerpColor(tcolor, color(100),0.75 * (curTime/4));
  }
  
  fill(tcolor);
  noStroke();
  rect(0,0,width,theight);
  pop();
}

function drawFence(y,fdelta,fheight,fwidth){
  push();
   var fcolor = color(255,255,255);
   translate(0,y);
   noStroke();
   fill(fcolor);
   rect(0,-fheight,width,fwidth);
   for(var i = fdelta/2;i<width;i+=fdelta){
	 rect(i,0,fwidth/2,-fheight);
   }
  pop();
}

function blendGradient(c1,c2,inter){
  var c3 = Array();
  for( var i = 0;i<c1.length;i++){
    c3[i] = lerpColor(c1[i],c2,inter);
  }
  return c3;
}

function lerpGradient(c1,c2,inter){
  var c3 = Array();
  if(c1.length = c2.length){
    for(var i = 0;i<c1.length;i++){
		c3[i] = lerpColor(c1[i],c2[i],inter);
    }
  }
  else{
  
  }
  return c3;
}

function drawGradient(x,y,w,h,stops){
  var c1,c2,inter,delta;
  
  //how long until we switch to a new target color;
  delta = h/max(stops.length-1,1);
  c1 = 0;
  c2 = 1;

  push();
    translate(x,y);
    for(var i = 0;i<h;i++){
      c1 = floor(i/delta);
      c2 = c1+1;
      inter = (i%delta) / delta;
      stroke(lerpColor(stops[c1],stops[c2],inter));
      line(0,i,w,i);
    }
  pop();
}

function mousePressed(){
}
