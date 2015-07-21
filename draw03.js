// global variables 
var canvas;
var gl;
var program;
var locs = [];
var mousePressed = false;
var lineThickness = 1;
var transparency = 1.0;

// JQuery initialization 
$(function() {
  $( "#spinnerThick" ).spinner({
    min: 1,
	max: 10,
	value: 1,
	step: 1,
	page: 4,
	spin: function( event, ui ) {
		lineThickness = parseInt(ui.value);
	}
  });
  $( "button" ).button().click(function( event ) {
	  gl.clear(gl.COLOR_BUFFER_BIT);
	  mousePressed = false;
    });
});

// JQuery event handlers
$(document).ready(function() {   
  
});

// webgl init
function init() {
    canvas = document.getElementById( "gl-canvas" );
	gl = WebGLUtils.setupWebGL(canvas, {preserveDrawingBuffer:true});
    if ( !gl ) { alert( "WebGL isn't available" ); }
    
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
	gl.clear(gl.COLOR_BUFFER_BIT); // | gl.DEPTH_BUFFER_BIT);
	
    //  Load shaders and initialize attribute buffers
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
	program.vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.enableVertexAttribArray(program.vPosition);
	program.uColor = gl.getUniformLocation( program, "uColor" );
	program.pointSize = gl.getUniformLocation( program, "uPointSize" );
	
    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mouseup", handleMouseUp);
    canvas.addEventListener("mousemove", handleMouseMove);
	canvas.addEventListener("mouseout", handleMouseOut);
};

window.onload = init;

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
	$("#spanMousePos").html(canvasX + ":" + canvasY);
	return vec3(canvasX, canvasY, 0.0);
}
	
function getColor() {
	var r = HexToR(colorhex) / 255.0;
    var g = HexToG(colorhex) / 255.0;
    var b = HexToB(colorhex) / 255.0;
    return vec4(r, g, b, transparency);
}
	
function handleMouseDown(event) {
	mousePressed = true;
	var p = getLoc(event);
	var c = getColor();
	locs = [p];
	render(p, c);
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
	    var c = getColor();
		locs.push(p);
	    render(p, c);
	}
}

function scaleDown(x, y) {
  var newx = 2 * x / canvas.width - 1;
  var newy = 2 * (canvas.height - y) / canvas.height - 1;
  return vec3(newx, newy, 0);
}

function render(p, clr) {
	var points = [];
	for (var i=0; i < (locs.length-1); i++) {
		var p1 = locs[i];
		var p2 = locs[i+1];
		var dx = p2[0] - p1[0];
		var dy = p2[1] - p1[1];
		var t = Math.sqrt(lineThickness*lineThickness / (dx*dx + dy*dy));
		var normalx = t * -dy;
		var normaly = t * dx;
		var a = scaleDown(p1[0] - normalx, p1[1] - normaly);
		var b = scaleDown(p1[0] + normalx, p1[1] + normaly);
		var c = scaleDown(p2[0] - normalx, p2[1] - normaly);
		var d = scaleDown(p2[0] + normalx, p2[1] + normaly);
		points.push(a, b, c, d);
	}
	var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);
    gl.vertexAttribPointer(program.vPointer, 3, gl.FLOAT, false, 0, 0);
	gl.uniform4f(program.uColor, clr[0], clr[1], clr[2], 1.0);
	gl.drawArrays( gl.TRIANGLE_STRIP, 0, points.length );
}