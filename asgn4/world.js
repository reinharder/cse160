const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;

var VSHADER_SOURCE =`
   precision mediump float;
   attribute vec4 a_Position;
   attribute vec2 a_UV;
   attribute vec3 a_Normal;
   varying vec2 v_UV;
   varying vec3 v_Normal;
   varying vec4 v_VertPos;
   uniform mat4 u_ModelMatrix;
   uniform mat4 u_NormalMatrix;
   uniform mat4 u_GlobalRotateMatrix;
   uniform mat4 u_ViewMatrix;
   uniform mat4 u_ProjectionMatrix;
  void main() {
    gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
    v_UV = a_UV;
    //v_Normal = a_Normal;
    v_Normal = normalize(vec3(u_NormalMatrix * vec4(a_Normal,1)));
    v_VertPos = u_ModelMatrix * a_Position;
  }`

// Fragment shader program
var FSHADER_SOURCE =`
  precision mediump float;
  varying vec2 v_UV;
  varying vec3 v_Normal;
  varying vec4 v_VertPos;
  uniform vec4 u_FragColor;
  uniform sampler2D u_Sampler0;
  uniform sampler2D u_Sampler1;
  uniform vec3 u_lightPos;
  uniform vec3 u_cameraPos;
  uniform int u_whichTexture;
  uniform bool u_lightOn;
  uniform bool u_spotlightOn;
  uniform vec3 u_spotlightPos;
  uniform vec3 u_spotlightDir;
  uniform float u_spotlightCutoff;
  uniform float u_spotlightExponent;

  void main() {
    if (u_whichTexture == -2) {
      gl_FragColor = u_FragColor;
    } else if (u_whichTexture == -1) {
      gl_FragColor = vec4((v_Normal+1.0)/2.0, 1.0);
    } else if (u_whichTexture == 0) {
      gl_FragColor = texture2D(u_Sampler0, v_UV);
    } 
      else if (u_whichTexture == 1) {
      gl_FragColor = texture2D(u_Sampler1, v_UV);
    } else {
      gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
    }

    vec3 lightVector = u_lightPos - vec3(v_VertPos);
    float r = length(lightVector);

    //red green visualizer
    //if (r < 1.0) {
    //  gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    //} else if (r < 2.0) {
    //  gl_FragColor = vec4(0.0, 1.0, 0.0, 1.0); 
    //}

    //light fall off
    //gl_FragColor = vec4(vec3(gl_FragColor)/(r*r), 1.0);

      // N dot L
      vec3 N = normalize(v_Normal);
      vec3 L = normalize(lightVector);

      float nDotL = max(dot(N,L), 0.0);

      // Reflection
      vec3 R = reflect(-L,N);

      // eye
      vec3 E = normalize(u_cameraPos-vec3(v_VertPos));

      // Specular
      float specular = pow(max(dot(E,R), 0.0), 10.0)* 0.5;

      vec3 diffuse = vec3(gl_FragColor) * nDotL * 0.7;
      vec3 ambient = vec3(gl_FragColor) * 0.3;

      if (u_lightOn) {
        gl_FragColor = vec4(diffuse + ambient + specular, 1.0);
    } 


    // Spotlight calculations
    vec3 spotDir = normalize(-u_spotlightDir);
    vec3 spotVector = normalize(u_spotlightPos - vec3(v_VertPos));
    float spotCosine = dot(spotVector, spotDir);
    float spotFactor = 0.0;
    
    if (spotCosine >= u_spotlightCutoff) {
        spotFactor = pow(spotCosine, u_spotlightExponent);
    }
    
    diffuse *= spotFactor;
    specular *= spotFactor;

    // Apply spotlight effect if enabled
       if (u_spotlightOn) {
        gl_FragColor = vec4(diffuse + ambient + specular, 1.0);
       }
  }`

let canvas;
let gl;
let a_Position;
let u_FragColor;
let u_Size;
let drag = false;
let u_ModelMatrix;
let u_NormalMatrix;
let u_GlobalRotateMatrix;
let u_sampler0;
let u_sampler1;
let u_ViewMatrix;
let u_ProjectionMatrix;
let a_UV;
var u_whichTexture;
let u_lightPos;
let u_cameraPos;
let u_lightOn;
let u_spotlightOn;
let u_spotlightPos;
let u_spotlightDir;
let u_spotlightCutoff = 30;
let u_spotlightExponent = 10;


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
  g_camera = new Camera();
}

