// create
var object3D = 0;
var objColor = vec4(1.0, 0.0, 0.0, 1.0); // default red
var editColor;
var objScaleX = 3;
var objScaleY = 3;
var objScaleZ = 3;
var MINSCALE = 1;
var MAXSCALE = 10;
var STEPSCALE = 1;
var objTranslateX = 0;
var objTranslateY = 0;
var objTranslateZ = 0;
var MINTRANSLATE = -10;
var MAXTRANSLATE = 10;
var STEPTRANSLATE = 1;
var objRotateX = 10;
var objRotateY = 5;
var objRotateZ = -10;
var MINROTATE = -180;
var MAXROTATE = 180;
var STEPROTATE = 1;
// select..
var objScale2X = 0;
var objScale2Y = 0;
var objScale2Z = 0;
var MINSCALE2 = 1;
var MAXSCALE2 = 10;
var STEPSCALE2 = 1;
var objTranslate2X = 0;
var objTranslate2Y = 0;
var objTranslate2Z = 0;
var MINTRANSLATE2 = -10;
var MAXTRANSLATE2 = 10;
var STEPTRANSLATE2 = 1;
var MINTRANSLATE2X = 0;
var MAXTRANSLATE2X = 599;
var MINTRANSLATE2Y = 0;
var MAXTRANSLATE2Y = 599;
var objRotate2X = 0;
var objRotate2Y = 0;
var objRotate2Z = 0;
var MINROTATE2 = -180;
var MAXROTATE2 = 180;
var STEPROTATE2 = 1;
/*var objCameraX = 0;
var objCameraY = 0;
var objCameraZ = 0;
var MINCAMERA = -180;
var MAXCAMERA = 180;
var STEPCAMERA = 1;*/
var surface = 0;
var randomColor = 0;
var isLighting = true;

