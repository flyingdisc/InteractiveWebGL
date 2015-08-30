// global variables 
var canvas;
var gl;
var arObjects = [];
var transparency = 1.0;
var defaultClr = vec4(1.0, 1.0, 1.0, 1.0);
var mousePressed = false;
var SphereObject, ConeObject, CylinderObject;

function initWebGL(canvas) {
	//gl = WebGLUtils.setupWebGL(canvas);  
	gl = WebGLUtils.setupWebGL(canvas, {preserveDrawingBuffer:true});
    if ( !gl ) { alert( "WebGL isn't available" ); }
	gl.viewport( 0, 0, canvas.width, canvas.height );
}

// initialization
window.onload = function init() {
    canvas = document.getElementById( "gl-canvas" );
	initWebGL(canvas);
    
    gl.clearColor( 0.2, 0.2, 0.2, 1.0 );
	gl.enable(gl.DEPTH_TEST);
	
    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mouseup", handleMouseUp);
    canvas.addEventListener("mousemove", handleMouseMove);
	canvas.addEventListener("mouseout", handleMouseOut);
	
	//initBuffers();
	//initBuffers();
	initialObjects();
	render();
};

// class basic shape, object-oriented programming
function BasicShape() {
	/*
	var normalBuffer = [];
	var positionBuffer = [];
	var indexBuffer = [];
	var program;
	var type;
	var scaleX, scaleY, scaleZ;
	var translateXYZ;
	var translateX, translateY, translateZ;
	var rotateX, rotateY, rotateZ;
	var color;
	*/
	
	this.normalBuffer = [];
	this.positionBuffer = [];
	this.indexBuffer = [];
	this.program;
	this.type;
	this.scaleX;
	this.scaleY;
	this.scaleZ;
	this.translateXYZ;
	this.translateX;
	this.translateY;
	this.translateZ;
	this.rotateX;
	this.rotateY;
	this.rotateZ;
	this.color;
	
}
// the prototype, object-oriented programming
BasicShape.prototype = {
	setShader: function() {
		//  Load shaders and initialize attribute buffers
		this.program = initShaders( gl, "vertex-shader", "fragment-shader" );
		gl.useProgram(this.program);

		this.program.uMaterialAmbient = gl.getUniformLocation(this.program, "uMaterialAmbient");
		this.program.uMaterialDiffuse = gl.getUniformLocation(this.program, "uMaterialDiffuse");
		this.program.uMaterialSpecular = gl.getUniformLocation(this.program, "uMaterialSpecular");
		this.program.uShininess = gl.getUniformLocation(this.program, "uShininess");

		this.program.uLightPosition = gl.getUniformLocation(this.program, "uLightPosition");
		this.program.uLightAmbient = gl.getUniformLocation(this.program, "uLightAmbient");
		this.program.uLightDiffuse = gl.getUniformLocation(this.program, "uLightDiffuse");
		this.program.uLightSpecular = gl.getUniformLocation(this.program, "uLightSpecular");
		
		this.program.uMovingLight = gl.getUniformLocation(this.program, 'uMovingLight');
		//this.program.projectionMatrix = gl.getUniformLocation(this.program, "projectionMatrix");
		this.program.modelViewMatrix = gl.getUniformLocation(this.program, "modelViewMatrix");
		this.program.normalMatrix = gl.getUniformLocation(this.program, 'normalMatrix');

		// attenuation
		this.program.isAttenuate = gl.getUniformLocation(this.program, 'isAttenuate');
		
		// which light is on, default=both
		gl.uniform1i(this.program.uMovingLight, 0);
		gl.uniform1i(this.program.isAttenuate, false);
		
		// associate out shader variables with our data buffer
		this.program.vPosition = gl.getAttribLocation(this.program, "vPosition");
		gl.enableVertexAttribArray(this.program.vPosition);
		this.program.vColor = gl.getAttribLocation(this.program, "vColor");
		gl.disableVertexAttribArray(this.program.vColor);
		this.program.vNormal = gl.getAttribLocation(this.program, "vNormal");
		gl.enableVertexAttribArray(this.program.vNormal);
	},
	
	initBuffers: function(normalData, positionData, indexData) {
		// normal........
		this.normalBuffer = gl.createBuffer();
		gl.bindBuffer( gl.ARRAY_BUFFER, this.normalBuffer );
		gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(normalData), gl.STATIC_DRAW );
		this.normalBuffer.itemSize = 3;
		this.normalBuffer.numItems = normalData.length/3;
		
		// position..........
		this.positionBuffer = gl.createBuffer();
		gl.bindBuffer( gl.ARRAY_BUFFER, this.positionBuffer );
		gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(positionData), gl.STATIC_DRAW );
		this.positionBuffer.itemSize = 3;
		this.positionBuffer.numItems = positionData.length/3;
		
		// index.........
		this.indexBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer );
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexData), gl.STATIC_DRAW);
		this.indexBuffer.itemSize = 1;
		this.indexBuffer.numItems = indexData.length;
	},
	
	setParams: function(t, sx, sy, sz, txyz, rx, ry, rz, c) {
		/*
		type = t;
		scaleX = sx / 10;
		scaleY = sy / 10;
		scaleZ = sz / 10;
		translateXYZ = vec3(txyz[0], txyz[1], txyz[2]);
		rotateX = rx;
		rotateY = ry;
		rotateZ = rz;
		color = vec4(c[0], c[1], c[2], c[3]);
		*/
		
		this.type = t;
		this.scaleX = sx;
		this.scaleY = sy;
		this.scaleZ = sz;
		this.translateXYZ = vec3(txyz[0], txyz[1], txyz[2]);
		this.rotateX = rx;
		this.rotateY = ry;
		this.rotateZ = rz;
		this.color = vec4(c[0], c[1], c[2], c[3]);
		
	},

	draw: function() {
		var locxy = scaleDown(this.translateXYZ[0], this.translateXYZ[1]);
		this.translateX = locxy[0];
		this.translateY = locxy[1];
		this.translateZ = this.translateXYZ[2] / 10;
		
		gl.useProgram(this.program);
		
		// transform in opposite order, model matrix
		var mr = mult(rotate(this.rotateX, [1, 0, 0]), rotate(this.rotateY, [0, 1, 0]));
		mr = mult(mr, rotate(this.rotateZ, [0, 0, 1]));
		var m = mult(translate(this.translateX, this.translateY, this.translateZ), mr);
		var modelViewMatrix = mult(m, scale(this.scaleX / 10, this.scaleY / 10, this.scaleZ / 10));
		//var tsMatrix = mult(translate(translateX, translateY, translateZ), scale(scaleX, scaleY, scaleZ));
		gl.uniformMatrix4fv(this.program.modelViewMatrix, false, flatten(modelViewMatrix));

		// not camera rotation but it's world rotation, view matrix
		//var mv = mult(rotate(objCameraX, [1, 0, 0]), rotate(objCameraY, [0, 1, 0]));
		//mv = mult(mv, rotate(objCameraZ, [0, 0, 1]));
		// for camera rotation, reverse the order, mult(mv, m)
		// model view matrix,
		//m = mult(m, mv);
		
		var left = -3.0;
		var right = 3.0;
		var ytop = 3.0;
		var bottom = -3.0;
		var near = -10;
		var far = 10;
		//projectionMatrix = ortho(left, right, bottom, ytop, near, far);
		//gl.uniformMatrix4fv(program.projectionMatrix, false, flatten(projectionMatrix) );

		// normal matrix only really need if there is nonuniform scaling
		// it's here for generality but since there is
		// no scaling in this example we could just use modelView matrix in shaders
		// this way doesn't work, because rotation will also rotate lighting
		var normalMatrix = [
			vec3(modelViewMatrix[0][0], modelViewMatrix[0][1], modelViewMatrix[0][2]),
			vec3(modelViewMatrix[1][0], modelViewMatrix[1][1], modelViewMatrix[1][2]),
			vec3(modelViewMatrix[2][0], modelViewMatrix[2][1], modelViewMatrix[2][2])
		];
		
		// must be inverse first, then transpose.
		// to prevent lighting rotation when object is rotated.
		var normalMatrix = inverseMat3(flatten(modelViewMatrix));
		normalMatrix = transpose(normalMatrix);
		gl.uniformMatrix3fv(this.program.normalMatrix, false, flatten(normalMatrix) );
		var totalAmbient = flatten([lightAmbient, lightAmbient2]);
		var totalDiffuse = flatten([lightDiffuse, lightDiffuse2]);
		var totalSpecular = flatten([lightSpecular, lightSpecular2]);
		gl.uniform4fv(this.program.uLightAmbient, totalAmbient);
		gl.uniform4fv(this.program.uLightDiffuse, totalDiffuse);
		gl.uniform4fv(this.program.uLightSpecular, totalSpecular);
		gl.uniform4fv(this.program.uLightPosition, 
			[lightPosition[0],lightPosition[1],-lightPosition[2],lightPosition[3],
			 lightPosition2[0],lightPosition2[1],-lightPosition2[2],lightPosition2[3]]);
		
		gl.uniform4fv(this.program.uMaterialAmbient, flatten(materialAmbient));
		if (isDiffuseGlobal) 
			gl.uniform4fv(this.program.uMaterialDiffuse, flatten(materialDiffuse));
		else 
			gl.uniform4fv(this.program.uMaterialDiffuse, flatten(this.color));
		gl.uniform4fv(this.program.uMaterialSpecular, flatten(materialSpecular));
		gl.uniform1f(this.program.uShininess, materialShininess);
		
		gl.uniform1i(this.program.uMovingLight, movingLight);
		gl.uniform1i(this.program.isAttenuate, isAttenuate);
		
		// normal........
		gl.bindBuffer( gl.ARRAY_BUFFER, this.normalBuffer );
		gl.vertexAttribPointer( this.program.vNormal, this.normalBuffer.itemSize, gl.FLOAT, false, 0, 0 );
		
		// position..........
		gl.bindBuffer( gl.ARRAY_BUFFER, this.positionBuffer );
		gl.vertexAttribPointer( this.program.vPosition, this.positionBuffer.itemSize, gl.FLOAT, false, 0, 0 );
		
		var clr = vec4(this.color[0], this.color[1], this.color[2], this.color[3]);
		// color solid.........
		if ((surface == 0) || (surface == 1)) {
			gl.vertexAttrib4f(this.program.vColor, clr[0], clr[1], clr[2], clr[3]);
		}
		
		// index.........
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer );
		// solids..
		if ((surface == 0) || (surface == 1)) {
			gl.polygonOffset(0.0, 0.0);  // reset polygon offset
			gl.drawElements(gl.TRIANGLES, this.indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
		}
		
		// meshes..
		if ((surface == 0) || (surface == 2)) {
			if (surface == 0) {
				gl.vertexAttrib4f(this.program.vColor, 1.0-clr[0], 1.0-clr[1], 1.0-clr[2], 1.0);
				gl.uniform4fv(this.program.uMaterialDiffuse, [1.0-clr[0], 1.0-clr[1], 1.0-clr[2], 1.0]);
			}
			else {
				gl.vertexAttrib4f(this.program.vColor, 1.0, 1.0, 1.0, 1.0);
			}
			gl.polygonOffset(1.0, 1.0);
			gl.drawElements(gl.LINE_LOOP, this.indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
		}
		
		function scaleDown(x, y) {
			var newx = 2 * x / canvas.width - 1;
			var newy = 2 * (canvas.height - y) / canvas.height - 1;
			return [newx, newy];
		}
	}
};
// inheritance (subclasses), object-oriented programming
// sphere class
function Sphere() {}
Sphere.prototype = Object.create(BasicShape.prototype);
Sphere.prototype.init = function() {
	BasicShape.prototype.setShader.call(this);
	BasicShape.prototype.initBuffers.call(this, normalDataSphere, vertexPositionDataSphere, indexDataSphere);
};
// cone class
function Cone() {}
Cone.prototype = Object.create(BasicShape.prototype);
Cone.prototype.init = function() {
	BasicShape.prototype.setShader.call(this);
	BasicShape.prototype.initBuffers.call(this, normalDataCone, vertexPositionDataCone, indexDataCone);
};
// cylinder class
function Cylinder() {}
Cylinder.prototype = Object.create(BasicShape.prototype);
Cylinder.prototype.init = function() {
	BasicShape.prototype.setShader.call(this);
	BasicShape.prototype.initBuffers.call(this, normalDataCylinder, vertexPositionDataCylinder, indexDataCylinder);
};

