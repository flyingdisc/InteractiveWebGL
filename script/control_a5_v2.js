// create
var object3D = 0;
var orientation = 2; // 0=+x, 1=-x, 2=+y, 3=-y, 4=+z, 5=-z
var objScaleX = 9;
var objScaleY = 9;
var objScaleZ = 9;
var MINSCALE = 1;
var MAXSCALE = 10;
var STEPSCALE = 1;
var textureType = 1;
var textureCoord = 1;

// JQuery initialization 
$(function() {
  $( document ).tooltip({
	position: {
	  //my: "center bottom-10",
	  //at: "center bottom"
	}
  });
  $( "#tabs1" ).tabs({
	heightStyle: "content"
  });
  $( "#sliderScaleX" ).slider({
    value: objScaleX,
    min: MINSCALE,
    max: MAXSCALE,
    step: STEPSCALE,
    slide: function( event, ui ) {
        $( "#textScaleX" ).val(parseInt(ui.value) / 10);
	    arObjects[object3D].scaleX = parseInt(ui.value);
		isRender();
    }
  });
  $( "#sliderScaleX .ui-slider-handle" ).text("x");
  $( "#sliderScaleY" ).slider({
    value: objScaleY,
    min: MINSCALE,
    max: MAXSCALE,
    step: STEPSCALE,
    slide: function( event, ui ) {
        $( "#textScaleY" ).val(parseInt(ui.value) / 10);
	    arObjects[object3D].scaleY = parseInt(ui.value);
		isRender();
    }
  });
  $( "#sliderScaleY .ui-slider-handle" ).text("y");
  $( "#sliderScaleZ" ).slider({
    value: objScaleZ,
    min: MINSCALE,
    max: MAXSCALE,
    step: STEPSCALE,
    slide: function( event, ui ) {
        $( "#textScaleZ" ).val(parseInt(ui.value) / 10);
	    arObjects[object3D].scaleZ = parseInt(ui.value);
		isRender();
    }
  });
  $( "#sliderScaleZ .ui-slider-handle" ).text("z");
  $( ".buttonMin" ).button({
	icons: { primary: "ui-icon-triangle-1-w" }, text: false
  });
  $( ".buttonPlus" ).button({
	icons: { primary: "ui-icon-triangle-1-e" },	text: false
  });
  $( "#radioTexture" ).buttonset();	
  $( "#radioTextureCoord" ).buttonset();	
  $( "#btnRotationX0" ).button({
	icons: { secondary: "ui-icon-plusthick" }, text: true
  }).click(function( event ) {
	checkOrientation(this, 0);
  });
  $( "#btnRotationX1" ).button({
	icons: { secondary: "ui-icon-minusthick" }, text: true
  }).click(function( event ) {
	checkOrientation(this, 1);
  });
  $( "#btnRotationY0" ).button({
	icons: { secondary: "ui-icon-plusthick" }, text: true
  }).click(function( event ) {
	checkOrientation(this, 2);
  });
  $( "#btnRotationY1" ).button({
	icons: { secondary: "ui-icon-minusthick" }, text: true
  }).click(function( event ) {
	checkOrientation(this, 3);
  });
  $( "#btnRotationZ0" ).button({
	icons: { secondary: "ui-icon-plusthick" }, text: true
  }).click(function( event ) {
	checkOrientation(this, 4);
  });
  $( "#btnRotationZ1" ).button({
	icons: { secondary: "ui-icon-minusthick" }, text: true
  }).click(function( event ) {
	checkOrientation(this, 5);
  });
  $( "#btnRotationStop" ).button({
	icons: { secondary: "ui-icon-pause" }, text: true
  }).click(function( event ) {
	checkOrientation(this, -1);
  });
  $( "#btnRotationReset" ).button({
	icons: { secondary: "ui-icon-arrowreturnthick-1-w" }, text: true
  }).click(function( event ) {
	resetOrientation(this, -1);
  });
  $( "#downloadImage" ).button({
    icons: { primary: "ui-icon-arrowthick-1-s" }
  }).click(function( event ) {
	$(this).prop("href", canvas.toDataURL());
  });
});

