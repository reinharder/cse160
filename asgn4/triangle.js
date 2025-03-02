class Triangle {
   constructor() {
     this.type = 'triangle';
     this.position = [0.0, 0.0, 0.0];
     this.color = [1.0, 1.0, 1.0, 1.0];
     this.size = 5.0;
 
     // Create a reusable buffer
     this.buffer = gl.createBuffer();
     if (!this.buffer) {
       console.error('Failed to create the buffer object');
     }
   }
 
     render(){
        var xy = this.position;
        var rgba = this.color;
        var size = this.size;
     
        // Pass color to u_FragColor
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
     
        // Pass the size tp u_Size
        gl.uniform1f(u_Size, size);
     
        var d = size/100.0;
        drawTriangle([xy[0]-d/2, xy[1]-d/2, xy[0]+d/2, xy[1]-d/2, xy[0], xy[1]+d/2]);
 
     }
 }
 
 let triangleBuffer = null;
 
 function drawTriangle3D(vertices) {
   const n = 3;
 
   // Create the buffer once if not already created
   if (!triangleBuffer) {
     triangleBuffer = gl.createBuffer();
     if (!triangleBuffer) {
       console.error('Failed to create the buffer object');
       return -1;
     }
   }
 
   // Bind the buffer object to target
   gl.bindBuffer(gl.ARRAY_BUFFER, triangleBuffer);
 
   // Update the buffer data
   gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);
 
   // Assign the buffer object to a_Position variable
   gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
 
   // Enable the assignment to a_Position variable
   gl.enableVertexAttribArray(a_Position);
 
   // Draw the triangle
   gl.drawArrays(gl.TRIANGLES, 0, n);
 }
 
 function drawTriangle3DUV(vertices, uv) {
  const n = 3;

  // Create the buffer once if not already created
  if (!triangleBuffer) {
    triangleBuffer = gl.createBuffer();
    if (!triangleBuffer) {
      console.error('Failed to create the buffer object');
      return -1;
    }
  }

  // Bind the buffer object to target
  gl.bindBuffer(gl.ARRAY_BUFFER, triangleBuffer);

  // Update the buffer data
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);

  // Assign the buffer object to a_Position variable
  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);

  // Enable the assignment to a_Position variable
  gl.enableVertexAttribArray(a_Position);

  var uvBuffer = gl.createBuffer();
  if (!uvBuffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }
  gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uv), gl.DYNAMIC_DRAW);
  gl.vertexAttribPointer(a_UV, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_UV);


  // Draw the triangle
  gl.drawArrays(gl.TRIANGLES, 0, n);

}

 function drawTriangle3DUVNormal(vertices, uv, normals) {
  var n = vertices.length/3;

  // Create the buffer once if not already created
  if (!triangleBuffer) {
    triangleBuffer = gl.createBuffer();
    if (!triangleBuffer) {
      console.error('Failed to create the buffer object');
      return -1;
    }
  }

  // Bind the buffer object to target
  gl.bindBuffer(gl.ARRAY_BUFFER, triangleBuffer);

  // Update the buffer data
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);

  // Assign the buffer object to a_Position variable
  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);

  // Enable the assignment to a_Position variable
  gl.enableVertexAttribArray(a_Position);

  var uvBuffer = gl.createBuffer();
  if (!uvBuffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }
  gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uv), gl.DYNAMIC_DRAW);
  gl.vertexAttribPointer(a_UV, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_UV);


  var normalBuffer = gl.createBuffer();
  if (!normalBuffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }
  gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.DYNAMIC_DRAW);
  gl.vertexAttribPointer(a_Normal, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_Normal);

  // Draw the triangle
  gl.drawArrays(gl.TRIANGLES, 0, n);

  g_vertexBuffer = null;



}