function initialObjects() {
    // initial 3 objects
	var obj1 = new Sphere();
	obj1.init();
	// type, sx, sy, sz, txyz, rx, ry, rz, clr
	obj1.setParams(0, 3, 3, 3, vec3(300, 140, 0.0), 
	              10, 5, -10, vec4(1.0, 0.0, 0.0, 1.0));
	arObjects.push(obj1);
	
	var obj2 = new Cone();
	obj2.init();
	// type, sx, sy, sz, txyz, rx, ry, rz, clr
	obj2.setParams(1, 3, 3, 3, vec3(410, 370, 0.0), 
	              12, 10, 10, vec4(0.0, 1.0, 0.0, 1.0));
	arObjects.push(obj2);
	
	var obj3 = new Cylinder();
	obj3.init();
	// type, sx, sy, sz, txyz, rx, ry, rz, clr
	obj3.setParams(2, 3, 3, 3, vec3(180, 420, 0.0), 
	              10, 5, -10, vec4(0.0, 0.0, 1.0, 1.0));
	arObjects.push(obj3);

	listObjects(0);
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
	if (mousePressed) {
	}
}

function drawObject(event) {
	var p = getLoc(event);
    p[2] = -objTranslateZ;
	saveObject(p);
}

function saveObject(p) {
	var obj;
	if (object3D == 0) 
		obj = new Sphere();
	if (object3D == 1)
		obj = new Cone();
	if (object3D == 2)
		obj = new Cylinder();
	obj.init();
	obj.setParams(object3D, objScaleX, objScaleY, objScaleZ, p, 
	              objRotateX, objRotateY, objRotateZ, objColor);
	
	arObjects.push(obj);
	listObjects(0);
	isRender();
}