// JQuery initialization 
$(function() {
  $( document ).tooltip({
	position: {
	  //my: "center bottom-10",
	  //at: "center bottom"
	}
  });
  $( "#menuSelectObject" ).menu({
    select: function( event, ui ) {
	  var txt = ui.item.text();
	  $(".menuObjectSel").css("background-color", "#ffffff");
	  $("#menuObject" + txt).css("background-color", "#bbbbbb");
	  if (txt == "Sphere") object3D = 0; else if (txt == "Cone") object3D = 1; else if (txt == "Cylinder") object3D = 2; 
	}
  });
  $( "#sliderScaleX" ).slider({
    value: objScaleX,
    min: MINSCALE,
    max: MAXSCALE,
    step: STEPSCALE,
    slide: function( event, ui ) {
        $( "#textScaleX" ).val(parseInt(ui.value) / 10);
	    objScaleX = parseInt(ui.value);
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
	    objScaleY = parseInt(ui.value);
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
	    objScaleZ = parseInt(ui.value);
    }
  });
  $( "#sliderScaleZ .ui-slider-handle" ).text("z");
  $( "#sliderTranslateZ" ).slider({
    value: objTranslateZ,
    min: MINTRANSLATE,
    max: MAXTRANSLATE,
    step: STEPTRANSLATE,
    slide: function( event, ui ) {
        $( "#textTranslateZ" ).val(parseInt(ui.value) / 10);
	    objTranslateZ = parseInt(ui.value);
    }
  });
  $( "#sliderTranslateZ .ui-slider-handle" ).text("z");
  
  $( "#sliderRotateX" ).slider({
    value: objRotateX,
    min: MINROTATE,
    max: MAXROTATE,
    step: STEPROTATE,
    slide: function( event, ui ) {
        $( "#textRotateX" ).val( ui.value );
	    objRotateX = parseInt(ui.value);
    }
  });
  $( "#sliderRotateX .ui-slider-handle" ).text("x");
  $( "#sliderRotateY" ).slider({
    value: objRotateY,
    min: MINROTATE,
    max: MAXROTATE,
    step: STEPROTATE,
    slide: function( event, ui ) {
        $( "#textRotateY" ).val( ui.value );
	    objRotateY = parseInt(ui.value);
    }
  });
  $( "#sliderRotateY .ui-slider-handle" ).text("y");
  $( "#sliderRotateZ" ).slider({
    value: objRotateZ,
    min: MINROTATE,
    max: MAXROTATE,
    step: STEPROTATE,
    slide: function( event, ui ) {
        $( "#textRotateZ" ).val( ui.value );
	    objRotateZ = parseInt(ui.value);
    }
  });
  $( "#sliderRotateZ .ui-slider-handle" ).text("z");  

  $( "#sliderScale2X" ).slider({
    value: objScale2X,
    min: MINSCALE2,
    max: MAXSCALE2,
    step: STEPSCALE2,
    slide: function( event, ui ) {
        $( "#textScale2X" ).val(parseInt(ui.value) / 10);
	    objScale2X = parseInt(ui.value);
		selectedTransform();
    }
  });
  $( "#sliderScale2X .ui-slider-handle" ).text("x");
  $( "#sliderScale2Y" ).slider({
    value: objScale2Y,
    min: MINSCALE2,
    max: MAXSCALE2,
    step: STEPSCALE2,
    slide: function( event, ui ) {
        $( "#textScale2Y" ).val(parseInt(ui.value) / 10);
	    objScale2Y = parseInt(ui.value);
		selectedTransform();
    }
  });
  $( "#sliderScale2Y .ui-slider-handle" ).text("y");
  $( "#sliderScale2Z" ).slider({
    value: objScale2Z,
    min: MINSCALE2,
    max: MAXSCALE2,
    step: STEPSCALE2,
    slide: function( event, ui ) {
        $( "#textScale2Z" ).val(parseInt(ui.value) / 10);
	    objScale2Z = parseInt(ui.value);
		selectedTransform();
    }
  });
  $( "#sliderScale2Z .ui-slider-handle" ).text("z");
  $( "#sliderTranslate2X" ).slider({
    value: objTranslate2X,
    min: MINTRANSLATE2X,
    max: MAXTRANSLATE2X,
    step: STEPTRANSLATE2,
    slide: function( event, ui ) {
        $( "#textTranslate2X" ).val(parseInt(ui.value));
	    objTranslate2X = parseInt(ui.value);
		selectedTransform();
    }
  });
  $( "#sliderTranslate2X .ui-slider-handle" ).text("x");
  $( "#sliderTranslate2Y" ).slider({
    value: objTranslate2Y,
    min: MINTRANSLATE2Y,
    max: MAXTRANSLATE2Y,
    step: STEPTRANSLATE2,
    slide: function( event, ui ) {
        $( "#textTranslate2Y" ).val(parseInt(ui.value));
	    objTranslate2Y = parseInt(ui.value);
		selectedTransform();
    }
  });
  $( "#sliderTranslate2Y .ui-slider-handle" ).text("y");
  $( "#sliderTranslate2Z" ).slider({
    value: objTranslate2Z,
    min: MINTRANSLATE2,
    max: MAXTRANSLATE2,
    step: STEPTRANSLATE2,
    slide: function( event, ui ) {
        $( "#textTranslate2Z" ).val(parseInt(ui.value) / 10);
	    objTranslate2Z = parseInt(ui.value);
		selectedTransform();
    }
  });
  $( "#sliderTranslate2Z .ui-slider-handle" ).text("z");
  $( "#sliderRotate2X" ).slider({
    value: objRotate2X,
    min: MINROTATE2,
    max: MAXROTATE2,
    step: STEPROTATE2,
    slide: function( event, ui ) {
        $( "#textRotate2X" ).val( ui.value );
	    objRotate2X = parseInt(ui.value);
		selectedTransform();
    }
  });
  $( "#sliderRotate2X .ui-slider-handle" ).text("x");
  $( "#sliderRotate2Y" ).slider({
    value: objRotate2Y,
    min: MINROTATE2,
    max: MAXROTATE2,
    step: STEPROTATE2,
    slide: function( event, ui ) {
        $( "#textRotate2Y" ).val( ui.value );
	    objRotate2Y = parseInt(ui.value);
		selectedTransform();
    }
  });
  $( "#sliderRotate2Y .ui-slider-handle" ).text("y");
  $( "#sliderRotate2Z" ).slider({
    value: objRotate2Z,
    min: MINROTATE2,
    max: MAXROTATE2,
    step: STEPROTATE2,
    slide: function( event, ui ) {
        $( "#textRotate2Z" ).val( ui.value );
	    objRotate2Z = parseInt(ui.value);
		selectedTransform();
    }
  });
  $( "#sliderRotate2Z .ui-slider-handle" ).text("z");    
  /*$( "#sliderCameraX" ).slider({
    value: objCameraX,
    min: MINCAMERA,
    max: MAXCAMERA,
    step: STEPCAMERA,
    slide: function( event, ui ) {
        $( "#textCameraX" ).val( ui.value );
	    objCameraX = parseInt(ui.value);
		render();
    }
  });
  $( "#sliderCameraX .ui-slider-handle" ).text("x");
  $( "#sliderCameraY" ).slider({
    value: objCameraY,
    min: MINCAMERA,
    max: MAXCAMERA,
    step: STEPCAMERA,
    slide: function( event, ui ) {
        $( "#textCameraY" ).val( ui.value );
	    objCameraY = parseInt(ui.value);
		render();
    }
  });
  $( "#sliderCameraY .ui-slider-handle" ).text("y");
  $( "#sliderCameraZ" ).slider({
    value: objCameraZ,
    min: MINCAMERA,
    max: MAXCAMERA,
    step: STEPCAMERA,
    slide: function( event, ui ) {
        $( "#textCameraZ" ).val( ui.value );
	    objCameraZ = parseInt(ui.value);
		render();
    }
  });
  $( "#sliderCameraZ .ui-slider-handle" ).text("z");*/
  $( ".buttonMin" ).button({
	icons: { primary: "ui-icon-triangle-1-w" }, text: false
  });
  $( ".buttonPlus" ).button({
	icons: { primary: "ui-icon-triangle-1-e" },	text: false
  });
  $( "#radioSurface" ).buttonset();	
  $( "#radioRandom" ).buttonset();	
  $( "#btnUndo" ).button().click(function( event ) {
	var last = arObjects.length-1;
	if (last >= 0) {
	  arObjects.splice(last, 1);  // remove
	  listObjects(0);
	  render();
	}
  });
  $( "#clearCanvas" ).button({
    icons: { primary: "ui-icon-close" }
  }).click(function( event ) {
	  gl.clear(gl.COLOR_BUFFER_BIT);
	  arObjects = [];
	  listObjects(0);
	  mousePressed = false;
    });
  $( "#downloadImage" ).button({
    icons: { primary: "ui-icon-arrowthickstop-1-s" }
  }).click(function( event ) {
	  $(this).prop("href", canvas.toDataURL());
	  
    });
  $( "#saveJson" ).button({
    icons: { primary: "ui-icon-arrowthickstop-1-s" }
  }).click(function( event ) {
	  save2Json();
  });
  $( "#btnLoadJson" ).button({
    icons: { primary: "ui-icon-arrowthickstop-1-n" }
  }).click(function( event ) {
	 $("#loadJson").trigger("click");  
  });
  $( "#loadJson" ).change(function( event ) {
	  loadFromJson(event);
  });
  $( "#deleteObject" ).button().click(function( event ) {
	  deleteSelectedObject();
	});
  $("#btnObjColor").spectrum({
	color: rgb2hex(objColor),
    change: function(color) {
	  objColor = getColor(color.toHexString());
  }});
  $("#btnEditColor").spectrum({
    change: function(color) {
	  if (isNotEmpty) {
		editColor = getColor(color.toHexString());
		selectedTransform();
		return true;
	  }
	  else {
		return false;
	  }
  }});
});