// JQuery event handlers
$(document).ready(function() {   
  $( "#textScaleX" ).val(objScaleX / 10);
  $( "#textScaleY" ).val(objScaleY / 10);
  $( "#textScaleZ" ).val(objScaleZ / 10);
  checkOrientation($("#btnRotationY0"), 2);
  
  $( "#btnMinSX" ).click(function() {
	objScaleX = arObjects[object3D].scaleX;
	if (objScaleX > MINSCALE) {
		objScaleX -= STEPSCALE;
		$( "#sliderScaleX" ).slider("value", objScaleX);
		$( "#textScaleX" ).val(objScaleX / 10);
		arObjects[object3D].scaleX = objScaleX;
		isRender();
	}
  });
  $( "#btnPlusSX" ).click(function() {
	objScaleX = arObjects[object3D].scaleX;
	if (objScaleX < MAXSCALE) {
		objScaleX += STEPSCALE;
		$( "#sliderScaleX" ).slider("value", objScaleX);
		$( "#textScaleX" ).val(objScaleX / 10);
		arObjects[object3D].scaleX = objScaleX;
		isRender();
	}
  });
  $( "#btnMinSY" ).click(function() {
	objScaleY = arObjects[object3D].scaleY;
	if (objScaleY > MINSCALE) {
		objScaleY -= STEPSCALE;
		$( "#sliderScaleY" ).slider("value", objScaleY);
		$( "#textScaleY" ).val(objScaleY / 10);
		arObjects[object3D].scaleY = objScaleY;
		isRender();
	}
  });
  $( "#btnPlusSY" ).click(function() {
	objScaleY = arObjects[object3D].scaleY;
	if (objScaleY < MAXSCALE) {
		objScaleY += STEPSCALE;
		$( "#sliderScaleY" ).slider("value", objScaleY);
		$( "#textScaleY" ).val(objScaleY / 10);
		arObjects[object3D].scaleY = objScaleY;
		isRender();
	}
  });
  $( "#btnMinSZ" ).click(function() {
	objScaleZ = arObjects[object3D].scaleZ;
	if (objScaleZ > MINSCALE) {
		objScaleZ -= STEPSCALE;
		$( "#sliderScaleZ" ).slider("value", objScaleZ);
		$( "#textScaleZ" ).val(objScaleZ / 10);
		arObjects[object3D].scaleZ = objScaleZ;
		isRender();
	}
  });
  $( "#btnPlusSZ" ).click(function() {
	objScaleZ = arObjects[object3D].scaleZ;
	if (objScaleZ < MAXSCALE) {
		objScaleZ += STEPSCALE;
		$( "#sliderScaleZ" ).slider("value", objScaleZ);
		$( "#textScaleZ" ).val(objScaleZ / 10);
		arObjects[object3D].scaleZ = objScaleZ;
		isRender();
	}
  });
  $( "#radioTexture" ).change(function() {
	textureType = parseInt( $( "input[name='radioTexture']:checked" ).val() );
	isRender();
  });
  $( "#radioTextureCoord" ).change(function() {
	textureCoord = parseInt( $( "input[name='radioTextureCoord']:checked" ).val() );
	isRender();
  });
});

function checkOrientation(self, v) {
	$(".btnRotation").css({"color":"#555555", "font-weight":"normal"});
	$(".btnRotationS").css({"color":"#555555", "font-weight":"normal"});
	$(self).css({"color":"#ff4455", "font-weight":"bold"});
	if (orientation == -1) {
		orientation = v;
		render();
	}
	else
		orientation = v;
}

function resetOrientation(self, v) {
	arObjects[object3D].rotateX = -5;
	arObjects[object3D].rotateY = 0;
	arObjects[object3D].rotateZ = 0;
	checkOrientation($("#btnRotationY0"), 2);
}
  
function isRender() {
	if (orientation == -1) {
		render();
	}
}