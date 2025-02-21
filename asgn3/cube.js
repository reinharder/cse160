class Cube {
  constructor() {
    this.type = 'cube';
    this.color = [1.0, 1.0, 1.0, 1.0];
    this.matrix = new Matrix4();
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

      // Front of Cube
      drawTriangle3DUV([0, 0, 0, 1, 1, 0, 1, 0, 0], [0, 0, 1, 1, 1, 0]);
      drawTriangle3DUV([0, 0, 0, 0, 1, 0, 1, 1, 0], [0, 0, 0, 1, 1, 1]);
      // Back
      drawTriangle3DUV([0, 0, 1, 1, 1, 1, 1, 0, 1], [0, 0, 1, 1, 1, 0]);
      drawTriangle3DUV([0, 0, 1, 0, 1, 1, 1, 1, 1], [0, 0, 0, 1, 1, 1]);
      // Top
      drawTriangle3DUV([0, 1, 0, 1, 1, 0, 1, 1, 1], [0, 0, 1, 0, 1, 1]);
      drawTriangle3DUV([0, 1, 1, 0, 1, 0, 1, 1, 1], [0, 1, 0, 0, 1, 1]);
      // Bottom
      drawTriangle3DUV([0, 0, 0, 0, 0, 1, 1, 0, 0], [0, 0, 0, 1, 1, 0]);
      drawTriangle3DUV([1, 0, 0, 1, 0, 1, 0, 0, 1], [1, 0, 1, 1, 0, 1]);
      // Left
      drawTriangle3DUV([0, 0, 0, 0, 1, 0, 0, 1, 1], [0, 0, 1, 0, 1, 1]);
      drawTriangle3DUV([0, 1, 1, 0, 0, 0, 0, 0, 1], [1, 1, 0, 0, 1, 0]);
      // Right
      drawTriangle3DUV([1, 0, 0, 1, 1, 0, 1, 1, 1], [0, 0, 1, 0, 1, 1]);
      drawTriangle3DUV([1, 1, 1, 1, 0, 0, 1, 0, 1], [1, 1, 0, 0, 1, 0]);

      gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
  }
}