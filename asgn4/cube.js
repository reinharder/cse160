class Cube {
  constructor() {
    this.type = 'cube';
    this.color = [1.0, 1.0, 1.0, 1.0];
    this.matrix = new Matrix4();
    this.normalMatrix = new Matrix4();
    this.textureNum = 0;
  }

  render() {
      var rgba = this.color;

      // Pass the texture number
      gl.uniform1i(u_whichTexture, this.textureNum);

      // Pass the color of a point to u_FragColor variable
      gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

      // Pass the matrix to u_ModelMatrix attribute
      gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

      // Calculate the matrix to transform the normals and pass it to u_NormalMatrix
      gl.uniformMatrix4fv(u_NormalMatrix, false, this.normalMatrix.elements);
      // Front of Cube
      drawTriangle3DUVNormal([0,0,0, 1,1,0, 1,0,0],[0,0, 1,1, 1,0], [0,0,-1, 0,0,-1, 0,0,-1]);
      drawTriangle3DUVNormal([0,0,0, 0,1,0, 1,1,0],[0,0, 0,1, 1,1], [0,0,-1, 0,0,-1, 0,0,-1]);

      // gl.uniform4f(u_FragColor, rgba[0]*.9, rgba[1]*.9, rgba[2]*.9, rgba[3]);
      // Top
      drawTriangle3DUVNormal([1,1,0, 1,1,1, 0,1,0],[1,0, 1,1, 0,0], [0,1,0, 0,1,0, 0,1,0]);
      drawTriangle3DUVNormal([0,1,1, 1,1,1, 0,1,0],[0,1, 1,1, 0,0], [0,1,0, 0,1,0, 0,1,0]);

      // gl.uniform4f(u_FragColor, rgba[0]*.8, rgba[1]*.8, rgba[2]*.8, rgba[3]);
      // Right
      drawTriangle3DUVNormal([1,0,0, 1,1,0, 1,1,1],[0,0, 0,1, 1,1], [1,0,0, 1,0,0, 1,0,0]);
      drawTriangle3DUVNormal([1,0,0, 1,0,1, 1,1,1],[0,0, 1,0, 1,1], [1,0,0, 1,0,0, 1,0,0]);

      // gl.uniform4f(u_FragColor, rgba[0]*.7, rgba[1]*.7, rgba[2]*.7, rgba[3]);
      // Left
      drawTriangle3DUVNormal([0,0,0, 0,0,1, 0,1,1],[1,0, 0,0, 0,1], [-1,0,0, -1,0,0, -1,0,0]);
      drawTriangle3DUVNormal([0,0,0, 0,1,0, 0,1,1],[1,0, 1,1, 0,1], [-1,0,0, -1,0,0, -1,0,0]);

      // gl.uniform4f(u_FragColor, rgba[0]*.6, rgba[1]*.6, rgba[2]*.6, rgba[3]);
      // Bottom
      drawTriangle3DUVNormal([0,0,0, 1,0,1, 1,0,0],[0,1, 1,0, 1,1], [0,-1,0, 0,-1,0, 0,-1,0]);
      drawTriangle3DUVNormal([0,0,0, 0,0,1, 1,0,1],[0,1, 0,0, 1,0], [0,-1,0, 0,-1,0, 0,-1,0]);

      // gl.uniform4f(u_FragColor, rgba[0]*.5, rgba[1]*.5, rgba[2]*.5, rgba[3]);
      // Back
      drawTriangle3DUVNormal([1,0,1, 0,0,1, 0,1,1],[0,0, 1,0, 1,1], [0,0,1, 0,0,1, 0,0,1]);
      drawTriangle3DUVNormal([1,0,1, 1,1,1, 0,1,1],[0,1, 0,1, 1,1], [0,0,1, 0,0,1, 0,0,1]);

      gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
  }
}