// JQuery event handlers
$(document).ready(function() {   
  $("#menuObjectSphere").css("background-color", "#bbbbbb");
  $( "#textScaleX" ).val(objScaleX / 10);
  $( "#textScaleY" ).val(objScaleY / 10);
  $( "#textScaleZ" ).val(objScaleZ / 10);
  $( "#textTranslateX" ).val(objTranslateX);
  $( "#textTranslateY" ).val(objTranslateY);
  $( "#textTranslateZ" ).val(objTranslateZ / 10);
  $( "#textRotateX" ).val( objRotateX );
  $( "#textRotateY" ).val( objRotateY );
  $( "#textRotateZ" ).val( objRotateZ );
  /*$( "#textCameraX" ).val( objCameraX );
  $( "#textCameraY" ).val( objCameraY );
  $( "#textCameraZ" ).val( objCameraZ );*/
  $( "#btnMinSX" ).click(function() {
	if (objScaleX > MINSCALE) {
		objScaleX -= STEPSCALE;
		$( "#sliderScaleX" ).slider("value", objScaleX);
		$( "#textScaleX" ).val(objScaleX / 10);
	}
  });
  $( "#btnPlusSX" ).click(function() {
	if (objScaleX < MAXSCALE) {
		objScaleX += STEPSCALE;
		$( "#sliderScaleX" ).slider("value", objScaleX);
		$( "#textScaleX" ).val(objScaleX / 10);
	}
  });
  $( "#btnMinSY" ).click(function() {
	if (objScaleY > MINSCALE) {
		objScaleY -= STEPSCALE;
		$( "#sliderScaleY" ).slider("value", objScaleY);
		$( "#textScaleY" ).val(objScaleY / 10);
	}
  });
  $( "#btnPlusSY" ).click(function() {
	if (objScaleY < MAXSCALE) {
		objScaleY += STEPSCALE;
		$( "#sliderScaleY" ).slider("value", objScaleY);
		$( "#textScaleY" ).val(objScaleY / 10);
	}
  });
  $( "#btnMinSZ" ).click(function() {
	if (objScaleZ > MINSCALE) {
		objScaleZ -= STEPSCALE;
		$( "#sliderScaleZ" ).slider("value", objScaleZ);
		$( "#textScaleZ" ).val(objScaleZ / 10);
	}
  });
  $( "#btnPlusSZ" ).click(function() {
	if (objScaleZ < MAXSCALE) {
		objScaleZ += STEPSCALE;
		$( "#sliderScaleZ" ).slider("value", objScaleZ);
		$( "#textScaleZ" ).val(objScaleZ / 10);
	}
  });
  
  $( "#btnMinTZ" ).click(function() {
	if (objTranslateZ > MINTRANSLATE) {
		objTranslateZ -= STEPTRANSLATE;
		$( "#sliderTranslateZ" ).slider("value", objTranslateZ);
		$( "#textTranslateZ" ).val(objTranslateZ / 10);
	}
  });
  $( "#btnPlusTZ" ).click(function() {
	if (objTranslateZ < MAXTRANSLATE) {
		objTranslateZ += STEPTRANSLATE;
		$( "#sliderTranslateZ" ).slider("value", objTranslateZ);
		$( "#textTranslateZ" ).val(objTranslateZ / 10);
	}
  });
  $( "#btnMinRX" ).click(function() {
	if (objRotateX > MINROTATE) {
		objRotateX -= STEPROTATE;
		$( "#sliderRotateX" ).slider("value", objRotateX);
		$( "#textRotateX" ).val( objRotateX );
	}
  });
  $( "#btnPlusRX" ).click(function() {
	if (objRotateX < MAXROTATE) {
		objRotateX += STEPROTATE;
		$( "#sliderRotateX" ).slider("value", objRotateX);
		$( "#textRotateX" ).val( objRotateX );
	}
  });
  $( "#btnMinRY" ).click(function() {
	if (objRotateY > MINROTATE) {
		objRotateY -= STEPROTATE;
		$( "#sliderRotateY" ).slider("value", objRotateY);
		$( "#textRotateY" ).val( objRotateY );
	}
  });
  $( "#btnPlusRY" ).click(function() {
	if (objRotateY < MAXROTATE) {
		objRotateY += STEPROTATE;
		$( "#sliderRotateY" ).slider("value", objRotateY);
		$( "#textRotateY" ).val( objRotateY );
	}
  });
  $( "#btnMinRZ" ).click(function() {
	if (objRotateZ > MINROTATE) {
		objRotateZ -= STEPROTATE;
		$( "#sliderRotateZ" ).slider("value", objRotateZ);
		$( "#textRotateZ" ).val( objRotateZ );
	}
  });
  $( "#btnPlusRZ" ).click(function() {
	if (objRotateZ < MAXROTATE) {
		objRotateZ += STEPROTATE;
		$( "#sliderRotateZ" ).slider("value", objRotateZ);
		$( "#textRotateZ" ).val( objRotateZ );
	}
  });
  $( "#btnMinS2X" ).click(function() {
	if (objScale2X > MINSCALE2) {
		objScale2X -= STEPSCALE2;
		$( "#sliderScale2X" ).slider("value", objScale2X);
		$( "#textScale2X" ).val(objScale2X / 10);
		selectedTransform();
	}
  });
  $( "#btnPlusS2X" ).click(function() {
	if (objScale2X < MAXSCALE2) {
		objScale2X += STEPSCALE2;
		$( "#sliderScale2X" ).slider("value", objScale2X);
		$( "#textScale2X" ).val(objScale2X / 10);
		selectedTransform();
	}
  });
  $( "#btnMinS2Y" ).click(function() {
	if (objScale2Y > MINSCALE2) {
		objScale2Y -= STEPSCALE2;
		$( "#sliderScale2Y" ).slider("value", objScale2Y);
		$( "#textScale2Y" ).val(objScale2Y / 10);
		selectedTransform();
	}
  });
  $( "#btnPlusS2Y" ).click(function() {
	if (objScale2Y < MAXSCALE2) {
		objScale2Y += STEPSCALE2;
		$( "#sliderScale2Y" ).slider("value", objScale2Y);
		$( "#textScale2Y" ).val(objScale2Y / 10);
		selectedTransform();
	}
  });
  $( "#btnMinS2Z" ).click(function() {
	if (objScale2Z > MINSCALE2) {
		objScale2Z -= STEPSCALE2;
		$( "#sliderScale2Z" ).slider("value", objScale2Z);
		$( "#textScale2Z" ).val(objScale2Z / 10);
		selectedTransform();
	}
  });
  $( "#btnPlusS2Z" ).click(function() {
	if (objScale2Z < MAXSCALE2) {
		objScale2Z += STEPSCALE2;
		$( "#sliderScale2Z" ).slider("value", objScale2Z);
		$( "#textScale2Z" ).val(objScale2Z / 10);
		selectedTransform();
	}
  });
  $( "#btnMinT2X" ).click(function() {
	if (objTranslate2X > MINTRANSLATE2X) {
		objTranslate2X -= STEPTRANSLATE2;
		$( "#sliderTranslate2X" ).slider("value", objTranslate2X);
		$( "#textTranslate2X" ).val(objTranslate2X / 10);
		selectedTransform();
	}
  });
  $( "#btnPlusT2X" ).click(function() {
	if (objTranslate2X < MAXTRANSLATE2X) {
		objTranslate2X += STEPTRANSLATE2;
		$( "#sliderTranslate2X" ).slider("value", objTranslate2X);
		$( "#textTranslate2X" ).val(objTranslate2X);
		selectedTransform();
	}
  });
    $( "#btnMinT2Y" ).click(function() {
	if (objTranslate2Y > MINTRANSLATE2Y) {
		objTranslate2Y -= STEPTRANSLATE2;
		$( "#sliderTranslate2Y" ).slider("value", objTranslate2Y);
		$( "#textTranslate2Y" ).val(objTranslate2Y);
		selectedTransform();
	}
  });
  $( "#btnPlusT2Y" ).click(function() {
	if (objTranslate2Y < MAXTRANSLATE2Y) {
		objTranslate2Y += STEPTRANSLATE2;
		$( "#sliderTranslate2Y" ).slider("value", objTranslate2Y);
		$( "#textTranslate2Y" ).val(objTranslate2Y / 10);
		selectedTransform();
	}
  });
  $( "#btnMinT2Z" ).click(function() {
	if (objTranslate2Z > MINTRANSLATE2) {
		objTranslate2Z -= STEPTRANSLATE2;
		$( "#sliderTranslate2Z" ).slider("value", objTranslate2Z);
		$( "#textTranslate2Z" ).val(objTranslate2Z / 10);
		selectedTransform();
	}
  });
  $( "#btnPlusT2Z" ).click(function() {
	if (objTranslate2Z < MAXTRANSLATE2) {
		objTranslate2Z += STEPTRANSLATE2;
		$( "#sliderTranslate2Z" ).slider("value", objTranslate2Z);
		$( "#textTranslate2Z" ).val(objTranslate2Z / 10);
		selectedTransform();
	}
  });
  $( "#btnMinR2X" ).click(function() {
	if (objRotate2X > MINROTATE2) {
		objRotate2X -= STEPROTATE2;
		$( "#sliderRotate2X" ).slider("value", objRotate2X);
		$( "#textRotate2X" ).val( objRotate2X );
		selectedTransform();
	}
  });
  $( "#btnPlusR2X" ).click(function() {
	if (objRotate2X < MAXROTATE2) {
		objRotate2X += STEPROTATE2;
		$( "#sliderRotate2X" ).slider("value", objRotate2X);
		$( "#textRotate2X" ).val( objRotate2X );
		selectedTransform();
	}
  });
  $( "#btnMinR2Y" ).click(function() {
	if (objRotate2Y > MINROTATE2) {
		objRotate2Y -= STEPROTATE2;
		$( "#sliderRotate2Y" ).slider("value", objRotate2Y);
		$( "#textRotate2Y" ).val( objRotate2Y );
		selectedTransform();
	}
  });
  $( "#btnPlusR2Y" ).click(function() {
	if (objRotate2Y < MAXROTATE2) {
		objRotate2Y += STEPROTATE2;
		$( "#sliderRotate2Y" ).slider("value", objRotate2Y);
		$( "#textRotate2Y" ).val( objRotate2Y );
		selectedTransform();
	}
  });
  $( "#btnMinR2Z" ).click(function() {
	if (objRotate2Z > MINROTATE2) {
		objRotate2Z -= STEPROTATE2;
		$( "#sliderRotate2Z" ).slider("value", objRotate2Z);
		$( "#textRotate2Z" ).val( objRotate2Z );
		selectedTransform();
	}
  });
  $( "#btnPlusR2Z" ).click(function() {
	if (objRotate2Z < MAXROTATE2) {
		objRotate2Z += STEPROTATE2;
		$( "#sliderRotate2Z" ).slider("value", objRotate2Z);
		$( "#textRotate2Z" ).val( objRotate2Z );
		selectedTransform();
	}
  });
  /*$( "#btnMinCX" ).click(function() {
	if (objCameraX > MINCAMERA) {
		objCameraX -= STEPCAMERA;
		$( "#sliderCameraX" ).slider("value", objCameraX);
		$( "#textCameraX" ).val( objCameraX );
		render();
	}
  });
  $( "#btnPlusCX" ).click(function() {
	if (objCameraX < MAXCAMERA) {
		objCameraX += STEPCAMERA;
		$( "#sliderCameraX" ).slider("value", objCameraX);
		$( "#textCameraX" ).val( objCameraX );
		render();
	}
  });
  $( "#btnMinCY" ).click(function() {
	if (objCameraY > MINCAMERA) {
		objCameraY -= STEPCAMERA;
		$( "#sliderCameraY" ).slider("value", objCameraY);
		$( "#textCameraY" ).val( objCameraY );
		render();
	}
  });
  $( "#btnPlusCY" ).click(function() {
	if (objCameraY < MAXCAMERA) {
		objCameraY += STEPCAMERA;
		$( "#sliderCameraY" ).slider("value", objCameraY);
		$( "#textCameraY" ).val( objCameraY );
		render();
	}
  });
  $( "#btnMinCZ" ).click(function() {
	if (objCameraZ > MINCAMERA) {
		objCameraZ -= STEPCAMERA;
		$( "#sliderCameraZ" ).slider("value", objCameraZ);
		$( "#textCameraZ" ).val( objCameraZ );
		render();
	}
  });
  $( "#btnPlusCZ" ).click(function() {
	if (objCameraZ < MAXCAMERA) {
		objCameraZ += STEPCAMERA;
		$( "#sliderCameraZ" ).slider("value", objCameraZ);
		$( "#textCameraZ" ).val( objCameraZ );
		render();
	}
  });*/
  $( "#radioSurface" ).change(function() {
	surface = parseInt( $( "input[name='radioSurface']:checked" ).val() );
	render();
  });
  $( "#checkLighting" ).change(function() {
	if ($(this).is(":checked")) {
	  isLighting = true;
	}
	else {
	  isLighting = false;
	}
	render();
  });
  $( "#radioRandom" ).change(function() {
	randomColor = parseInt( $( "input[name='radioRandom']:checked" ).val() );
	render();
  });
  // delegated event for dynamically created,
  $( "#tableObjects" ).on('change', '.radioSelect', function () {
	fillSelection();
  });
  
});

