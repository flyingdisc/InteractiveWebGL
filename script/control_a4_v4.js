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
//var object3D = 0;
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

var MINSHININESS = 5;
var MAXSHININESS = 120;
var STEPSHININESS = 5;

var lightPosition = vec4(4.0, -3.0, 10.0, 1.0 );
var lightAmbient = vec4(0.2, 0.2, 0.2, 1.0 );
var lightDiffuse = vec4( 1.0, 1.0, 1.0, 1.0 );
var lightSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );

var lightPosition2 = vec4(-4.0, 3.0, 10.0, 1.0 );
var lightAmbient2 = vec4(0.3, 0.1, 1.0, 1.0 );
var lightDiffuse2 = vec4( 0.8, 0.6, 0.3, 1.0 );
var lightSpecular2 = vec4( 1.0, 1.0, 0.0, 1.0 );

var materialAmbient = vec4( 1.0, 0.0, 0.0, 1.0 );
var materialDiffuse = vec4( 1.0, 0.8, 0.0, 1.0 );
var materialSpecular = vec4( 0.8, 0.8, 0.8, 1.0 );
var materialShininess = 80.0;

var movingLight = 0;  // which is on, both|1|2
var stopMoving = false;
var surface = 1;
isDiffuseGlobal = true;
var isAttenuate = false;
var activeTab = 0;

