/*
 * Copyright 2015-2020, soesilo wijono. 
 * MIT License. 
*/
// global variables 
var canvas;
var gl;
var colors0 = [];
var colors1 = [];
var points0 = [];
var points1 = [];
var MAXANGLE = 720;
var MINANGLE = -720;
var STEPANGLE = 10;
var numTimesToSubdivide = 4;
var thetaAngle = 0;
var isDrawGasket = false;
var isDrawBigShape = false;
var shapeColor = 1;
var radioShape = 1;
var RAD = 0.95; 
var radX = RAD * Math.cos(30.0*Math.PI/180.0);
var radY = RAD * Math.sin(30.0*Math.PI/180.0);
var radS = RAD * Math.sin(45.0*Math.PI/180.0);
var vertices = [
    [  // triangle points, equilateral, centered at [0,0]
        vec2( -radX, -radY ),
        vec2(  0,  RAD ),
        vec2(  radX, -radY )
    ],
    [  // square points, centered at [0,0]  
        vec2( -radS, radS ),
        vec2( radS, radS ),
		vec2( radS, -radS ),
        vec2( -radS, -radS )
    ], 
	[  // star points, centered at [0,0] 
		vec2( -radX, -radY ),
        vec2(  0,  RAD ),
        vec2(  radX, -radY ),
		vec2( -radX, radY ),
        vec2(  0,  -RAD ),
        vec2(  radX, radY )
	]
];
// array of colors 
var CCOLORS = [
		vec4( 1.0, 0.0, 0.0, 1.0 ),  // red (maxwell 1)
		vec4( 0.0, 0.0, 1.0, 1.0 ),  // blue (maxwell 2)
		vec4( 0.0, 1.0, 0.0, 1.0 ),  // green (maxwell 3)
		vec4( 0.0, 0.0, 1.0, 1.0 ),  // blue (maxwell 4)
		vec4( 1.0, 1.0, 1.0, 1.0 ),  // white (wireframe)
		vec4( 0.0, 0.0, 1.0, 0.1 )   // blue (original shape)
	];

// JQuery initialization for sliders, buttons, checkboxes, radiobuttons 
$(function() {
	$( document ).tooltip({
		position: {
			my: "center bottom-10",
			at: "center top"
		}
	});
    $( "#sliderStep" ).slider({
        value:4,
        min: 0,
        max: 6,
        step: 1,
        slide: function( event, ui ) {
            $( "#stepval" ).val( ui.value );
			numTimesToSubdivide = parseInt(ui.value);
			reload();
        }
	});
	$( "#stepval" ).val( $( "#sliderStep" ).slider( "value" ) );
	$( "#sliderTheta" ).slider({
        value:0,
        min: MINANGLE,
        max: MAXANGLE,
        step: STEPANGLE,
        slide: function( event, ui ) {
            $( "#thetaval" ).val( ui.value );
			thetaAngle = parseFloat(ui.value);
			reload();
        }
	});
	$( "#thetaval" ).val( $( "#sliderTheta" ).slider( "value" ) );
	$( "#btnMin" ).button({
		icons: {
			primary: "ui-icon-triangle-1-w"
		},
		text: false
	});
	$( "#btnPlus" ).button({
		icons: {
			primary: "ui-icon-triangle-1-e"
		},
		text: false
	});
	$( "#radioShape" ).buttonset();	
	$( "#checkGasket" ).button();
	$( "#checkDrawBig" ).button();
	$( "#radioColor" ).buttonset();
	$( "#checkGasket" ).prop("checked", isDrawGasket);
	$( "#checkDrawBig" ).prop("checked", isDrawBigShape);
	$( "#checkColor" ).prop("checked", shapeColor);
});	

// JQuery event handlers
$(document).ready(function() {   
    $( "#btnMin" ).click(function() {
		if (thetaAngle > MINANGLE) {
			thetaAngle = thetaAngle - STEPANGLE;
			$( "#sliderTheta" ).slider("value", thetaAngle);
			$( "#thetaval" ).val( thetaAngle );
			reload();
		}
	});
	$( "#btnPlus" ).click(function() {
		if (thetaAngle < MAXANGLE) {
			thetaAngle = thetaAngle + STEPANGLE;
			$( "#sliderTheta" ).slider("value", thetaAngle);
			$( "#thetaval" ).val( thetaAngle );
			reload();
		}
	});
	$( "#checkGasket" ).change(function() {
		if ($(this).is(":checked")) {
			$(this).button("option", "label", "Gasket = Yes");
			isDrawGasket = true;
		}
		else {
			$(this).button("option", "label", "Gasket = No");
			isDrawGasket = false;
		}
		reload();
	});
	$( "#checkDrawBig" ).click(function() {
		if ($(this).is(":checked")) {
			$(this).button("option", "label", "Original shape = Yes");
			isDrawBigShape = true;
		}
		else {
			$(this).button("option", "label", "Original shape = No");
			isDrawBigShape = false;
		}
		reload();
	});
	$( "#radioColor" ).change(function() {
		shapeColor = parseInt( $( "input[name='radioColor']:checked" ).val() );
		reload();
	});
	$( "#radioShape" ).change(function() {
		radioShape = parseInt( $( "input[name='radioShape']:checked" ).val() );
		if ((radioShape == 1) || (radioShape == 3)) {  
			$( "#checkGasket" ).prop("disabled", false);
			$( "#spanGasket" ).html("Draw in gasket mode?");
		}
		else { // if square, disable gasket
			$( "#checkGasket" ).prop("disabled", true);
			$( "#spanGasket" ).html("Gasket mode is disabled for square");
		}
		reload();
	});
});