function connectVariablestoGLSL(){
      
  // // Get the storage location of a_Position
  a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }

  a_UV = gl.getAttribLocation(gl.program, 'a_UV');
  if (a_UV < 0) {
    console.log('Failed to get the storage location of a_UV');
    return;
  }

  a_Normal = gl.getAttribLocation(gl.program, 'a_Normal');
  if (a_Normal < 0) {
    console.log('Failed to get the storage location of a_Normal');
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

  u_NormalMatrix = gl.getUniformLocation(gl.program, 'u_NormalMatrix');
  if (!u_NormalMatrix) {
    console.log('Failed to get the storage location of u_NormalMatrix');
    return;
  }

  u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix');
  if (!u_GlobalRotateMatrix) {
    console.log('Failed to get the storage location of u_GlobalRotateMatrix');
    return;
  }

  u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
  if (!u_ViewMatrix) {
    console.log('Failed to get the storage location of u_ViewMatrix');
    return;
  }

  u_ProjectionMatrix = gl.getUniformLocation(gl.program, 'u_ProjectionMatrix');
  if (!u_ProjectionMatrix) {
    console.log('Failed to get the storage location of u_ProjectionMatrix');
    return;
  }

  u_sampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0');
  if (!u_sampler0) {
    console.log('Failed to get the storage location of u_Sampler0');
    return;
  }

  u_sampler1 = gl.getUniformLocation(gl.program, 'u_Sampler1');
  if (!u_sampler1) {
    console.log('Failed to get the storage location of u_Sampler1');
    return;
  }

  u_whichTexture = gl.getUniformLocation(gl.program, 'u_whichTexture');
  if (!u_whichTexture) {
    console.log('Failed to get the storage location of u_whichTexture');
    return;
  }

  u_lightPos = gl.getUniformLocation(gl.program, 'u_lightPos');
  if (!u_lightPos) {
    console.log('Failed to get the storage location of u_lightPos');
    return;
  }

  u_cameraPos = gl.getUniformLocation(gl.program, 'u_cameraPos');
  if (!u_cameraPos) {
    console.log('Failed to get the storage location of u_cameraPos');
    return;
  }

  u_lightOn = gl.getUniformLocation(gl.program, 'u_lightOn');
  if (!u_lightOn) {
    console.log('Failed to get the storage location of u_lightOn');
    return;
  }

  u_spotlightOn = gl.getUniformLocation(gl.program, 'u_spotlightOn');
  if (!u_spotlightOn) {
    console.log('Failed to get the storage location of u_spotlightOn');
    return;
  }

  u_spotlightDir = gl.getUniformLocation(gl.program, 'u_spotlightDir');
  if (!u_spotlightDir) {
    console.log('Failed to get the storage location of u_spotlightDir');
    return;
  }
  u_spotlightPos = gl.getUniformLocation(gl.program, 'u_spotlightPos');
  if (!u_spotlightPos) {
    console.log('Failed to get the storage location of u_spotlightPos');
    return;
  }

  u_spotlightCutoff = gl.getUniformLocation(gl.program, 'u_spotlightCutoff');
  if (!u_spotlightCutoff) {
  console.log('Failed to get the storage location of u_spotlightCutoff');
  return;
}

u_spotlightExponent = gl.getUniformLocation(gl.program, 'u_spotlightExponent');
if (!u_spotlightExponent) {
  console.log('Failed to get the storage location of u_spotlightExponent');
  return;
}

  var identityM = new Matrix4();
  gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);
  // Set up the view and projection matrices
  var viewMatrix = new Matrix4();
  viewMatrix.setLookAt(0, 0, 5, 0, 0, 0, 0, 1, 0);
  gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);

  var projMatrix = new Matrix4();
  projMatrix.setPerspective(30, canvas.width / canvas.height, 1, 100);
  gl.uniformMatrix4fv(u_ProjectionMatrix, false, projMatrix.elements);
}