// JQuery initialization 
$(function() {
  $( document ).tooltip({
	position: {
	  //my: "center bottom-10",
	  //at: "center bottom"
	}
  });
  $( "#tabs1" ).tabs({
	heightStyle: "content",
	activate: function(event, ui){
        activeTab = parseInt(ui.newTab.index());
        // $("#other-tabs").tabs("option", "active", ui.newTab.index());                   
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
		//render();
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
		//render();
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
		//render();
    }
  });
  $( "#sliderCameraZ .ui-slider-handle" ).text("z");*/
  $( "#sliderShininess" ).slider({
    value: materialShininess,
    min: MINSHININESS,
    max: MAXSHININESS,
    step: STEPSHININESS,
    slide: function( event, ui ) {
        $( "#textShininess" ).val( ui.value );
	    materialShininess = parseInt(ui.value);
		//$(this).find(".ui-slider-handle").text(ui.value);
		isRender();
    }
  });
  $( ".buttonMin" ).button({
	icons: { primary: "ui-icon-triangle-1-w" }, text: false
  });
  $( ".buttonPlus" ).button({
	icons: { primary: "ui-icon-triangle-1-e" },	text: false
  });
  $( "#radioMovingLight" ).buttonset();	
  $( "#radioSurface" ).buttonset();	
  $( "#spinnerPosMovingLightZ1" ).spinner({
	min: -20,
	max: 120,
	page: 10,
	step: 5,
    spin: function(event, ui) {
		lightPosition[2] = parseInt(ui.value);
		isRender();
	}
  });
  $( "#spinnerPosMovingLightZ2" ).spinner({
	min: -20,
	max: 120,
	page: 10,
	step: 5,
    spin: function(event, ui) {
		lightPosition2[2] = parseInt(ui.value);
		isRender();
	}
  });
  $( "#animPlayPause" ).button({
	icons: { primary: "ui-icon-pause" }, text: true
  }).click(function( event ) {
	if (stopMoving) {
		$( "#animPlayPause" ).button("option", "icons", { primary: "ui-icon-pause" })
		stopMoving = false;
		render();
	}
	else {
		$( "#animPlayPause" ).button("option", "icons", { primary: "ui-icon-play" })
		stopMoving = true;
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
  $( "#deleteObject" ).button({
    icons: { primary: "ui-icon-trash" }
  }).click(function( event ) {
	deleteSelectedObject();
  });
  $("#btnObjColor").spectrum({
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
  $("#btnAmbientColor").spectrum({
    change: function(color) {
	  lightAmbient = getColor(color.toHexString());
	  isRender();
  }});
  $("#btnDiffuseColor").spectrum({
    change: function(color) {
	  lightDiffuse = getColor(color.toHexString());
	  isRender();
  }});
  $("#btnSpecularColor").spectrum({
    change: function(color) {
	  lightSpecular = getColor(color.toHexString());
	  isRender();
  }});
  $("#btnAmbientColor2").spectrum({
    change: function(color) {
	  lightAmbient2 = getColor(color.toHexString());
	  isRender();
  }});
  $("#btnDiffuseColor2").spectrum({
    change: function(color) {
	  lightDiffuse2 = getColor(color.toHexString());
	  isRender();
  }});
  $("#btnSpecularColor2").spectrum({
    change: function(color) {
	  lightSpecular2 = getColor(color.toHexString());
	  isRender();
  }});
  $("#btnMatAmbientColor").spectrum({
    change: function(color) {
	  materialAmbient = getColor(color.toHexString());
	  isRender();
  }});
  $("#btnMatDiffuseColor").spectrum({
    change: function(color) {
	  materialDiffuse = getColor(color.toHexString());
	  isRender();
  }});
  $("#btnMatSpecularColor").spectrum({
    change: function(color) {
	  materialSpecular = getColor(color.toHexString());
	  isRender();
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
  $( "#textShininess" ).val( materialShininess );
  $("#btnObjColor").spectrum("set", rgb2hex(objColor));
  $("#btnAmbientColor").spectrum("set", rgb2hex(lightAmbient));
  $("#btnDiffuseColor").spectrum("set", rgb2hex(lightDiffuse));
  $("#btnSpecularColor").spectrum("set", rgb2hex(lightSpecular));
  $("#btnAmbientColor2").spectrum("set", rgb2hex(lightAmbient2));
  $("#btnDiffuseColor2").spectrum("set", rgb2hex(lightDiffuse2));
  $("#btnSpecularColor2").spectrum("set", rgb2hex(lightSpecular2));
  $("#btnMatAmbientColor").spectrum("set", rgb2hex(materialAmbient));
  $("#btnMatDiffuseColor").spectrum("set", rgb2hex(materialDiffuse));
  $("#btnMatSpecularColor").spectrum("set", rgb2hex(materialSpecular));
  
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
		$( "#textTranslate2X" ).val(objTranslate2X);
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
		$( "#textTranslate2Y" ).val(objTranslate2Y);
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
		//render();
	}
  });
  $( "#btnPlusCX" ).click(function() {
	if (objCameraX < MAXCAMERA) {
		objCameraX += STEPCAMERA;
		$( "#sliderCameraX" ).slider("value", objCameraX);
		$( "#textCameraX" ).val( objCameraX );
		//render();
	}
  });
  $( "#btnMinCY" ).click(function() {
	if (objCameraY > MINCAMERA) {
		objCameraY -= STEPCAMERA;
		$( "#sliderCameraY" ).slider("value", objCameraY);
		$( "#textCameraY" ).val( objCameraY );
		//render();
	}
  });
  $( "#btnPlusCY" ).click(function() {
	if (objCameraY < MAXCAMERA) {
		objCameraY += STEPCAMERA;
		$( "#sliderCameraY" ).slider("value", objCameraY);
		$( "#textCameraY" ).val( objCameraY );
		//render();
	}
  });
  $( "#btnMinCZ" ).click(function() {
	if (objCameraZ > MINCAMERA) {
		objCameraZ -= STEPCAMERA;
		$( "#sliderCameraZ" ).slider("value", objCameraZ);
		$( "#textCameraZ" ).val( objCameraZ );
		//render();
	}
  });
  $( "#btnPlusCZ" ).click(function() {
	if (objCameraZ < MAXCAMERA) {
		objCameraZ += STEPCAMERA;
		$( "#sliderCameraZ" ).slider("value", objCameraZ);
		$( "#textCameraZ" ).val( objCameraZ );
		//render();
	}
  });*/
  $( "#btnUndo" ).button().click(function( event ) {
	var last = arObjects.length-1;
	if (last >= 0) {
	  arObjects.splice(last, 1);  // remove
	  listObjects(0);
	  render();
	}
  });
  $( "#radioMovingLight" ).change(function() {
	movingLight = parseInt( $( "input[name='radioMovingLight']:checked" ).val() );
	isRender();
  });
  $( "#radioSurface" ).change(function() {
	surface = parseInt( $( "input[name='radioSurface']:checked" ).val() );
	isRender();
  });
  $( "#checkDiffuseGlobal" ).change(function() {
	if ($(this).is(":checked")) {
	  isDiffuseGlobal = true;
	}
	else {
	  isDiffuseGlobal = false;
	}
	isRender();
  });
  $( "#checkAttenuate" ).change(function() {
	if ($(this).is(":checked")) {
	  isAttenuate = true;
	}
	else {
	  isAttenuate = false;
	}
	isRender();
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
		//console.log(arObjects[i]);
		clr = rgb2hex(arObjects[i].color);
		s += "<td class='cellbox'><span style='background-color:" + clr + ";'>&nbsp;&nbsp;&nbsp;&nbsp;</span></td>";
		x = arObjects[i].translateXYZ[0];
		y = arObjects[i].translateXYZ[1];
		z = (-arObjects[i].translateXYZ[2] / 10).toFixed(1);
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
		isRender();
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
	objTranslate2Z = -obj.translateXYZ[2];
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
		var pz = -objTranslate2Z;
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
		isRender();
	}
}

function isRender() {
	if (stopMoving) {
		render();
	}
}

function isNotEmpty() {
	return (arObjects.length > 0);
}

// modified from gl-matrix.js, see copyright statement at the bottom
function inverseMat3(a) {
	var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
		a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
		a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
		a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15],

		b00 = a00 * a11 - a01 * a10,
		b01 = a00 * a12 - a02 * a10,
		b02 = a00 * a13 - a03 * a10,
		b03 = a01 * a12 - a02 * a11,
		b04 = a01 * a13 - a03 * a11,
		b05 = a02 * a13 - a03 * a12,
		b06 = a20 * a31 - a21 * a30,
		b07 = a20 * a32 - a22 * a30,
		b08 = a20 * a33 - a23 * a30,
		b09 = a21 * a32 - a22 * a31,
		b10 = a21 * a33 - a23 * a31,
		b11 = a22 * a33 - a23 * a32,

		// Calculate the determinant
		det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

	if (!det) { 
		return null; 
	}
	det = 1.0 / det;

	var out = mat3();
	out[0][0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
	out[1][1] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
	out[2][2] = (a10 * b10 - a11 * b08 + a13 * b06) * det;

	out[1][0] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
	out[1][1] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
	out[1][2] = (a01 * b08 - a00 * b10 - a03 * b06) * det;

	out[2][0] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
	out[2][1] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
	out[2][2] = (a30 * b04 - a31 * b02 + a33 * b00) * det;

	return out;
};
// copyright statement for the inverseMat3(), adapted from gl-matrix.js
/**
 * @fileoverview gl-matrix - High performance matrix and vector operations
 * @author Brandon Jones
 * @author Colin MacKenzie IV
 * @version 2.3.1
 */
/* Copyright (c) 2015, Brandon Jones, Colin MacKenzie IV.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE. */
