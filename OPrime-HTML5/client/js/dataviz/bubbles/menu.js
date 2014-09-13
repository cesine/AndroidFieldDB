
var randomColor = function(){
  //return 'hs1('+Math.floor(Math.random() * 360) + ',100%,50%)';
  //return '#'+Math.floor(Math.random() * 360);
  return '#000000'.replace(/0/g,function(){return (~~(Math.random()*16)).toString(16);})
  //return '#'+Math.floor(Math.random()*16777215).toString(16);
}
var randomBlueGreenColor = function(){
  return 'hs1('+Math.floor(Math.random() * 100 + 100) + ',100%,50%)';
}
var srandom = function() {
  return Math.random() * 2-1;
}
var particles = [];
var positions = [];
var positionsFilled = [];
var startPostion;
var disapear = false;

//draw particles
//http://www.youtube.com/watch?v=v8ikTvQWfoc&feature=player_embedded
Particle = function(){
  this.id = 0;
  this.x = 0;//location
  this.y = 0;
  this.vx = 0;//vector for movement
  this.vy = 0;
  this.r = 0;//radius
  this.dt = 0.25; //delta, a small step of movement
  this.color = "hs1(35,100%,50%)";
  this.init = function(i){
    this.id =i;
  this.color = randomColor();
    this.x = Math.random() * ctx.canvas.width;
    this.y = Math.random() * ctx.canvas.height;
    this.vx = srandom() * 30;
    this.vy = srandom() * 30;
    var maxButtonSize = Math.max(buttonRadiusForClicking - 10, 3);
    this.r = Math.random() * (8) + maxButtonSize;
  }
  this.draw = function(){
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI *2, false);
    ctx.closePath();
    ctx.fill();
  }
  this.update = function(){
    //this.interact();
    this.fallIntoPosition();
    this.x += this.vx * this.dt;
    this.y += this.vy * this.dt;
    this.bound();
  }
  this.bound = function(){
    if(this.x < 0) { 
      if (disapear === true){ 
        particles.splice(particles.indexOf(this),1);
      }
      this.x = 0; 
      this.vx *= -1; 
    }
    if(this.y < 0) { 
      if (disapear === true){ 
        particles.splice(particles.indexOf(this),1);
      }
      this.y = 0; 
      this.vy *= -1; 
    }
    if(this.x > ctx.canvas.width - 1) {
      if (disapear === true){ 
        particles.splice(particles.indexOf(this),1);
      }
      this.x = ctx.canvas.width - 1; 
      this.vx *= -1;
    }
    if(this.y > ctx.canvas.height -1){
       if (disapear === true){ 
        particles.splice(particles.indexOf(this),1);
      }
      this.y = ctx.canvas.height -1;
      this.vy *= -1;
    }
  }
  this.fallIntoPosition = function(){
    for(var i = 0; i < positions.length; i++){
      var position = positions[i];
      var dx = this.x - position.x;
      var dy = this.y - position.y;
      var d = Math.sqrt(dx*dx + dy*dy);
      var R = this.r + position.r + 10;//added 10 pixles to make them jump into place
      if(d < R){
        position.color = this.color;
        position.r = this.r;
        //delete this particle
        positionid = position.id;
        particles.splice(particles.indexOf(this),1);
        //push this position into the positionsFilled array
        var filledPosition = positions.splice(i,1);
        position.label=buttonLabels[position.id];
    position.labelx = position.x + buttonRadiusForClicking*Math.cos( position.angleOnCircleMenu );
        position.labely = position.y + buttonRadiusForClicking*Math.sin( position.angleOnCircleMenu );
        position.textAlign = "right";
        if(menuShape ==="arc"){
          position.textAlign = "right";
        }else{
          //its a circle shape
          //put the labels on the right if the node is on the right of the center
          //put the labels on the left if the node is on the left of the center
          if(position.x > ctx.canvas.width/2){
            position.textAlign = "left";
          }else{
            position.textAlign = "right";
          }
          //if its the topmost position, put the label in the center
          if(position.id === 0){
            position.textAlign = "center";
            position.labely = position.labely -5;
          }else if(buttonLabels.length % 2 === 0){
            //if the circle has an even number of nodes
            if (position.id === buttonLabels.length/2 - 1){
              //if its in the bottom middle
              position.textAlign = "center";
              position.labely = position.labely +5;
            } 
          }else{
            //if the circle has an odd number of nodes
            if (position.id === (buttonLabels.length - 1)/2){
              position.textAlign = "center";
              position.labely = position.labely +5;
            }
            if (position.id === (buttonLabels.length - 1)/2){
              position.textAlign = "center";
              position.labelx = position.labelx +10
              position.labely = position.labely +5;
            }
            if (position.id === (buttonLabels.length + 1)/2){
              position.textAlign = "center";
              position.labelx = position.labelx -10
              position.labely = position.labely +5;
            }

          }
        }//end circle label logic

        positionsFilled.push(position);
        //console.log(filledPosition+ " " +position);
        //var ids = "";
        //for (var j = 0; j <particles.length; j++){
        //  ids =ids+" "+particles[j].id;
        //}
        if(positions.length > 0){
          //console.log("Positions filled:"+positionid+ "distance:"+d+" overlap:"+R+" \nParticle "+this.id+" became position:"+position.id+" at array index:"+i+" Particles left:"+ids);
        }else{
          disapear = true;
        //pause=true;
        }
      }
    }
    
  }
  this.interact = function(){
    for(var i = 0; i < particles.length; i++){
      var other = particles[i];
      if (this != other){
        //compare the distance between the centers of the two
        var dx = this.x - other.x;
        var dy = this.y - other.y;
        var d = Math.sqrt(dx*dx + dy*dy);
        if(d > 0){
          //R = the combined thickness of the two circles
          var R = this.r + other.r;
          if(d < R){
            //if the distance between the circles is smaller 
            //than their thickness, then they overlap
            var dR = R - d;
            var ux = dx / d;
            var uy = dy / d;
            //repel the particles from eachother
            this.vx += ux * dR * 0.1;
            this.vy += uy * dR * 0.1;
            other.vx += -ux * dR * 0.1;
            other.vy += -uy * dR * 0.1;
          }
        }
      } 
    }
  }
}//end Particle