function HexToR(h) {return parseInt((cutHex(h)).substring(0,2),16)}
function HexToG(h) {return parseInt((cutHex(h)).substring(2,4),16)}
function HexToB(h) {return parseInt((cutHex(h)).substring(4,6),16)}
function cutHex(h) {return (h.charAt(0)=="#") ? h.substring(1,7):h}

function getColor(color) {
	var r = HexToR(color) / 255.0;
    var g = HexToG(color) / 255.0;
    var b = HexToB(color) / 255.0;
    return vec4(r, g, b, transparency);
}

function rgb2hex(clr) {
	var red = clr[0] * 255.0;
	var green = clr[1] * 255.0;
	var blue = clr[2] * 255.0;
    var rgb = blue | (green << 8) | (red << 16);
    return '#' + (0x1000000 + rgb).toString(16).slice(1)
}
  
function listObjects(nsel) {
	if (arObjects.length <= 0) {
		$( "#tableObjects" ).html("");
		return;
	}
	var stype = ["sphere  ", "cone    ", "cylinder"];
	var s = "<table style='font-size:12px;'>";
	var clr, x, y, z, ischeck;
	s += "<tr style='background-color:#aaaaaa;'><th>id</th><th>type</th><th>color</th><th>x</th><th>y</th><th>z</th><th>select</th></tr>";
	for (var i=0; i < arObjects.length; i++) {
		s += "<tr><td class='cellbox'>" + (i+1) + "</td>";
		s += "<td class='cellbox'>" + stype[arObjects[i].type] + "</td>";
		clr = rgb2hex(arObjects[i].color);
		s += "<td class='cellbox'><span style='background-color:" + clr + ";'>&nbsp;&nbsp;&nbsp;&nbsp;</span></td>";
		x = arObjects[i].translateXYZ[0];
		y = arObjects[i].translateXYZ[1];
		z = (arObjects[i].translateXYZ[2] / 10).toFixed(1);
		s += "<td class='cellbox'>" + x + "</td><td class='cellbox'>" + y + "</td><td class='cellbox'>" + z + "</td>";
		ischeck = "";
		if (i == nsel) ischeck = "checked='checked'";
		s += "<td class='cellbox'><input type='radio' class='radioSelect' name='radioSelectObject' id='radioSel" + (i) + 
		     "' value='" + (i) + "' " + ischeck + " /></td>";
		s += "</tr>";
	}
	s += "</table>";
	$( "#tableObjects" ).html(s);
	fillSelection();
}

