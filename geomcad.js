var canvas;
var gl;
var arObjects = [];
var transparency = 1.0;
var defaultClr = vec4(1.0, 1.0, 1.0, 1.0);
var mousePressed = false;
var aNormalBufferSphere = [];
var aNormalBufferCone = [];
var aNormalBufferCylinder = [];
var vPositionBufferSphere = [];
var vPositionBufferCone = [];
var vPositionBufferCylinder = [];
var vColorBufferSphere = [];
var vColorBufferCone = [];
var vColorBufferCylinder = [];
var vIndexBufferSphere = [];
var vIndexBufferCone = [];
var vIndexBufferCylinder = [];

function initWebGL(canvas) {
	gl = WebGLUtils.setupWebGL(canvas, {preserveDrawingBuffer:true});
    if ( !gl ) { alert( "WebGL isn't available" ); }
	gl.viewport( 0, 0, canvas.width, canvas.height );
}
function newShader() {
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram(program);
	program.uUseLighting = gl.getUniformLocation(program, 'uUseLighting');
	program.uAmbientColor = gl.getUniformLocation(program, 'uAmbientColor');
	program.uLightColor = gl.getUniformLocation(program, 'uLightColor');
    program.uLightDirection = gl.getUniformLocation(program, 'uLightDirection');
	gl.uniform1i(program.uUseLighting, true);
	gl.uniform3f(program.uAmbientColor, 0.3, 0.3, 0.5);
	gl.uniform3f(program.uLightColor, 1.0, 1.0, 1.0);
	var lightDirection = vec3(0.0, 0.0, -20.0);
	lightDirection = normalize(lightDirection); 
	gl.uniform3fv(program.uLightDirection, flatten(lightDirection)); 
    program.vPosition = gl.getAttribLocation(program, "vPosition");
    gl.enableVertexAttribArray(program.vPosition);
	program.vColor = gl.getAttribLocation(program, "vColor");
    gl.enableVertexAttribArray(program.vColor);
	program.aNormal = gl.getAttribLocation(program, "aNormal");
    gl.enableVertexAttribArray(program.aNormal);
	program.modelViewMatrix = gl.getUniformLocation(program, "modelViewMatrix");
	program.normalViewMatrix = gl.getUniformLocation(program, "normalViewMatrix");
	return program;
}

window.onload = function init() {
    canvas = document.getElementById( "gl-canvas" );
	initWebGL(canvas);
    gl.clearColor( 0.0, 0.0, 0.0, 1.0 );
	gl.enable(gl.DEPTH_TEST);
    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mouseup", handleMouseUp);
    canvas.addEventListener("mousemove", handleMouseMove);
	canvas.addEventListener("mouseout", handleMouseOut);
	initBuffers();
	render();
};