function initTextures() {
  var image = new Image();  // Create the image object
  var image1 = new Image();
  if (!image) {
     console.log('Failed to create the image object');
     return false;
  }
  if (!image1) {
      console.log('Failed to create the image object');
      return false;
    }

  // Register the event handler to be called on loading an image
  image.onload = function(){ loadTexture(image); };
  image1.onload = function(){ loadTexture1(image1); };
  // Tell the browser to load an image
  image.src = 'dirt4.png';
  image1.src = 'grass1.png';

  // Add more texture loading here // DEBUG:
  return true;
}

function loadTexture(image) {
  var texture = gl.createTexture();
  if (!texture) {
    console.log('Failed to create the texture object');
    return false;
  }
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
  gl.activeTexture(gl.TEXTURE0); // Activate texture unit 0
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
  gl.uniform1i(u_sampler0, 0);
  
  console.log('dirt loaded');
}

function loadTexture1(image) {
  var texture = gl.createTexture();
  if (!texture) {
    console.log('Failed to create the texture object');
    return false;
  }
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
  gl.activeTexture(gl.TEXTURE1); // Activate texture unit 1
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
  gl.uniform1i(u_sampler1, 1);

  console.log('grass loaded');
}



let g_selectColors = [1.0, 1.0, 1.0, 1.0];
let g_selectSize = 10.0;
let g_selectSegment = 10.0;
let globalangle = 0;
let global_angle_x = 0;
let global_angle_y = 0;
let g_angle = 0;
let h_angle = 0;
let g_camera;
let g_normal = false;
let g_animation = false;
let g_animation2 = false;
let g_lightPos = [0, 1, 1];
let g_spotlightPos = [0, 1, 2];
let g_lightOn = false;
let g_spotlightOn = false;
let g_spotlightDir = [0, -1, -1];

function addActionsForHtmlUI() {
  document.getElementById('on').onclick   = function() { g_normal = true;};
  document.getElementById('off').onclick  = function() { g_normal = false;};
  document.getElementById('aniOn').onclick  = function() { g_animation = true;};
  document.getElementById('aniOff').onclick  = function() { g_animation = false;};
  document.getElementById('aniSpotOn').onclick  = function() { g_animation2 = true;};
  document.getElementById('aniSpotOff').onclick  = function() { g_animation2 = false;};
  document.getElementById('lightOn').onclick  = function() { g_lightOn = true;};
  document.getElementById('lightOff').onclick  = function() { g_lightOn = false;};
  document.getElementById('spotlightOn').onclick  = function() { g_spotlightOn = true;};
  document.getElementById('spotlightOff').onclick  = function() { g_spotlightOn = false;};
  document.getElementById('lightx').addEventListener('input', function() { g_lightPos[0] = this.value; renderScene();});
  document.getElementById('lighty').addEventListener('input', function() { g_lightPos[1] = this.value; renderScene();});
  document.getElementById('lightz').addEventListener('input', function() { g_lightPos[2] = this.value; renderScene();});
  document.getElementById('spotlightx').addEventListener('input', function() { g_spotlightPos[0] = this.value; renderScene();});
  document.getElementById('spotlighty').addEventListener('input', function() { g_spotlightPos[1] = this.value; renderScene();});
  document.getElementById('spotlightz').addEventListener('input', function() { g_spotlightPos[2] = this.value; renderScene();});
  document.getElementById('spotlightDirx').addEventListener('input', function() { g_spotlightDir[0] = this.value; renderScene();});
  document.getElementById('spotlightDiry').addEventListener('input', function() { g_spotlightDir[1] = this.value; renderScene();});
  document.getElementById('spotlightDirz').addEventListener('input', function() { g_spotlightDir[2] = this.value; renderScene();});

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
  //var g_camera = new Camera();
  setupWebGL();
  connectVariablestoGLSL();
  addActionsForHtmlUI();
  canvas.onmousemove = function(ev){ if (ev.buttons == 1) { click(ev); }else{pre_mouse_pos = null} };
  canvas.onclick = function(ev){ if (ev.shiftKey){g_nod = !g_nod; g_walk = !g_walk} };

  document.onkeydown = keydown;
  initTextures();

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


  if (g_animation) {   
    updateAnimationAngles();
  }

  if (g_animation2) {
    updateAnimationAngles2();
  }


  renderScene();

  requestAnimationFrame(tick);
}


