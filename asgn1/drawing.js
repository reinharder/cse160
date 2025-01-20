class Drawing {
    constructor() {
        this.type = 'drawing';
  }

    render() {
        var x = 10
        // Pass the color of a point to u_FragColor variable
        gl.uniform4f(u_FragColor, 1, 0, 1, 1);
        drawTriangle([1/x, -.5/x, 0/x, -1.5/x, -1/x, -.5/x]);
        gl.uniform4f(u_FragColor, 0, 0, 1, 1);
        drawTriangle([1.5/x, 1.5/x, .5/x, .5/x, .5/x, 1.5/x]);
        drawTriangle([1.5/x, 1.5/x, .5/x, .5/x, 1.5/x, .5/x]);
        gl.uniform4f(u_FragColor, 0, 1, 0, 1);
        drawTriangle([-1.5/x, 1.5/x, -.5/x, .5/x, -.5/x, 1.5/x]);
        drawTriangle([-1.5/x, 1.5/x, -.5/x, .5/x, -1.5/x, .5/x]);
        gl.uniform4f(u_FragColor, .5, .3, .3, 1);
        drawTriangle([-2/x, 2/x, 0/x, 2/x, 0/x, 3/x]);
        drawTriangle([2/x, 2/x, 0/x, 2/x, 0/x, 3/x]);
        gl.uniform4f(u_FragColor, 1, 1, 1, 1);
        drawTriangle([-2/x, -2/x, 0/x, -2/x, 0/x, -3/x]);
        drawTriangle([2/x, -2/x, 0/x, -2/x, 0/x, -3/x]);
        drawTriangle([2/x, -2/x, 2/x, 0/x, 3/x, 0/x]);
        drawTriangle([2/x, 2/x, 2/x, 0/x, 3/x, 0/x]);
        drawTriangle([-2/x, -2/x, -2/x, 0/x, -3/x, 0/x]);
        drawTriangle([-2/x, 2/x, -2/x, 0/x, -3/x, 0/x]);
        gl.uniform4f(u_FragColor, 1, 0, 0, 1);
        drawTriangle([0/x, -6/x, -2/x, -2/x, -2/x, -6/x]);
        drawTriangle([0/x, -6/x, 2/x, -2/x, 2/x, -6/x]);
        gl.uniform4f(u_FragColor, 1, 1, 1, 1);
        drawTriangle([4/x, -5/x, 3.6/x, -5/x, 2/x, -2/x]);
        drawTriangle([-4/x, -5/x, -3.6/x, -5/x, -2/x, -2/x]);
        gl.uniform4f(u_FragColor, .5, .5, .5, 1);
        drawTriangle([1/x, -6/x, 1/x, -8/x, 2/x, -8/x]);
        drawTriangle([-1/x, -6/x, -1/x, -8/x, -2/x, -8/x]);
        drawTriangle([.5/x, -4/x, 0/x, -3/x, -.5/x, -4/x]);
    }
}
