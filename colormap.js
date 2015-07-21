var colorhex = "FF0000";
function mouseOverColor(hex) {
    document.getElementById("divpreview").style.visibility = "visible";
    document.getElementById("divpreview").style.backgroundColor = hex;
    document.body.style.cursor = "pointer";
}
function mouseOutMap() {
    if (hh == 0) {
        document.getElementById("divpreview").style.visibility = "hidden";
    } else {
      hh = 0;
    }
    document.getElementById("divpreview").style.backgroundColor = "#" + colorhex;
    document.body.style.cursor = "";
}
var hh = 0;
function clickColor(hex, seltop, selleft, html5) {
    hh = 1;
    var colorrgb, colornam = "", xhttp, c, r, g, b, i;
    if (html5 && html5 == 5)	{
        c = document.getElementById("html5colorpicker").value;
    } else {
        if (hex == 0)	{
            c = document.getElementById("entercolor").value;
        } else {
	        c = hex;
        }
    }
    if (c.substr(0,1) == "#")	{
        c = c.substr(1);
    }
    c = c.replace(/;/g, "");
    if (c.indexOf(",") > -1 || c.toLowerCase().indexOf("rgb") > -1 || c.indexOf("(") > -1) {
        c = c.replace(/rgb/i, "");
        c = c.replace("(", "");
        c = c.replace(")", "");
        c = rgbToHex(c);
    }
    colorhex = c;
    if (colorhex.length == 3) {colorhex = colorhex.substr(0,1) + colorhex.substr(0,1) + colorhex.substr(1,1) + colorhex.substr(1,1) + colorhex.substr(2,1) + colorhex.substr(2,1); }
    colorhex = colorhex.substr(0,6);
    for (i = 0; i < hexArr.length; i++) {
        if (c.toLowerCase() == hexArr[i].toLowerCase()) {
            colornam = namArr[i];
            break;
        }
        if (c.toLowerCase() == namArr[i].toLowerCase()) {
            colorhex = hexArr[i];
            colornam = namArr[i];            
            break;
        }
        if (c == rgbArr[i]) {
            colorhex = hexArr[i];
            colornam = namArr[i];            
            break;
        }
    }
    colorhex = colorhex.substr(0,10);
    colorhex = colorhex.toUpperCase();
    r = HexToR(colorhex);
    g = HexToG(colorhex);
    b = HexToB(colorhex);
    document.getElementById("colorhexDIV").innerHTML = "hex #" + colorhex;
    document.getElementById("colorrgbDIV").innerHTML = "rgb(" + r + ", " + g + ", " + b + ")";
    if ((seltop+199)>-1 && selleft>-1) {
        document.getElementById("selectedhexagon").style.top=seltop + "px";
        document.getElementById("selectedhexagon").style.left=selleft + "px";
        document.getElementById("selectedhexagon").style.visibility="visible";
	} else {
        document.getElementById("divpreview").style.backgroundColor = "#" + colorhex;
        document.getElementById("selectedhexagon").style.visibility = "hidden";
	}
    document.getElementById("selectedcolor").style.backgroundColor = "#" + colorhex;
}
function wrongInput() {
    $("#entercolorDIV").addClass("has-error");
}
function clearWrongInput() {
    $("#entercolorDIV").removeClass("has-error");
}
var hexArr = [];
var rgbArr = [];
var namArr = []; 
function checkColorValue() {
    var colorfile, colors = [], i, cc;
    if (window.XMLHttpRequest) {
        xhttp = new XMLHttpRequest();
    } else {
        xhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xhttp.open("GET", "color_name.txt?r=" + Math.random(), true);
    xhttp.send("");
    xhttp.onreadystatechange = function() {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
		    colorfile = xhttp.responseText;
		    colorfile = colorfile.replace(/        /g, " ");            
		    colorfile = colorfile.replace(/       /g, " ");        
		    colorfile = colorfile.replace(/      /g, " ");
		    colorfile = colorfile.replace(/     /g, " ");
		    colorfile = colorfile.replace(/    /g, " ");
		    colorfile = colorfile.replace(/   /g, " ");
		    colorfile = colorfile.replace(/  /g, " ");
		    colorfile = colorfile.replace(/\s*?[\r\n\t]\s*/g, " ");    
		    colors = colorfile.split(" ");
		    cc = "hex";
		    for (i = 0; i < colors.length; i++) {
		        if (cc == "hex") {
		            hexArr.push(colors[i]);
		            cc = "rgb";
		            continue;
		        }
		        if (cc == "rgb") {
		            rgbArr.push(colors[i]);
		            cc = "nam";
		            continue;            
		        }
		        if (cc == "nam") {
		            namArr.push(colors[i]);
		            cc = "hex";
		            continue;            
		        }
		    }
			if ("FF0000" == "FF0000") {
			    clickColor("FF0000", -34, 135);
			} else {
			    clickColor("FF0000", -1, -1);
			}
        }
    }
}
function HexToR(h) {return parseInt((cutHex(h)).substring(0,2),16)}
function HexToG(h) {return parseInt((cutHex(h)).substring(2,4),16)}
function HexToB(h) {return parseInt((cutHex(h)).substring(4,6),16)}
function cutHex(h) {return (h.charAt(0)=="#") ? h.substring(1,7):h}

function ToHex(x) {
    var hex = x.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}
function rgbToHex(rgb) {
    var x = rgb.replace(/ /g, "");
    var a = x.split(",");
    var r = Number(a[0]);
    var g = Number(a[1]);
    var b = Number(a[2]);
    if (isNaN(r) || isNaN(g) || isNaN(b) || r < 0 || r > 255 || g < 0 || g > 255 || b < 0 || b > 255) {return -1;}
    return ToHex(r) + ToHex(g) + ToHex(b);
}
$(document).ready(function(){
    var x = document.createElement("input");
    x.setAttribute("type", "color");
    if (x.type == "text") {
        document.getElementById("html5DIV").style.visibility = "hidden";
    }
}); 

