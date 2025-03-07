var g_map = [
      [0, 0, 1, 1, 1, 1, 1, 1],
      [0, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 0, 0, 0, 0, 0, 1],
      [1, 0, 1, 0, 0, 0, 0, 1],
      [1, 0, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 1, 0, 0, 0],
      [1, 1, 1, 0, 1, 1, 1, 0],
      [1, 0, 0, 0, 1, 0, 0, 0],
      [1, 1, 0, 0, 0, 0, 0, 1]
];


function drawMap(){
   for(x=0; x<8; x++){
      for(y=0; y<8; y++){
       //console.log("x: " + x + " y: " + y);
           if(g_map[x][y] == 1){
           var cube = new Cube();
           //cube.matrix.scale(.5,.5,.5);
           cube.matrix.translate(x, 0, y);
           cube.normalMatrix.setInverseOf(cube.matrix).transpose();
           cube.render();
           }
      }
   }
}


 function drawEnv(){
    var start = new Cube();
    start.matrix.scale(.5,.5,.5);
    start.matrix.translate(0,0,-1);
    start.color = [0.0, 0.0, 1.0, 1.0];
    start.textureNum = -2;
    start.normalMatrix.setInverseOf(start.matrix).transpose();
    start.render();

    var sky = new Cube();
    sky.matrix.scale(75,75,75);
    sky.matrix.translate(-.5,-.5,-.25);
    sky.color = [.3, .3, 1, 1.0];
    sky.textureNum = -2;
    sky.normalMatrix.setInverseOf(sky.matrix).transpose();
    sky.render();
 
    var floor = new Cube();
    floor.matrix.scale(40,0.1,40);
    floor.matrix.translate(-0.125,-1,-0.125);
    floor.textureNum = 1;
    floor.normalMatrix.setInverseOf(floor.matrix).transpose();
    floor.render();
 }