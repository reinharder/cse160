//Soichiro Hiroshima
//shiroshi@ucsc.edu

function drawVector(v, color){
    var canvas = document.getElementById('example');
    if (!canvas) {
        console.log('Failed to retrieve the <canvas> element');
        return false;
    }

    // Get the rendering context for 2D
    var ctx = canvas.getContext('2d');
    ctx.strokeStyle = color; // Set color
    ctx.beginPath();
    ctx.moveTo(canvas.width/2, canvas.height/2);
    ctx.lineTo(200+v.elements[0]*20, 200-v.elements[1]*20, v.elements[2]*20);
    ctx.stroke();
 }


function main() {
    var canvas = document.getElementById('example');
    if (!canvas) {
        console.log('Failed to retrieve the <canvas> element');
        return false;
    }

    // Get the rendering context for 2D
    var ctx = canvas.getContext('2d');

    ctx.fillStyle = 'rgba(0, 0, 0, 1.0)';
    ctx.fillRect(0, 10, 400, 400);        // Fill a rectangle with the color

}

function handleDrawEvent(){
    var x = document.getElementById('x').value;
    var y = document.getElementById('y').value;
    var x2 = document.getElementById('x2').value;
    var y2 = document.getElementById('y2').value;
    // Retrieve the <canvas> element
    var canvas = document.getElementById('example');
    if (!canvas) {
        console.log('Failed to retrieve the <canvas> element');
        return false;
    }
    var ctx = canvas.getContext('2d');

    // Clear the canvas (optional, in case it was drawn on before)
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(0, 0, 0, 1.0)';
    ctx.fillRect(0, 10, 400, 400);     
    var v1 = new Vector3([x, y, 0]);
    var v2 = new Vector3([x2, y2, 0]); 
    drawVector(v1, "red");
    drawVector(v2, "blue");

}

function handleDrawOperationEvent(){
    handleDrawEvent();
    var x = document.getElementById('x').value;
    var y = document.getElementById('y').value;
    var x2 = document.getElementById('x2').value;
    var y2 = document.getElementById('y2').value;
    var scalar = document.getElementById('scalar').value;
    var v1 = new Vector3([x, y, 0]);
    var v2 = new Vector3([x2, y2, 0]); 

    var oper = document.getElementById('operation').value;
    if (oper == 'add'){
        v1.add(v2);
        drawVector(v1, "green");
    }
    if (oper == "sub"){
        v1.sub(v2);
        drawVector(v1, "green");
    }
    if (oper == "div"){
        v1.div(scalar);
        drawVector(v1, "green");
        v2.div(scalar);
        drawVector(v2, "green");
    }
    if (oper == "mul"){
        v1.mul(scalar);
        drawVector(v1, "green");
        v2.mul(scalar);
        drawVector(v2, "green");
    }
    if (oper == "mag"){
        console.log(v1.magnitude());
        console.log(v2.magnitude());
    }
    if (oper == "nor"){
        v1.normalize();
        v2.normalize();
        drawVector(v1, "green");
        drawVector(v2, "green"); 
    }
    if (oper == "ang"){
        console.log("Angle: " + angleBetween(v1, v2));
    }
    if (oper == "area"){
        console.log(Vector3.cross(v1, v2));
        console.log("Area: " + areaTriangle(v1, v2));
    }
}

function angleBetween(v1, v2){
    var m1 = v1.magnitude();
    var m2 = v2.magnitude();
    var dot = Vector3.dot(v1, v2);
    var angle = Math.acos(dot/(m1*m2)); // Radians
    angle *= 180/Math.PI;
    return angle;
}

function areaTriangle(v1, v2){
    var a = Vector3.cross(v1, v2);
    var b = a.magnitude()/2;
 
    return b;
 }