function deleteSelectedObject() {
	if ($("input[type=radio][name=radioSelectObject]").length) {
		var selection = parseInt( $("input[name='radioSelectObject']:checked").val() );
		arObjects.splice(selection, 1);  // remove
		listObjects(0);
		render();
	}
}

function fillSelection() {
	var selection = parseInt( $( "input[name='radioSelectObject']:checked" ).val() );
	var obj = arObjects[selection];
	objScale2X = obj.scaleX;
	objScale2Y = obj.scaleY;
	objScale2Z = obj.scaleZ;
	objTranslate2X = obj.translateXYZ[0];
	objTranslate2Y = obj.translateXYZ[1];
	objTranslate2Z = obj.translateXYZ[2];
	objRotate2X = obj.rotateX;
	objRotate2Y = obj.rotateY;
	objRotate2Z = obj.rotateZ;
	editColor = obj.color;
	$( "#btnEditColor" ).spectrum( "set", rgb2hex(editColor) );
	
	$( "#textScale2X" ).val(objScale2X / 10);
	$( "#textScale2Y" ).val(objScale2Y / 10);
	$( "#textScale2Z" ).val(objScale2Z / 10);
	$( "#textTranslate2X" ).val(objTranslate2X);
	$( "#textTranslate2Y" ).val(objTranslate2Y);
	$( "#textTranslate2Z" ).val(objTranslate2Z / 10);
	$( "#textRotate2X" ).val( objRotate2X );
	$( "#textRotate2Y" ).val( objRotate2Y );
	$( "#textRotate2Z" ).val( objRotate2Z );
	
	$( "#sliderScale2X" ).slider("value", objScale2X);
	$( "#sliderScale2Y" ).slider("value", objScale2Y);
	$( "#sliderScale2Z" ).slider("value", objScale2Z);
	$( "#sliderTranslate2X" ).slider("value", objTranslate2X);
	$( "#sliderTranslate2Y" ).slider("value", objTranslate2Y);
	$( "#sliderTranslate2Z" ).slider("value", objTranslate2Z);
	$( "#sliderRotate2X" ).slider("value", objRotate2X);
	$( "#sliderRotate2Y" ).slider("value", objRotate2Y);
	$( "#sliderRotate2Z" ).slider("value", objRotate2Z);
}