function addParticles(n){
  for (var i=0; i < n; i++){
    var p = new Particle();
    p.init(i);
    particles.push(p);
  }
}
function addPositions(n,screenSize){
  /*if(n %2 ===0){
    n=n-1;
  }*/
  var elipse = ctx.canvas.width*.80/ctx.canvas.height*.90;
  console.log(elipse);
  if (window.menuShape === "arc"){
    var xunits = ctx.canvas.width / n-1;
    var yunits = ctx.canvas.height / n-1 ;
      var previousy =  25;
    var theta = 2 * Math.PI /4 /n; //the angle between dots on a 1/4 circle
    var xcenter = ctx.canvas.width/3.5;
    var ycenter = ctx.canvas.height - ctx.canvas.height/10;
    var radius = ctx.canvas.width;
  }else{
      var xunits = ctx.canvas.width / n-1;
      var yunits = ctx.canvas.height / n-1 ;
      var previousy =  25;
      var theta = 2 * Math.PI /n; //the angle between dots on a full circle
      var xcenter = ctx.canvas.width/2;
      var ycenter = ctx.canvas.height/2;
      var radius = screenSize/2 - screenSize/10;
  }
  if (radius > ctx.canvas.height*0.8){
      radius = ctx.canvas.height*0.8;
  }
  
  for (var i = 0; i < n; i++){
    if ( window.menuShape === "arc"){
      //set start of circle at 3/2PI (the top of the circle)
      var angleTopToBottom = 3*Math.PI/2+theta*i;
    }else{
      //set start of circle at 3/2PI (the top of the circle)
      var angleTopToBottom = 3*Math.PI/2+theta*i;
    }
    var p = new Particle();
    p.init(i);
    //add the cosine of the angle times the radius of the menu circle (elipse 1.2)
    
    p.angleOnCircleMenu = angleTopToBottom;
    p.x = xcenter + (Math.cos(angleTopToBottom) * radius) *elipse ;
    //add the sin (height) of the negative angle to go up times the radius 
    p.y = ycenter + Math.sin(angleTopToBottom) * radius ; 
    p.color = "white";
    p.r = 20;
    positions.push(p);
  }
}
function clearParticles(){
  var n = particles.length;
  for(var i = 0; i < n; i++) {
    particles.pop();
  }
}
var pause = false;
var timer;
var stopLooping = function(){
  clearInterval(timer);
}
var buttonRadiusForClicking;
var pushButton = function(id){
//to be defined later
}
var getPositionAsButton = function(x, y){
  //to be defined later
}
var participantCodes;
var setReplayParticipantCode;
var buttonLabels;
var menuShape = "arc"; //arc or circle