// webgl init
function init() {
    canvas = document.getElementById( "gl-canvas" );
	
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }
	
	// enable hidden-surface removal
    gl.enable(gl.DEPTH_TEST);
    
	// do twist by recursive subdivision 
	originalShape( radioShape );
    subdivision( vertices[radioShape-1], radioShape, numTimesToSubdivide);
	
    //  Configure WebGL
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.0, 0.0, 0.0, 1.0 );

    //  Load shaders and initialize attribute buffers
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

	// colors, 1st, load data into GPU
	var cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(colors0.concat(colors1)), gl.STATIC_DRAW );
    
	// associate out shader variables with our data buffer
    var vColor = gl.getAttribLocation( program, "vColor");
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);
	
    // vertices, 1st, load the data into the GPU
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
	gl.bufferData( gl.ARRAY_BUFFER, flatten(points0.concat(points1)), gl.STATIC_DRAW );

    // associate out shader variables with our data buffer
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
	
	render();
};

// twist a point
function twistShape( a, depth ) {
	var aRad = Math.sqrt(a[0]*a[0] + a[1]*a[1]) / RAD;
	var thetaAngleRad = -thetaAngle * Math.PI / 180.0;
	var aRadTheta = aRad * thetaAngleRad;
	var aRadCos = Math.cos(aRadTheta);
	var aRadSin = Math.sin(aRadTheta);
	var aX = a[0] * aRadCos - a[1] * aRadSin;
	var aY = a[0] * aRadSin + a[1] * aRadCos;
	var a1 = vec3( aX, aY, depth );
	return a1;
}

// push a vertex to buffer
function pushShape( v ) {
	var len = v.length;
	a2 = [];
	for (var i=0; i < len; i++) {
		a1 = twistShape(v[i], -0.2);
		a2[i] = vec3(a1[0], a1[1], -0.4);
	
		if (shapeColor == 2) {  // single color
			colors1.push( CCOLORS[0] ); 
			points1.push( a1 );  // vertex
		}
		else if (shapeColor == 3) {  // maxwell colors
			colors1.push( CCOLORS[(i % len)] ); 
			points1.push( a1 );  // vertex
		}
		else if (shapeColor == 4) {  // random colors
			var rc = vec4( Math.random(), Math.random(), Math.random(), 1.0 );
			colors1.push( rc ); 
			points1.push( a1 );  // vertex
		}
	}
	if (shapeColor == 1) {  // wireframe
		for (var m=0; m < len; m++) {
			n = (m+1)%len;
			colors1.push( CCOLORS[4], CCOLORS[4] ); 
			points1.push( a2[m], a2[n] );
		}
	}
}

// recursive subdivision for a triangle
function subdivision( v, ns, count ) {
	if (ns == 3) {  // star
		var v1 = [v[0], v[1], v[2]];
		var v2 = [v[5], v[4], v[3]];
		subdivision( v1, 1, count );
		subdivision( v2, 1, count );
		return;
	}
	
	var len = v.length;
    // check for end of recursion
	if ( count == 0 ) {
		pushShape( v );
    }
    else {
        //bisect the sides
		var b = [];
		for (var i=0; i < len; i++) {
			j = (i+1)%len;
			b[i] = mix( v[i], v[j], 0.5 );
		}
        --count;

        // new shape
		if (ns == 1) {  // triangle
			subdivision( [v[0], b[0], b[2]], ns, count );
			subdivision( [v[1], b[1], b[0]], ns, count );
			subdivision( [v[2], b[2], b[1]], ns, count );
			if (!isDrawGasket) { subdivision( [b[0], b[1], b[2]], ns, count ); }
		}
		else if (ns == 2) {  // square
			b[4] = mix( b[0], b[2], 0.5 );
			subdivision( [v[0], b[0], b[4], b[3]], ns, count );
			subdivision( [v[1], b[0], b[4], b[1]], ns, count );
			subdivision( [v[2], b[2], b[4], b[1]], ns, count );
			subdivision( [v[3], b[2], b[4], b[3]], ns, count ); 
		}
    }
}

// push original shape to buffer
function originalShape( nshape ) {
	var len = vertices[nshape-1].length;
	var z = [];
	for (var i=0; i < len; i++) {
		z[i] = twistShape(vertices[nshape-1][i], 0.1);
	}
	
	if (isDrawBigShape) {
		for (var i=0; i < len; i++) {
			colors0.push( CCOLORS[5] );
			points0.push( z[i] );
		}
	}
}

window.onload = init;

// on event call this function
function reload() {
	colors0 = [];
	points0 = [];
    colors1 = [];
	points1 = [];
    requestAnimFrame(init);
}

// rendering function
function render() {
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	// draw original shape
	if (radioShape == 1) {
		gl.drawArrays( gl.TRIANGLES, 0, points0.length );
	}
	else if (radioShape == 2) {
		for (var i=0; i < points0.length; i+=4) {
			gl.drawArrays( gl.TRIANGLE_FAN, 0, 4 );
		}
	}
	else if (radioShape == 3) {
		gl.drawArrays( gl.TRIANGLES, 0, points0.length );
	}
	var lenTotal = points0.length + points1.length;
	if (shapeColor == 1) {  // wireframe
		gl.drawArrays( gl.LINES, points0.length, points1.length );
	}
	else {  // single color, or maxwell colors
		if (radioShape == 1) {
			gl.drawArrays( gl.TRIANGLES, points0.length, points1.length );
		}
		else if (radioShape == 2) {
			for (var i=points0.length; i < lenTotal; i+=4) {
				gl.drawArrays( gl.TRIANGLE_FAN, i, 4 );
			}
		}
		else if (radioShape == 3) {
			gl.drawArrays( gl.TRIANGLES, points0.length, points1.length );
		}
	}
}
