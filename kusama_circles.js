
var socket = io.connect('http://192.168.1.30:8080');


function sketchProc($p){
  var Circle = (function() {
      function Circle() {
      var $this_1 = this;
      function $superCstr(){$p.extendClassChain($this_1)}
      $this_1.rad = 0;
      $this_1.x = 0;
      $this_1.y = 0;
      $this_1.c = 0;
      $this_1.growing = false;
      $this_1.growing_r= 0;
      function render$0() {
      if($this_1.growing && $this_1.growing_r<$this_1.rad){
      $p.noStroke();
      $p.fill($this_1.c, 100, 100, 100);
      $p.ellipse($this_1.x, $this_1.y, $this_1.growing_r, $this_1.growing_r);
      $this_1.growing_r+=grow_inc;

      }
      else{
      $p.noStroke();
      $p.fill($this_1.c, 100, 100, 100);
      $p.ellipse($this_1.x, $this_1.y, $this_1.rad, $this_1.rad);
      }
      }
      $p.addMethod($this_1, 'render', render$0, false);
      function $constr_5(_x, _y, _r, _c, _growing){
	$superCstr();

	$this_1.x=_x;
	$this_1.y=_y;
	$this_1.rad=_r;
	$this_1.c=_c;
	$this_1.growing = _growing;
      }

      function $constr() {
	if(arguments.length === 5) { $constr_5.apply($this_1, arguments); } else $superCstr();
      }
      $constr.apply(null, arguments);
      }
      return Circle;
  })();
  $p.Circle = Circle;

  var r = 0;
  var circles =  new $p.ArrayList();
  var width =1200;
  var height =  1000;
  var grow_inc = 2;

  var c_temp = 0;

  function setup() {
    $p.colorMode($p.HSB, 360, 100, 100, 100);
    $p.size(width, height);
    $p.smooth();
  }
  $p.setup = setup;

  function draw() {
    $p.background(0,0,100,0);

    if ($p.__mousePressed==false) {
      addCircle();
          }

    for (var i = 0;  i<circles.size();  i++) {
      var c =   circles.get(i);
      c.render();
    }

    if ($p.__mousePressed == true) {

	growCircle();  
    }
  }

  function addCircle(){
    if(r!=0){
     var c =  new Circle($p.mouseX, $p.mouseY, r, c_temp, false);
      circles.add(c);
      //send circle
      var circle_vars = {'x': $p.mouseX, 'y' : $p.mouseY, 'r': r, 'c' : c_temp}
      socket.emit("complete-circle", {data: circle_vars}); 
      r=0;
      c_temp = Math.floor($p.random(360));


    }
   $p.__mousePressed=false;
  }

  function growCircle(){
     $p.fill(c_temp, 100,100);
      $p.ellipse($p.mouseX, $p.mouseY, r, r);
      r=r+2;
     $p.__mousePressed = true;
  }

  socket.on('add-circle', function(data){
      var c_data = data['data'];
      var new_circle =  new Circle(c_data['x'], c_data['y'], c_data['r'], c_data['c'], true);
      circles.add(new_circle);
      });

  $p.draw = draw;

canvas.addEventListener("touchmove", preventBehavior, false);
canvas.addEventListener("touchstart", growCircle(), false);
canvas.addEventListener("touchend", addCircle(), false);


}

var canvas = document.getElementById("kusama_circles");
$pinstance = new Processing(canvas, sketchProc);

//for mobile
function preventBehavior(e) {
      e.preventDefault(); 
};

document.addEventListener("touchmove", preventBehavior, false);