function updateAnimationAngles(){
  g_lightPos[0] = Math.cos(g_seconds);
}

function updateAnimationAngles2(){
  g_spotlightPos[2] = Math.cos(g_seconds);
}

function mouseCam(ev){
  coord = convertCoordinatesEventToGL(ev);
  if(coord[0] < 0.5){ // left side
     g_camera.panMLeft(coord[0]*-10);
  } else{
     g_camera.panMRight(coord[0]*-10);
  }
}

function keydown(ev){
  if(ev.keyCode == 65){ //a
     g_camera.right();
  } else if (ev.keyCode == 68){ //d
     g_camera.left();
  } else if (ev.keyCode == 87){ //w
     g_camera.forward();
  } else if (ev.keyCode == 83){ //s
     g_camera.back();
  } else if (ev.keyCode==81){ 
     g_camera.panLeft();
  } else if (ev.keyCode==69){ 
     g_camera.panRight();
  }
  renderScene();
}

function renderScene(){
  var startTime = performance.now();
  var projMat = g_camera.projMat;
  gl.uniformMatrix4fv(u_ProjectionMatrix, false, projMat.elements);

  // Pass the view matrix
  var viewMat = g_camera.viewMat;
  gl.uniformMatrix4fv(u_ViewMatrix, false, viewMat.elements);

  //ViewMat.setLookAt(0, 0, -1, 0, 0, 0, 0, 1, 0);

  //gl.uniformMatrix4fv(u_ViewMatrix, false, ViewMat.elements);
  var globalRotMat = new Matrix4();
  globalRotMat.rotate(-10 + global_angle_y, 1, 0, 0);
  globalRotMat.rotate(global_angle_x, 0, 1, 0);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.clear(gl.COLOR_BUFFER_BIT);

  drawMap();
  drawEnv();

  var test = new Cube();
  test.matrix.scale(.5,.5,.5);
  test.matrix.translate(0,0,-3);
  test.color = [0.0, 0.0, 1.0, 1.0];
  test.textureNum = -2;
  if (g_normal) {
    test.textureNum = -1;
  }
  test.normalMatrix.setInverseOf(test.matrix).transpose();
  test.render();
  
  var sphere = new Sphere();
  sphere.matrix.scale(.5,.5,.5);
  sphere.matrix.translate(-3,1,0);
  sphere.textureNum = -2;
  if (g_normal) {
    sphere.textureNum = -1;
  }
  sphere.normalMatrix.setInverseOf(sphere.matrix).transpose();
  sphere.render();

  gl.uniform3f(u_lightPos, g_lightPos[0], g_lightPos[1], g_lightPos[2]);
  gl.uniform1i(u_lightOn, g_lightOn);

 
  var light = new Cube();
  light.matrix.translate(g_lightPos[0], g_lightPos[1], g_lightPos[2]);
  light.matrix.scale(.1,.1,.1);
  light.color = [1.0, 1.0, 0.0, 1.0];
  light.textureNum = -2;
  light.normalMatrix.setInverseOf(light.matrix).transpose();
  light.render();


  gl.uniform3f(u_spotlightPos, g_spotlightPos[0], g_spotlightPos[1], g_spotlightPos[2]);
  gl.uniform1i(u_spotlightOn, g_spotlightOn);

   // Set spotlight parameters
   gl.uniform3f(u_spotlightDir, g_spotlightDir[0], g_spotlightDir[1], g_spotlightDir[2]);
   gl.uniform1f(u_spotlightCutoff, Math.cos(Math.PI / 6)); // 30 degrees cutoff
    gl.uniform1f(u_spotlightExponent, 10.0);

  var spotlight = new Cube();
  spotlight.matrix.translate(g_spotlightPos[0], g_spotlightPos[1], g_spotlightPos[2]);
  spotlight.matrix.scale(.1,.1,.1);
  spotlight.color = [1.0, 1.0, 0.0, 1.0];
  spotlight.textureNum = -2;
  spotlight.normalMatrix.setInverseOf(spotlight.matrix).transpose();
  spotlight.render();

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

