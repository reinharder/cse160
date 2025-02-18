function renderPig() {
    var pigPink = [1, 0.71, 0.75, 1.0];
    var snoutPink = [.5, 0.3, 0.3, 1.0];
    var hoofColor = [0.2, 0.2, 0.2, 1.0];
    var eyeColor = [1, 1, 1, 1];

   // Body =====================================
    var body = new Cube();
    body.color = pigPink;
    body.matrix.scale(0.4, 0.3, 0.6);
    body.matrix.translate(-0.5, 0, -0.3);
    body.render();
    
    // Head =====================================
    var head = new Cube();
    head.color = pigPink;
    head.matrix.rotate(-g_angle, g_angle, 0, 1);
    head.matrix.scale(0.32, 0.32, 0.32);
    head.matrix.translate(-.5, .32, -1.2);
    head.render();
    
    
    // Snout =====================================
    var snout = new Cube();
    snout.color = [1, 0.6, 0.7, 1.0];
    snout.matrix.rotate(-g_angle, g_angle, 0, 1);
    snout.matrix.scale(0.16, 0.12, 0.04);
    snout.matrix.translate(-0.5, 1.1, -10.5);
    snout.render();

    var nostril1 = new Cube();
    nostril1.color = snoutPink;
    nostril1.matrix.rotate(-g_angle, g_angle, 0, 1);
    nostril1.matrix.scale(0.04, 0.04, 0.01);
    nostril1.matrix.translate(-2, 4.4, -42.1);
    nostril1.render();
    var nostril2 = new Cube();
    nostril2.color = snoutPink;
    nostril2.matrix.rotate(-g_angle, g_angle, 0, 1);
    nostril2.matrix.scale(0.04, 0.04, 0.01);
    nostril2.matrix.translate(1, 4.4, -42.1);
    nostril2.render();
    
    // Eyes =====================================
    var lefteye = new Cube();
    lefteye.color = eyeColor;
    lefteye.matrix.rotate(-g_angle, g_angle, 0, 1);
    lefteye.matrix.scale(0.08, 0.04, 0.01);
    lefteye.matrix.translate(-2, 6, -39);
    lefteye.render();
    
    var lefteyeblack = new Cube();
    lefteyeblack.color = [0,0,0,1];
    lefteyeblack.matrix.rotate(-g_angle, g_angle, 0, 1);
    lefteyeblack.matrix.scale(0.04, 0.04, 0.01);
    lefteyeblack.matrix.translate(-4, 6, -39.1);
    lefteyeblack.render();
    
    var righteye = new Cube();
    righteye.color = [1,1,1,1];
    righteye.matrix.rotate(-g_angle, g_angle, 0, 1);
    righteye.matrix.scale(0.08, 0.04, 0.01);
    righteye.matrix.translate(1, 6, -39);
    righteye.render();
    
    var righteyeblack = new Cube();
    righteyeblack.color = [0,0,0,1];
    righteyeblack.matrix.rotate(-g_angle, g_angle, 0, 1);
    righteyeblack.matrix.scale(0.04, 0.04, 0.01);
    righteyeblack.matrix.translate(3.1, 6, -39.1);
    righteyeblack.render();
    
    // Legs =====================================
function createLeg1(x, z) {
    var leg = new Cube();
    leg.color = pigPink;

    // Move to pivot (top of leg at origin)
    leg.matrix.translate(x, 0, z);  

    // Rotate around the top of the leg
    leg.matrix.rotate(-h_angle, 1, 0, 0);

    // Move leg down into place
    leg.matrix.translate(0, -0.15, 0);  

    // Scale to correct size
    leg.matrix.scale(0.12, 0.2, 0.12);

    leg.render();
    
    var hoof = new Cube();
    hoof.color = hoofColor;

    hoof.matrix.translate(x, 0, z);
    hoof.matrix.rotate(-h_angle, 1, 0, 0);
    hoof.matrix.translate(0, -0.2, 0);
    hoof.matrix.scale(0.12, 0.05, 0.12);

    hoof.render();
}

function createLeg2(x, z) {
    var leg = new Cube();
    leg.color = pigPink;

    // Move to pivot (top of leg at origin)
    leg.matrix.translate(x, 0, z);  

    // Rotate around the top of the leg
    leg.matrix.rotate(h_angle, 1, 0, 0);

    // Move leg down into place
    leg.matrix.translate(0, -0.15, 0);

    // Scale to correct size
    leg.matrix.scale(0.12, 0.2, 0.12);

    leg.render();
    
    var hoof = new Cube();
    hoof.color = hoofColor;

    hoof.matrix.translate(x, 0, z);
    hoof.matrix.rotate(h_angle, 1, 0, 0);
    hoof.matrix.translate(0, -0.2, 0);
    hoof.matrix.scale(0.12, 0.05, 0.12);

    hoof.render();
}
    
    
    
    createLeg1(-.2, -.1);
    createLeg2(.07, -.1);
    createLeg2(-.2, .22);
    createLeg1(.07, .22);
}
