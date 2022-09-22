  /// Referencing the HTML <canvas> element + creating context
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

    //n - the number of points used to define the curve => (n-1) straight line segments
var n = 100000,
    //define the math "window" size
    xMin = -20, xMax = 20, yMin = -10, yMax = 10,
    //initialize math.js library
    math = mathjs(),
    //expr - input math expression as a string
    expr = '',
    //scope - define var available in the math expr
    scope = { x: 0 },
    //http://en.wikipedia.org/wiki/Abstract_syntax_tree
    tree;

    ///Generating the coordinate axes
function drawOy() {
  ctx.beginPath();
  ctx.moveTo(canvas.width/2, 0);
  ctx.lineTo(canvas.width/2, canvas.height);
  ctx.stroke();
  ctx.closePath();
}
function drawOx(){
  ctx.beginPath();
  ctx.moveTo(0, canvas.height/2);
  ctx.lineTo(canvas.width, canvas.height/2);
  ctx.stroke();
  ctx.closePath();
}
function drawOygrids(step) {
  ctx.beginPath();
  ctx.moveTo((canvas.width/2)-3, (canvas.height/2)+step);
  ctx.lineTo((canvas.width/2)+3, (canvas.height/2)+step);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo((canvas.width/2)-3, (canvas.height/2)-step);
  ctx.lineTo((canvas.width/2)+3, (canvas.height/2)-step);
  ctx.stroke();
}
function drawOxgrids(step) {
  ctx.beginPath();
  ctx.moveTo((canvas.width/2)+step, (canvas.height/2)-3);
  ctx.lineTo((canvas.width/2)+step, (canvas.height/2)+3);
  ctx.stroke();
  ctx.closePath();
  ctx.beginPath();
  ctx.moveTo((canvas.width/2)-step, (canvas.height/2)-3);
  ctx.lineTo((canvas.width/2)-step, (canvas.height/2)+3);
  ctx.stroke();
  ctx.closePath();
}
function drawAxes() {
  //Oy
  drawOy();
  //Oy grids - p is a counter
  var unit = 30;
  var p = 0, step = unit;
  while(p*unit <= canvas.height/2)
  {
    drawOygrids(step);
    p++;
    step += unit;
  }
  //Ox
  drawOx();
  //Ox grids - p has the same purpose as in the Oy grid representation
  p = 0, step = unit;
  while(p*unit <= canvas.width/2)
  {
    drawOxgrids(step);
    p++;
    step += unit;
  }
}
drawAxes();

  /// Generating the graph:
  /// After converting the coordinate system, we will section the Ox axis and plot the functions
  /// for each of those sections (similar to sectioning in integrals)
function drawGraph() {
  ///Changing Canvas HTML Coordinate System into Cartesian Coordinate System
      //used in the for loop
  var i, x, y,
      //sections vary between 0 and 1
      percentX, percentY,
      //math coordinates, vary from xMin to xMax and from yMin to yMax respectively
      mathX, mathY;

  ctx.beginPath();
  for(i = 0; i < n; i++) {
    percentX = i / (n-1);
    //xMax - xMin = the absolute length of the Ox axis
    mathX = percentX * (xMax - xMin) + xMin;
    //determining function value in point mathX
    mathY = evalMathExp(mathX);
    //projecting mathY from [yMin, yMax] to [0,1]
    percentY = (mathY - yMin) / (yMax-yMin);
    //since the result will be the proportional distance from the bottom of the canvas to mathY
    //and we want the proportional distance from the top of the canvas
    percentY = 1-percentY;  //where 1 is the Oy axis length
    //projecting percentX and percentY to pixel/HTML Canvas coordinates
    x = percentX * canvas.width;
    y = percentY * canvas.height;
    ctx.lineTo(x,y);
  }
  ctx.lineWidth = 2;
  color = document.getElementById("colorPicker").value;
  ctx.strokeStyle = color;
  ctx.stroke();
  ctx.closePath();
}


  ///Evaluating the input math expression
function evalMathExp(mathX) {
  expr = document.getElementById("expression").value;
  tree = math.parse(expr, scope);
  scope.x = mathX;
  var mathY = tree.eval();
  return mathY;
}

  ///Button zoom functions
function zoomIn() {
  xMin/=2, xMax/=2, yMin/=2, yMax/=2;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawAxes();
  drawGraph();
}

function zoomOut() {
  xMin*=2, xMax*=2, yMin*=2, yMax*=2;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawAxes();
  drawGraph();
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawAxes();
}