function selectedTransform() {
	if ($("input[type=radio][name=radioSelectObject]").length) {
		var selection = parseInt( $("input[name='radioSelectObject']:checked").val() );
		var px = objTranslate2X;
		var py = objTranslate2Y;
		var pz = objTranslate2Z;
		var p = vec3(px, py, pz);
		arObjects[selection].translateXYZ = p;  
		arObjects[selection].scaleX = objScale2X;
		arObjects[selection].scaleY = objScale2Y;
		arObjects[selection].scaleZ = objScale2Z;
		arObjects[selection].rotateX = objRotate2X;
		arObjects[selection].rotateY = objRotate2Y;
		arObjects[selection].rotateZ = objRotate2Z;
		arObjects[selection].color = editColor;
		listObjects(selection);
		render();
	}
}

function isNotEmpty() {
	return (arObjects.length > 0);
}

var uniqueID = "webglcourseraflyingdisc2015";
function save2Json() {
	if (arObjects.length <= 0) return;
	var data = [], obj, objJson; 
	for (var i=0; i < arObjects.length; i++) {
		obj = arObjects[i];
		objJson = {
			"scale": { 	
				"x": obj.scaleX,
				"y": obj.scaleY, 
				"z": obj.scaleZ 
			},
			"translate": {
				"x": obj.translateXYZ[0], 
				"y": obj.translateXYZ[1], 
				"z": obj.translateXYZ[2]
			},
			"rotate": {
				"x": obj.rotateX, 
				"y": obj.rotateY, 
				"z": obj.rotateZ
			},
			"type": obj.type,
			"color": obj.color
		};
		
		data.push(objJson);
	}
	var textJson = $.toJSON({"id": uniqueID,
	                         "data": data});
	//alert(textJson);
	var url = 'data:text/json;charset=utf8,' + encodeURIComponent(textJson);
	window.open(url, '_blank');
	window.focus();
}