function initBuffers() {
	// normal........
	aNormalBufferSphere = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, aNormalBufferSphere );
	gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(normalDataSphere), gl.STATIC_DRAW );
	
	aNormalBufferCone = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, aNormalBufferCone );
	gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(normalDataCone), gl.STATIC_DRAW );
	
	aNormalBufferCylinder = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, aNormalBufferCylinder );
	gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(normalDataCylinder), gl.STATIC_DRAW );
		
	// position..........
	vPositionBufferSphere = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, vPositionBufferSphere );
	gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(vertexPositionDataSphere), gl.STATIC_DRAW );
	
	vPositionBufferCone = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, vPositionBufferCone );
	gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(vertexPositionDataCone), gl.STATIC_DRAW );
	
	vPositionBufferCylinder = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, vPositionBufferCylinder );
	gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(vertexPositionDataCylinder), gl.STATIC_DRAW );

	// color, for random color.........
	vColorBufferSphere = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, vColorBufferSphere );
	for (var i=0; i < vertexColorDataSphere.length; i++) {
		if ((i % 4) == 3)
			vertexColorDataSphere[i] = 1.0;
		else
			vertexColorDataSphere[i] = Math.random();
	}
	gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(vertexColorDataSphere), gl.STATIC_DRAW );
	
	vColorBufferCone = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, vColorBufferCone );
	for (var i=0; i < vertexColorDataCone.length; i++) {
		if ((i % 4) == 3)
			vertexColorDataCone[i] = 1.0;
		else
			vertexColorDataCone[i] = Math.random();
	}
	gl.bufferData( gl.ARRAY_BUFFER, flatten(vertexColorDataCone), gl.STATIC_DRAW );
	
	vColorBufferCylinder = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, vColorBufferCylinder );
	for (var i=0; i < vertexColorDataCylinder.length; i++) {
		if ((i % 4) == 3)
			vertexColorDataCylinder[i] = 1.0;
		else
			vertexColorDataCylinder[i] = Math.random();
	}
	gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(vertexColorDataCylinder), gl.STATIC_DRAW );
	
	// index.........
	vIndexBufferSphere = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vIndexBufferSphere );
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexDataSphere), gl.STATIC_DRAW);
	vIndexBufferSphere.indexLength = indexDataSphere.length;
	
	vIndexBufferCone = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vIndexBufferCone );
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexDataCone), gl.STATIC_DRAW);
	vIndexBufferCone.indexLength = indexDataCone.length;

	vIndexBufferCylinder = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vIndexBufferCylinder );
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexDataCylinder), gl.STATIC_DRAW);
	vIndexBufferCylinder.indexLength = indexDataCylinder.length;
}

function getLoc(event) {
	var totalOffsetX = 0;
	var totalOffsetY = 0;
	var canvasX = 0;
	var canvasY = 0;
	var currentElement = document.getElementById("gl-canvas");
	do {
	    totalOffsetX += currentElement.offsetLeft;
	    totalOffsetY += currentElement.offsetTop;
	} while (currentElement = currentElement.offsetParent)
		
	if (event.pageX || event.pageY) { 
		canvasX = event.pageX;
		canvasY = event.pageY;
	} else { 
		canvasX = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft; 
		canvasY = event.clientY + document.body.scrollTop + document.documentElement.scrollTop; 
	}
	canvasX -= totalOffsetX;
	canvasY -= totalOffsetY;
	$("#textTranslateX").val(canvasX);
	$("#textTranslateY").val(canvasY);
	return vec3(canvasX, canvasY, 0.0);
}

function handleMouseDown(event) {
    mousePressed = true;
    drawObject(event);
}

function handleMouseUp(event) {
	mousePressed = false;
}

function handleMouseOut(event) {
	mousePressed = false;
}
	
function handleMouseMove(event) {
	var p = getLoc(event);
	if (mousePressed) {}
}

function scaleDown(x, y) {
    var newx = 2 * x / canvas.width - 1;
    var newy = 2 * (canvas.height - y) / canvas.height - 1;
    return [newx, newy];
}

function drawObject(event) {
	var p = getLoc(event);
    p[2] = objTranslateZ;
	var obj = {};
	obj.translateXYZ = p;  
	obj.scaleX = objScaleX;
	obj.scaleY = objScaleY;
	obj.scaleZ = objScaleZ;
	obj.rotateX = objRotateX;
	obj.rotateY = objRotateY;
	obj.rotateZ = objRotateZ;
	var program = newShader();
	obj.program = program;
	obj.type = object3D;
	obj.color = objColor;
	arObjects.push(obj);
	listObjects(0);
	render();
}

