// global variables 
var canvas;
var gl;
var arObjects = [];
var transparency = 1.0;
var texSize = 128;//256;
var checkerboardImage;
var checkerboardTexture;
var imageTexture;
var patternTexture;

function initWebGL(canvas) {
	//gl = WebGLUtils.setupWebGL(canvas);  
	gl = WebGLUtils.setupWebGL(canvas, {preserveDrawingBuffer:true});
    if ( !gl ) { alert( "WebGL isn't available" ); }
	gl.viewport( 0, 0, canvas.width, canvas.height );
}

function newShader() {
	//  Load shaders and initialize attribute buffers
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram(program);

	program.projectionMatrix = gl.getUniformLocation(program, "projectionMatrix");
	program.modelViewMatrix = gl.getUniformLocation(program, "modelViewMatrix");
	program.normalMatrix = gl.getUniformLocation(program, "uNMatrix");
		
	program.samplerUniform = gl.getUniformLocation(program, "uSampler");
	program.textureCoordAttribute = gl.getAttribLocation(program, "aTextureCoord");
    gl.enableVertexAttribArray(program.textureCoordAttribute);
	
	program.ambientColorUniform = gl.getUniformLocation(program, "uAmbientColor");
    program.pointLightLocationUniform = gl.getUniformLocation(program, "uPointLightLocation");
    program.pointLightSpecularColorUniform = gl.getUniformLocation(program, "uPointLightSpecularColor");
    program.pointLightDiffuseColorUniform = gl.getUniformLocation(program, "uPointLightDiffuseColor");
	program.materialShininessUniform = gl.getUniformLocation(program, "uMaterialShininess");
	
	// set light
	gl.uniform1f(program.materialShininessUniform, 10);
	gl.uniform3f(program.ambientColorUniform, 0.3, 0.3, 0.3);
	gl.uniform3f(program.pointLightLocationUniform, 2.0, 1.0, 4.0);
    gl.uniform3f(program.pointLightSpecularColorUniform, 0.4, 0.4, 0.4);
    gl.uniform3f(program.pointLightDiffuseColorUniform, 0.6, 0.6, 0.6);
	
	// associate out shader variables with our data buffer
    program.vPosition = gl.getAttribLocation(program, "vPosition");
    gl.enableVertexAttribArray(program.vPosition);
	
	program.vNormal = gl.getAttribLocation(program, "aVertexNormal");
    gl.enableVertexAttribArray(program.vNormal);
    
	return program;
}

// initialization
window.onload = function init() {
    canvas = document.getElementById( "gl-canvas" );
	initWebGL(canvas);
    
    gl.clearColor( 0.99, 0.99, 0.99, 1.0 );
	gl.enable(gl.DEPTH_TEST);
	
	initTexture();
	initialObjects();
	render();
};

function initialObjects() {
	var obj = {};   // sphere
	obj.translateXYZ = vec3(canvas.width/2, canvas.height/2, 0.0);  
	obj.scaleX = 9;
	obj.scaleY = 9;
	obj.scaleZ = 9;
	obj.rotateX = -5;
	obj.rotateY = 0;
	obj.rotateZ = 0;
	var program = newShader();
	obj.program = program;
	obj.type = 0;
	obj.color = vec4(1.0, 1.0, 1.0, 1.0);
	arObjects.push(obj);
}

function scaleDown(x, y) {
  var newx = 2 * x / canvas.width - 1;
  var newy = 2 * (canvas.height - y) / canvas.height - 1;
  return [newx, newy];
}

function updateRotation(cnt) {
	if (orientation == 0) {
		arObjects[cnt].rotateX += 1;
	}
	else if (orientation == 1) {
		arObjects[cnt].rotateX -= 1;
	}
	if (orientation == 2) {
		arObjects[cnt].rotateY += 1;
	}
	else if (orientation == 3) {
		arObjects[cnt].rotateY -= 1;
	}
	if (orientation == 4) {
		arObjects[cnt].rotateZ += 1;
	}
	else if (orientation == 5) {
		arObjects[cnt].rotateZ -= 1;
	}
}

function checkerboard() {
	var image1 = new Array()
    for (var i =0; i<texSize; i++)  image1[i] = new Array();
    for (var i =0; i<texSize; i++) 
        for ( var j = 0; j < texSize; j++) 
           image1[i][j] = new Float32Array(4);
    for (var i =0; i<texSize; i++) for (var j=0; j<texSize; j++) {
        var c = (((i & 0x8) == 0) ^ ((j & 0x8)  == 0));
		if (c <= 0)
			image1[i][j] = [251, 251, 127, 1];
		else
			image1[i][j] = [251, 40, 44, 1];
    }
	// Convert floats to ubytes for texture
	checkerboardImage = new Uint8Array(4*texSize*texSize);
    for ( var i = 0; i < texSize; i++ ) 
        for ( var j = 0; j < texSize; j++ ) 
           for(var k =0; k<4; k++) 
                checkerboardImage[4*texSize*i+4*j+k] = image1[i][j][k];
}