function isNativeAndroidApp() {
  return /BilingualAphasiaTest\/[0-9\.]+$/.test(navigator.userAgent);
}
if (isNativeAndroidApp()) {
  window.pressButton = function(id,label) {
    if(label === "Start" || label === "Commencer"){
      Android.setAutoAdvanceJS("1");
    }
    Android.launchSubExperimentJS(id);
  }
  fetchSubExperimentsArray = function(){
    result = Android.fetchSubExperimentsArrayJS();
    result = result.replace(/\]/g,"").replace(/\[/g,"");
    buttonLabels = result.split(", ");//"History of Bilingualism","English Background","Spontaneous Speech","Verbal Comprehension","Pointing","Simple and Semi-complex Commands","Complex Commands","Verbal Auditory Discrimination","Syntactic Comprehension","Semantic Categories","Synonyms","Antonyms","Grammaticality Judgement","Semantic Acceptability","Lexical Decision","Series","Verbal Fluency","Naming","Sentence Construction","Semantic Opposites","Derivational Morphology","Morphological Opposites","Description","Mental Arithmetic","Listening Comprehension","Reading","Copying","Dictation","Reading Comprehension for Words","Reading Comprehension for Sentences","Writing");
    console.log(buttonLabels);
    if (buttonLabels.length > 8){
      menuShape = "circle";
    }
    //Android.showToast(buttonLabels);
  }
  fetchExperimentTitle= function(){
    titleLabel = Android.fetchExperimentTitleJS();
  }
  fetchParticipantCodes = function(){
    result = Android.fetchParticipantCodesJS();
    result = result.replace(/\]/g,"").replace(/\[/g,"");
    if(result.length > 0){
      participantCodes = result.split(", ");//"ET1AM4mc, SAMPLE".split(",");
    }else{
      participantCodes = "";
    }
  }
  setReplayParticipantCode = function(code){
    Android.setReplayParticipantCodeJS(code);
  }
} else {
  //alert("in a browser");
  window.pressButton = function(id,label) {
    if(label === "Start" || label === "Commencer"){
      //alert("Starting AutoAdvance - pressed experiment button "+id);
      //window.open();
    }else{
      //alert("pressed experiment button "+id);
    }
    window.open("touch_response_visualizer.html?subexperiment="+id,'_self');
  }
  fetchSubExperimentsArray = function(){
    var javaArrayListToString = "[History of Bilingualism, English Background, Spontaneous Speech, Verbal Comprehension, Pointing, Simple and Semi-complex Commands, Complex Commands, Verbal Auditory Discrimination, Syntactic Comprehension, Semantic Categories, Synonyms, Antonyms, Grammaticality Judgement, Semantic Acceptability, Lexical Decision, Series, Verbal Fluency, Naming, Sentence Construction, Semantic Opposites, Derivational Morphology, Morphological Opposites, Description, Mental Arithmetic, Listening Comprehension, Reading, Copying, Dictation, Reading Comprehension for Words, Reading Comprehension for Sentences, Writing]";
    javaArrayListToString = javaArrayListToString.replace(/\]/g,"").replace(/\[/g,"");
    buttonLabels = javaArrayListToString.split(",");
    console.log(buttonLabels);
    //buttonLabels = new Array("History of Bilingualism","English Background","Spontaneous Speech","Verbal Comprehension","Pointing","Simple and Semi-complex Commands","Complex Commands","Verbal Auditory Discrimination","Syntactic Comprehension","Semantic Categories","Synonyms","Antonyms","Grammaticality Judgement","Semantic Acceptability","Lexical Decision","Series","Verbal Fluency","Naming","Sentence Construction","Semantic Opposites","Derivational Morphology","Morphological Opposites","Description","Mental Arithmetic","Listening Comprehension","Reading","Copying","Dictation","Reading Comprehension for Words","Reading Comprehension for Sentences","Writing");
    if (buttonLabels.length > 8){
      menuShape = "circle";
    }
  }
  fetchExperimentTitle= function(){
    titleLabel = "Bilingual Aphasia Test - English";
  }
  fetchParticipantCodes = function(){
    participantCodes = "";//'SAMPLE'.split(",");
  }
  setReplayParticipantCode = function(code){
    console.log("IN set replay button");
    alert("Set replay participant to "+code);
  }
}
var titleFont;
var titleLabel;
var labelFont;
var el;
var ctx;

  function loopParticles() {

    if (pause)
      return;

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    //Write the Experiment title
    ctx.font = titleFont;
    ctx.fillStyle = "#369";
    ctx.textAlign = "center";
    ctx.fillText(titleLabel, ctx.canvas.width / 2,
        ctx.canvas.height / 2);

    //reset font for labels
    ctx.font = labelFont;

    for ( var i = 0; i < positions.length; i++) {
      positions[i].draw();
    }
    if (positionsFilled.length > 0) {
      for ( var i = 0; i < positionsFilled.length; i++) {
        positionsFilled[i].draw();
        //ctx.fillStyle = "black";
        ctx.textAlign = positionsFilled[i].textAlign;
        ctx.fillText(positionsFilled[i].label,
            positionsFilled[i].labelx, positionsFilled[i].labely);
      }
    }
    if (particles.length > 0) {
      for ( var i = 0; i < particles.length; i++)
        particles[i].update();
      for ( var i = 0; i < particles.length; i++)
        particles[i].draw();
    } else {
      pause = true;
      stopLooping();
    }
  }
  function loopDelegate() {
    loopParticles();
  }
  loadButton = function() {
    fetchSubExperimentsArray();
    fetchExperimentTitle();
    
    buttonRadiusForClicking = 2 * Math.PI * minScreenSize
        / buttonLabels.length / 5//button size is relative to number of buttons and circumference
    console.log(buttonRadiusForClicking);

    addPositions(buttonLabels.length, minScreenSize);
    startPosition = new Particle();
    startPosition.init(0);
    startPosition.label = "Start";
    //if titleLabel contains aphasie
    if(titleLabel.indexOf("aphasie") != -1){
      startPosition.label = "Commencer";
    }
    startPosition.y = ctx.canvas.height / 2 + ctx.canvas.height / 8;
    startPosition.x = ctx.canvas.width / 2;
    startPosition.textAlign = "center";
    startPosition.labelx = startPosition.x;
    startPosition.labely = startPosition.y + buttonRadiusForClicking
        * 1.5;
    positionsFilled.push(startPosition);

    //draw a reasonable number of particles 
    addParticles(Math.max(buttonLabels.length * 2, minScreenSize / 50));
    window.timer = setInterval(loopDelegate, 1000 / 60);

    getPositionAsButton = function(x, y, buttonid) {
      /*
      If recieved a button id, flash that button
      and press it 500ms later
      */
      if(buttonid != null){
        for ( var k = 0; k < positionsFilled.length; k++) {
          if (positionsFilled[k].id === buttonid) {
            positionsFilled[k].color = "#999999";
            positionsFilled[k].r = buttonRadiusForClicking;
            positionsFilled[k].draw()
            ctx.textAlign = positionsFilled[k].textAlign;
            ctx.fillText(positionsFilled[k].label,
                positionsFilled[k].labelx,
                positionsFilled[k].labely);
            //alert("Clicked "+positionsFilled[k].id);
            setTimeout("window.pressButton(positionsFilled[" + k
                + "].id,positionsFilled[" + k + "].label);", 500);
            return;//dont click on multiple buttons
          } else {
            //alert(" distance to this position "+d);
            //alert("Position filled is at "+positionsFilled[k].x+" "+positionsFilled[k].y);
          }
        }
      }
      /*
      Otherwise check to see if the x,y match a button
      */
      
      for ( var k = 0; k < positionsFilled.length; k++) {
        var dx = x - positionsFilled[k].x;
        var dy = y - positionsFilled[k].y;
        var d = Math.sqrt(dx * dx + dy * dy);
        var R = buttonRadiusForClicking;// positionsFilled[k].r + 5;//added 10 pixles to click around the buton
        if (d < R) {
          positionsFilled[k].color = "#aaaaaa";
          positionsFilled[k].r = buttonRadiusForClicking;
          positionsFilled[k].draw();
          ctx.textAlign = positionsFilled[k].textAlign;
          ctx.fillText(positionsFilled[k].label,
              positionsFilled[k].labelx,
              positionsFilled[k].labely);
          //alert("Clicked "+positionsFilled[k].id);
          setTimeout("window.pressButton(positionsFilled[" + k
                + "].id,positionsFilled[" + k + "].label);", 0);
          return;//dont click on multiple buttons
        } else {
          //alert(" distance to this position "+d);
          //alert("Position filled is at "+positionsFilled[k].x+" "+positionsFilled[k].y);
        }
      }
    }
    ctx.canvas.addEventListener('touchstart', function(e) {
      //alert(e.changedTouches[0].pageX + " " + e.changedTouches[0].pageY);
      getPositionAsButton(e.pageX, e.pageY);
    });
    ctx.canvas.addEventListener('mousedown', function(e) {
      console.log(e);
      //alert(e.pageX + " " + e.pageY);
      getPositionAsButton(e.pageX, e.pageY);
    });


    

  }
  initCanvas = function() {
    var C = 0.50; // canvas width to viewport width ratio

    // For IE compatibility http://www.google.com/search?q=get+viewport+size+js
    var viewportWidth = window.innerWidth;
    var viewportHeight = window.innerHeight;

    fetchParticipantCodes();
    if (window.participantCodes.length >= 1) {
      document.getElementById("loadButton").style.display = 'none';
      document.getElementById("buttonArea").appendChild(
          document.createTextNode("Results"));
      for ( var p = 0; p < participantCodes.length; p++) {
        var playButtn = document.createElement("input");
        playButtn.setAttribute("type", "button");
        playButtn.setAttribute("id", participantCodes[p]);
        playButtn.setAttribute("value", participantCodes[p]);
        playButtn.setAttribute("name", participantCodes[p]);
        playButtn.setAttribute("class", "groovybutton");
        playButtn.setAttribute("onClick", "setReplayParticipantCode('"
            + participantCodes[p].toString() + "')");
        document.getElementById("buttonArea").appendChild(playButtn);

        document.getElementById("buttonArea").appendChild(
            document.createElement('br'));
      }

    } else {
      var row = document.getElementById("sidebar");
      //if (row.style.display == '')
      //  row.style.display = 'none';
      //else
      //  row.style.display = '';
    }
    var sideBarWidth=0;
    if (participantCodes.length >= 1) {
      sideBarWidth = 60;
    }
    var canvasWidth = viewportWidth * C-sideBarWidth;
    var canvasHeight = viewportHeight * C;

    window.maxScreenSize = viewportWidth;
    if (viewportWidth < viewportHeight) {
      maxScreenSize = viewportHeight;
    }

    window.minScreenSize = canvasWidth;
    if (minScreenSize > canvasHeight) {
      minScreenSize = canvasHeight;
    }
    //ctx.font= "14 pt Lobster, Helvetica, sans-serif";
    if (minScreenSize < 500) {
      titleFont = "10 pt 'Merienda One', cursive"
      labelFont = "6 pt Helvetica, sans-serif";
    } else {
      titleFont = "14 pt 'Merienda One', cursive"
      labelFont = "10 pt Helvetica, sans-serif";
    }

    el = document.getElementById("a");
    //el.style.position = "fixed";
    el.style.zindex = 1;
    el.setAttribute("width", canvasWidth);
    el.setAttribute("height", canvasHeight);
    el.style.top = (viewportHeight - canvasHeight) / 2;
    el.style.left = (viewportWidth - canvasWidth) / 2;

    window.ctx = el.getContext("2d");
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    loadButton();
  }
  //Getting window size:
  //this works in chrome and on android.
  //http://stackoverflow.com/questions/1152203/centering-a-canvas/1646370#1646370
  //window.onload = window.onresize = function() {

  window.onload = window.onresize = function() {
    initCanvas();
  }