function render() {
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	
	var arLen = arObjects.length;
	for (var cnt=0; cnt < arLen; cnt++) {
		var objType = arObjects[cnt].type;
		var scaleX = arObjects[cnt].scaleX / 10;
		var scaleY = arObjects[cnt].scaleY / 10;
		var scaleZ = arObjects[cnt].scaleZ / 10;
		var loc = arObjects[cnt].translateXYZ;
		var locxy = scaleDown(loc[0], loc[1]);
		var translateX = locxy[0];
		var translateY = locxy[1];
		var translateZ = loc[2] / 10;
		var rotateX = arObjects[cnt].rotateX;
		var rotateY = arObjects[cnt].rotateY;
		var rotateZ = arObjects[cnt].rotateZ;
		var program = arObjects[cnt].program;
		var clr = arObjects[cnt].color;
		var mr = mult(rotate(rotateX, [1, 0, 0]), rotate(rotateY, [0, 1, 0]));
		mr = mult(mr, rotate(rotateZ, [0, 0, 1]));
		var m = mult(translate(translateX, translateY, translateZ), mr);
		m = mult(m, scale(scaleX, scaleY, scaleZ));
		var n = mult(translate(translateX, translateY, translateZ/10.0), mr);
		n = mult(n, scale(scaleX, scaleY, scaleZ));
		gl.useProgram(program);
		gl.uniformMatrix4fv(program.modelViewMatrix, false, flatten(m));
		gl.uniformMatrix4fv(program.normalViewMatrix, false, flatten(n));
		gl.uniform1i(program.uUseLighting, isLighting);
		// normal........
		if (objType == 0) 
			gl.bindBuffer( gl.ARRAY_BUFFER, aNormalBufferSphere );
		else if (objType == 1) 
			gl.bindBuffer( gl.ARRAY_BUFFER, aNormalBufferCone );
		else if (objType == 2) 
			gl.bindBuffer( gl.ARRAY_BUFFER, aNormalBufferCylinder );
		gl.vertexAttribPointer( program.aNormal, 3, gl.FLOAT, false, 0, 0 );
		
		// position..........
		if (objType == 0) 
			gl.bindBuffer( gl.ARRAY_BUFFER, vPositionBufferSphere );
		else if (objType == 1) 
			gl.bindBuffer( gl.ARRAY_BUFFER, vPositionBufferCone );
		else if (objType == 2) 
			gl.bindBuffer( gl.ARRAY_BUFFER, vPositionBufferCylinder );
		gl.vertexAttribPointer( program.vPosition, 3, gl.FLOAT, false, 0, 0 );
		
		// color.........
		if ((surface == 0) || (surface == 1)) {
			if (randomColor == 1) {
				if (objType == 0) 
					gl.bindBuffer( gl.ARRAY_BUFFER, vColorBufferSphere );
				else if (objType == 1) 
					gl.bindBuffer( gl.ARRAY_BUFFER, vColorBufferCone );
				else if (objType == 2) 
					gl.bindBuffer( gl.ARRAY_BUFFER, vColorBufferCylinder );
				gl.enableVertexAttribArray(program.vColor);
				gl.vertexAttribPointer( program.vColor, 4, gl.FLOAT, false, 0, 0 );
			}
			else {
				gl.disableVertexAttribArray(program.vColor);
				gl.vertexAttrib4f(program.vColor, clr[0], clr[1], clr[2], clr[3]);
			}
		}
		
		// index.........
		var indexLength;
		if (objType == 0) {
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vIndexBufferSphere );
			indexLength = vIndexBufferSphere.indexLength;
		}
		else if (objType == 1) {
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vIndexBufferCone );
			indexLength = vIndexBufferCone.indexLength;
		}
		else if (objType == 2) {
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vIndexBufferCylinder );
			indexLength = vIndexBufferCylinder.indexLength;
		}
		if ((surface == 0) || (surface == 1)) {
			gl.polygonOffset(0.0, 0.0);  
			gl.drawElements(gl.TRIANGLES, indexLength, gl.UNSIGNED_SHORT, 0);
		}

		// render........
		if ((surface == 0) || (surface == 2)) {
			gl.disableVertexAttribArray(program.vColor);
			if (randomColor)
				gl.vertexAttrib4f(program.vColor, 0.0, 0.0, 1.0, 1.0);
			else 
				if (surface == 0)
					gl.vertexAttrib4f(program.vColor, 1.0-clr[0], 1.0-clr[1], 1.0-clr[2], 1.0);
				else
					gl.vertexAttrib4f(program.vColor, 1.0, 1.0, 1.0, 1.0);
			gl.polygonOffset(1.0, 1.0); 
			gl.drawElements(gl.LINE_LOOP, indexLength, gl.UNSIGNED_SHORT, 0);
		}
	}
}