function handleLoadedTexture(texture, flip) {
	gl.activeTexture( gl.TEXTURE0 );
	gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, flip);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
	gl.generateMipmap(gl.TEXTURE_2D);
	gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );
    gl.bindTexture(gl.TEXTURE_2D, null);
}
	
function initTexture() {
    imageTexture = gl.createTexture();
    imageTexture.image = new Image();
    imageTexture.image.onload = function () {
        handleLoadedTexture(imageTexture, false)
    }
    imageTexture.image.src = "./pattern/" + "EarthLowRes.jpg";
	
	patternTexture = gl.createTexture();
    patternTexture.image = new Image();
    patternTexture.image.onload = function () {
        handleLoadedTexture(patternTexture, true)
    }
	patternTexture.image.src = "./pattern/" + "002-blue-seamless-pattern.png";
	//patternTexture.image.src = "./pattern/" + "011_seamless-pale-stone-patio-wall-texture.png";
	
	checkerboard();
	//checkerboardImage = new Uint8Array(checkerboardImage);
	checkerboardTexture = gl.createTexture();
    gl.activeTexture( gl.TEXTURE0 );
    gl.bindTexture( gl.TEXTURE_2D, checkerboardTexture );
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, texSize, texSize, 0, 
        gl.RGBA, gl.UNSIGNED_BYTE, checkerboardImage);
    gl.generateMipmap( gl.TEXTURE_2D );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );
}

function render() {
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	
	var cnt = 0;
	var objType = arObjects[cnt].type;
	var scaleX = -arObjects[cnt].scaleX / 10;
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
	
	// transform in opposite order, model matrix
	var mr = mult(rotate(rotateX, [1, 0, 0]), rotate(rotateY, [0, 1, 0]));
	mr = mult(mr, rotate(rotateZ, [0, 0, 1]));
	var m = mult(translate(translateX, translateY, translateZ), mr);
	var modelViewMatrix = mult(m, scalem(scaleX, scaleY, scaleZ));
		
	var left = -1.0;
	var right = 1.0;
	var ytop = -1.0;
	var bottom = 1.0;
	var near = 0.1;
	var far = 100.0;
	var projectionMatrix = ortho(left, right, bottom, ytop, near, far);
	//var projectionMatrix1 = perspective(-45, canvas.width/canvas.height, 0.1, 100.0);
	
	gl.useProgram(program);
	gl.uniformMatrix4fv(program.modelViewMatrix, false, flatten(modelViewMatrix));
	gl.uniformMatrix4fv(program.projectionMatrix, false, flatten(projectionMatrix) );
	var normMat = normalMatrix(modelViewMatrix, true);
	gl.uniformMatrix3fv(program.normalMatrix, false, flatten(normMat) );
	
	gl.uniform3f(program.ambientColorUniform, 0.9, 0.8, 0.6);
	var ldir = vec3(2.0, 2.0, 6.0);
	ldir = normalize(ldir);
	gl.uniform3f(program.lightingDirectionUniform, ldir[0], ldir[1], ldir[2]);
	gl.uniform3f(program.directionalColorUniform, 0.8, 0.6, 0.5);
	
	// position..........
	var vPositionBuffer = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, vPositionBuffer );
	if (objType == 0) {
		gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(vertexPositionDataSphere), gl.STATIC_DRAW );
	}
	gl.vertexAttribPointer( program.vPosition, 3, gl.FLOAT, false, 0, 0 );
	
	// normal..........
	var vNormalBuffer = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, vNormalBuffer );
	if (objType == 0) {
		gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(normalDataSphere), gl.STATIC_DRAW );
	}
	gl.vertexAttribPointer( program.vNormal, 3, gl.FLOAT, false, 0, 0 );
	
	// texture...
	gl.activeTexture(gl.TEXTURE0);
	if (textureType == 1) {
		gl.bindTexture(gl.TEXTURE_2D, checkerboardTexture);
	}
	else if (textureType == 2) {
		gl.bindTexture(gl.TEXTURE_2D, imageTexture);
	}
	else if (textureType == 3) {
		gl.bindTexture(gl.TEXTURE_2D, patternTexture);
	}
	gl.uniform1i(program.samplerUniform, 0);
		
	var vTextureCoordBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vTextureCoordBuffer);
	if (objType == 0) {
		if (textureCoord == 1)
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordDataSphere), gl.STATIC_DRAW);
		else if (textureCoord == 2)
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordDataSpherePlanar), gl.STATIC_DRAW);
		else if (textureCoord == 3)
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordDataSphereCylinderZigZag), gl.STATIC_DRAW);
	}
	gl.vertexAttribPointer(program.textureCoordAttribute, 2, gl.FLOAT, false, 0, 0);
	
	// index.........
	var indexLength;
	var vIndexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vIndexBuffer );
	if (objType == 0) {
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexDataSphere), gl.STATIC_DRAW);
		indexLength = indexDataSphere.length;
	}
	
	gl.polygonOffset(0.0, 0.0);  // reset polygon offset
	gl.drawElements(gl.TRIANGLES, indexLength, gl.UNSIGNED_SHORT, 0);
		
    updateRotation(cnt);
	if (orientation >= 0) requestAnimFrame( render );
}