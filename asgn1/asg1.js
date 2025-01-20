const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;

let canvas;
let gl;
let a_Position;
let u_FragColor;
let u_Size;
let drag = false;

var VSHADER_SOURCE =`
  attribute vec4 a_Position;
  uniform float u_Size;
  void main() {
    gl_Position = a_Position;
    gl_PointSize = u_Size;
  }`

// Fragment shader program
var FSHADER_SOURCE =`
  precision mediump float;
  uniform vec4 u_FragColor;
  void main() {
    gl_FragColor = u_FragColor;
  }`


function setupWebGL() {
    // Retrieve <canvas> element
  canvas = document.getElementById('webgl');
    // Get the rendering context for WebGL
  gl = canvas.getContext("webgl", { preserveDrawingBuffer: true});
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }
}

function connectVariablestoGLSL(){
      
  // // Get the storage location of a_Position
  a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }

  // Get the storage location of u_FragColor
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }

  u_Size = gl.getUniformLocation(gl.program, 'u_Size');
  if (!u_Size) {
    console.log('Failed to get the storage location of u_Size');
    return;
  }
}


let g_selectColors = [1.0, 1.0, 1.0, 1.0];
let g_selectSize = 10.0;
let g_selectSegment = 10.0;
let randomColorEnabled = false;
let randomSizeEnabled = false;

function addActionsForHtmlUI() {
  document.getElementById('clear').onclick = function() {g_shapeList = []; renderAllShapes(); };
  document.getElementById('square').onclick    = function() { g_selectedType = POINT;    g_outline = 0;};
  document.getElementById('triangle').onclick  = function() { g_selectedType = TRIANGLE; g_outline = 0;};
  document.getElementById('circle').onclick    = function() { g_selectedType = CIRCLE;   g_outline = 0;};
  document.getElementById('drawing').onclick    = function() { point = new Drawing(); g_shapeList.push(point); renderAllShapes();};
  
  document.getElementById('red').oninput = function() {g_selectColors[0] = this.value/100;};
  document.getElementById('green').oninput = function() {g_selectColors[1] = this.value/100;};
  document.getElementById('blue').oninput = function() {g_selectColors[2] = this.value/100;};
  
  document.getElementById('random').onclick = function() { randomColorEnabled = this.checked; };
  document.getElementById('size').oninput = function() {g_selectSize = this.value;};
  document.getElementById('segment').oninput = function() {g_selectSegment = this.value;};
  document.getElementById('random1').onclick = function() { randomSizeEnabled = this.checked; };
}

function main(){
  setupWebGL();
  connectVariablestoGLSL();
  addActionsForHtmlUI();

  // Register function (event handler) to be called on a mouse press
   canvas.onmousedown = function(ev){
   click(ev);
   drag = true;
   };
   canvas.onmouseup = function(ev){
   drag = false;
   };
   canvas.onmousemove = function(ev){
   if(drag){
      click(ev);
   }
   };

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);
}

function convertCoordinatesEventToGL(ev) {
  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  var rect = ev.target.getBoundingClientRect();

  x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

  return ([x, y]);
}


let g_shapeList = [];
let g_selectedType = POINT;



function click(ev) {
  var [x,y] = convertCoordinatesEventToGL(ev);
  var point;
  if(g_selectedType==POINT){
    point = new Point();
  } else if (g_selectedType==TRIANGLE){
    point = new Triangle();
  } else if (g_selectedType==CIRCLE){
    point = new Circle();
    point.segments = g_selectSegment;
    }
  point.position = [x, y];
  if (randomColorEnabled) {
    point.color = [Math.random(), Math.random(), Math.random(), 1.0]; // Random RGBA color
  } else {
    point.color = g_selectColors.slice(); // Use selected color
  }
  if (randomSizeEnabled) {
    point.size = Math.random() * 25; // Random Size
  } else {
    point.size = g_selectSize; // Use selected size
  }
  g_shapeList.push(point);

  renderAllShapes();

}

function renderAllShapes() {
  gl.clear(gl.COLOR_BUFFER_BIT);

  var len = g_shapeList.length;
  for(var i = 0; i < len; i++) {
    g_shapeList[i].render();
  }
}
