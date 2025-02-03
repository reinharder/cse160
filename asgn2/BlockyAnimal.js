const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;

let canvas;
let gl;
let a_Position;
let u_FragColor;
let u_Size;
let drag = false;
let u_ModelMatrix;
let u_GlobalRotateMatrix;



var VSHADER_SOURCE =`
  attribute vec4 a_Position;
  uniform float u_Size;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_GlobalRotateMatrix;
  void main() {
    gl_Position = u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
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

  gl.enable(gl.DEPTH_TEST);

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

  u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  if (!u_ModelMatrix) {
    console.log('Failed to get the storage location of u_ModelMatrix');
    return;
  }

  u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix');
  if (!u_GlobalRotateMatrix) {
    console.log('Failed to get the storage location of u_GlobalRotateMatrix');
    return;
  }

  var identityM = new Matrix4();
  gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);
}


let g_selectColors = [1.0, 1.0, 1.0, 1.0];
let g_selectSize = 10.0;
let g_selectSegment = 10.0;
let globalangle = 0;
let global_angle_x = 0;
let global_angle_y = 0;
let g_angle = 0;
let h_angle = 0;
let randomColorEnabled = false;
let randomSizeEnabled = false;
let g_animation = false;
let g_nod = false;
let g_walk = true;

function addActionsForHtmlUI() {
  document.getElementById('on').onclick   = function() { g_animation = true;};
  document.getElementById('off').onclick  = function() { g_animation = false;};
  
  
  document.getElementById('joint').oninput = function() {g_angle = this.value; renderScene();};
  document.getElementById('joint2').oninput = function() {h_angle = this.value; renderScene();};

  document.getElementById('camera').addEventListener('input', function() { global_angle_x = this.value; renderScene();});

}
function convertToGLSpace(ev){
  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  var rect = ev.target.getBoundingClientRect();

  x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

  //return both variables
  return ([x,y]);
}

var pre_mouse_pos;

function click(ev) {
  //get the cordinates of ev and convert to webgl space and then place into x,y
  let [x,y] = convertToGLSpace(ev);

  let x_sens = 10;
  let y_sense = 10;

  let curent_mouse_pos = [ev.clientX ,ev.clientY]

  if (pre_mouse_pos != null) {
    let movement_x = (curent_mouse_pos[0] - pre_mouse_pos[0])
    let movement_y = (curent_mouse_pos[1] - pre_mouse_pos[1])/2
    
    global_angle_y -= movement_y;

    global_angle_x -= movement_x;

  }

  if (ev.buttons == 1) {
    pre_mouse_pos = curent_mouse_pos;
  }
  else{
    pre_mouse_pos = null;
  }

  //renderScene();

  
}

function main(){
  setupWebGL();
  connectVariablestoGLSL();
  addActionsForHtmlUI();
  canvas.onmousemove = function(ev){ if (ev.buttons == 1) { click(ev); }else{pre_mouse_pos = null} };
  canvas.onclick = function(ev){ if (ev.shiftKey){g_nod = !g_nod; g_walk = !g_walk} };



  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Clear <canvas>
  //renderScene();
  requestAnimationFrame(tick);
  
}

var g_startTime = performance.now() / 1000;
var g_seconds = performance.now() / 1000 - g_startTime;


function tick(){
  g_seconds = performance.now() / 1000 - g_startTime;
  //console.log(g_seconds);
  animationUpdate();
  animation2();

  renderScene();

  requestAnimationFrame(tick);
}

function animationUpdate() {
  if (g_animation){
    if (g_walk) {
          h_angle = -(15*Math.sin(10*g_seconds));
    //console.log(g_angle);
    }
  } 
}

function animation2() {
  if (g_animation){
    if (g_nod) {
      g_angle = (10*Math.sin(g_seconds));
    }
  }
}


function renderScene(){
  var startTime = performance.now();
  var globalRotMat = new Matrix4()
  globalRotMat.rotate(-10 + global_angle_y, 1, 0, 0);
  globalRotMat.rotate(global_angle_x, 0, 1, 0);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.clear(gl.COLOR_BUFFER_BIT);

  renderPig();




  
  let duration = performance.now() - startTime;
  sendTextToHTML(`Ms: ${Math.floor(duration)}, FPS: ${Math.floor(10000/duration)/10}`, 'info');
}
const sendTextToHTML = (text, htmlTag) => {
  let htmlObj = document.getElementById(htmlTag);
  if (!htmlObj) {
    console.log(`Failed to get ${htmlTag} from HTML`);
    return;
  }
  htmlObj.innerHTML = text;
}


