function renderAnimal () {

    var globalRotMat = new Matrix4()
    globalRotMat.rotate(-10 + global_angle_y, 1, 0, 0);
    globalRotMat.rotate(global_angle_x, 0, 1, 0);
    gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.clear(gl.COLOR_BUFFER_BIT);
  
    var body = new Cube();
    body.color = [1.0, 0.0, 0.0, 1.0];
    body.matrix.translate(-.25, -.75, 0);
    body.matrix.rotate(0, 1, 0, 0);
    body.matrix.scale(.5, .3, .5);
    body.render();
  
    var block = new Cube();
    block.color = [1.0, 1.0, 0.0, 1.0,];
    block.matrix.translate(0, -.5, 0);
    block.matrix.rotate(g_angle, 0, 0, 1);
    var yellowanglemat = new Matrix4(block.matrix);
    block.matrix.scale(.25, .7, .5);
    block.matrix.translate(-.5, 0, 0);
    block.render();
  
    var hand = new Cube();
    hand.color = [1, 0, 1, 1];
    hand.matrix = yellowanglemat;
    hand.matrix.translate(-.1, .6, 0, 0);
    hand.matrix.rotate(h_angle, 1, 0, 0);
    hand.matrix.scale(.2, .4, .2);
    hand.render();
  
}