function loadFromJson(event) {
	var files = event.target.files;
	//var fname = escape(files[0].name);
	var reader = new FileReader();
	reader.onload = function(evt) {
		//if (evt.target.readyState == FileReader.DONE) { // DONE == 2
			var dataJson = "";
			try {
				dataJson = $.evalJSON( evt.target.result );
			}
			catch (e) {}
			$("#loadJson").val("");
			//$("#control").replaceWith( control = control.clone( true ) );
			if ((dataJson == "") || (dataJson.id != uniqueID)) {
				alert("Incompatible JSON format.");
				return;
			}
			
			var res = confirm("Are you sure to replace existing canvas with uploaded new objects?\nAll existing objects will be discarded!");
			if (res) {
				dataJson = dataJson.data;
				arObjects = [];
				for (var i=0; i < dataJson.length; i++) {
					var obj = {};
					obj.translateXYZ = [dataJson[i].translate.x, 
					         dataJson[i].translate.y, 
							 dataJson[i].translate.z];  
					obj.scaleX = dataJson[i].scale.x;
					obj.scaleY = dataJson[i].scale.y;
					obj.scaleZ = dataJson[i].scale.z;
					obj.rotateX = dataJson[i].rotate.x;
					obj.rotateY = dataJson[i].rotate.y;
					obj.rotateZ = dataJson[i].rotate.z;
					var program = newShader();
					obj.program = program;
					obj.type = dataJson[i].type;
					obj.color = dataJson[i].color;
					arObjects.push(obj);
				}
				listObjects(0);
				render();
			}
		//}
	};
	reader.readAsText(files[0]);
}
/*
// Check for the various File API support.
if (window.File && window.FileReader && window.FileList && window.Blob) {
  alert(" Great success! All the File APIs are supported. ");
} else {
  alert('The File APIs are not fully supported in this browser.');
}
*/