var qu = 0.0, brake=0;
function updateLightPosition() {
	if (brake < 5) {
		brake += 1;
		return;
	}
	else {
		brake = 0;
	}
	// light circular move (1)
	var dx = 16 * Math.cos(qu);
	var dy = 16 * Math.sin(qu);
	//if (qu >= 1) ldu = -0.1; else if (qu <= -1) ldu = 0.1;
	qu += 0.1;
	if (qu >= 2*Math.PI) qu = 0.0;
	lightPosition[0] = dx;
	lightPosition[1] = dy;
	
	$( "#textLightX" ).val(lightPosition[0].toFixed(2));
	$( "#textLightY" ).val(lightPosition[1].toFixed(2));
	$( "#textLightZ" ).val(lightPosition[2].toFixed(2));
	
	// light rectangular move (2)
	var px = lightPosition2[0];
	var py = lightPosition2[1];
	var dr = 0.8;
	var lim = 12;
	var ch = false;
	if (px >= lim) {
		px = lim;
		py -= dr;
		ch = true;
		
	}
	if (py <= -lim) {
		py = -lim;
		px -= dr;
		ch = true;
	}
	if (px <= -lim) {
		px = -lim;
		py += dr;
		ch = true;
	}
	if (py >= lim) {
		py = lim;
		px += dr;
		ch = true;
	}
	if (!ch) 
		lightPosition2[0] = lim; 
	else {
		lightPosition2[0] = px;
		lightPosition2[1] = py;
	}
	
	$( "#textLightX2" ).val(lightPosition2[0].toFixed(2));
	$( "#textLightY2" ).val(lightPosition2[1].toFixed(2));
	$( "#textLightZ2" ).val(lightPosition2[2].toFixed(2));
}

function render() {
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	
	var arLen = arObjects.length;
	for (var cnt=0; cnt < arLen; cnt++) {
		//alert(cnt + ", " + arLen);
		arObjects[cnt].draw();
		/*
		if (arObjects[cnt].type == 0)
			SphereObject.draw(arObjects[cnt]);
		else if (arObjects[cnt].type == 1)
			ConeObject.draw(arObjects[cnt]);
		else if (arObjects[cnt].type == 2)
			CylinderObject.draw(arObjects[cnt]);
		*/
	}
	
	updateLightPosition();

	if (!stopMoving) requestAnimFrame( render );
}
