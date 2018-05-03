/*
	miniVewer 0.1
	
	Saint Pierre Thomas
	spierro@free.fr
	LICENSE : libre
*/
'use strict';

////////////////////////////////////////////////////////////////////////////////
//	Maths funcions
////////////////////////////////////////////////////////////////////////////////

function Vector(o, s, n) {
	this.o = o;
	this.s = s;
	this.n = n;
}
function vectfromvertices(a, b) {
	var n = Math.sqrt((b[0] - a[0]) * (b[0] - a[0]) + (b[1] - a[1]) * (b[1] - a[1]) + (b[2] - a[2]) * (b[2] - a[2]));
	var s = [(b[0] - a[0]) / n, (b[1] - a[1]) / n, (b[2] - a[2]) / n];
	var vect = new Vector(a, s, n);
	return vect;
}
window['vectfromvertices'] = vectfromvertices;
window['Vector'] = Vector;

function logVector(vect) {
	console.log('origine: ' + vect.o + ' sens: ' + vect.s + ' norme: ' + vect.n);
}
window['logVector'] = logVector;

function magnitudevertex(a) {
	return Math.sqrt(a[0] * a[0] + a[1] * a[1] + a[2] * a[2]);
}
window['magnitudevertex'] = magnitudevertex;
function normalisevertex(q) {
	var v = [0, 0, 0];
	var norme = magnitudevertex(q);
	v[0] = q[0] / norme;
	v[1] = q[1] / norme;
	v[2] = q[2] / norme;
	return v;
}
window['normalisevertex'] = normalisevertex;

function vectorproduct(a, b) {
	var c = [a[1] * b[2] - a[2] * b[1],
		a[2] * b[0] - a[0] * b[2],
		a[0] * b[1] - a[1] * b[0]
	];
	return c;
}
window['vectorproduct'] = vectorproduct;

function scalarproduct (a, b)
{

	var c = a[0] * b[0] + a[1] * b[1] + a[2] * b[2] ;
	return c;

}
window['scalarproduct'] = scalarproduct;

function multiplymatrix(m1, m2) {
	var m = [];
	m.length = 16;
	var a, b, c;
	for (b = 0; b < 4; b++)
		for (a = 0; a < 4; a++) {
			m[a + b * 4] = 0;
			for (c = 0; c < 4; c++) m[a + b * 4] += m1[c + b * 4] * m2[a + c * 4];
		}
	return m;
}
window['multiplymatrix'] = multiplymatrix;

function applypersp(v) {
	//var v1 = $.extend(true, [], v);
	v1[0] = v[0] * (viewangle / v[2]);
	v1[1] = v[1] * (viewangle / v[2]);
	v1[2] = v[2];
	return v1;
}
window['applypersp'] = applypersp;

function applymat(m, v) {
	var v1 = $.extend(true, [], v);
	v1[0] = m[0] * v[0] + m[1] * v[1] + m[2] * v[2] + m[3];
	v1[1] = m[4] * v[0] + m[5] * v[1] + m[6] * v[2] + m[7];
	v1[2] = m[8] * v[0] + m[9] * v[1] + m[10] * v[2] + m[11];
	return v1;
}
window['applymat'] = applymat;
function applymatNpersp(m, v) {
	var v1 = [];
	v1.lenth = 3;
	v1[2] = m[8] * v[0] + m[9] * v[1] + m[10] * v[2] + m[11];
	v1[0] = (m[0] * v[0] + m[1] * v[1] + m[2] * v[2] + m[3]) * (viewangle / v1[2]);
	v1[1] = (m[4] * v[0] + m[5] * v[1] + m[6] * v[2] + m[7]) * (viewangle / v1[2]);
	return v1;
}
window['applymatNpersp'] = applymatNpersp;

function genimat() {
	var m = [];
	m.length = 16;
	var a, b;
	for (a = 0; a < 4; a++)
		for (b = 0; b < 4; b++) {
			if (a == b) m[a + b * 4] = 1;
			else m[a + b * 4] = 0;
		}
	return m;
}
window['genimat'] = genimat;

function gentmat(x, y, z) {
	var m = genimat();
	m[3] = x;
	m[7] = y;
	m[11] = z;
	return m;
}
window['gentmat'] = gentmat;

function genrmat(x, y, z) {
	var xd = x * (Math.PI / 180);
	var yd = y * (Math.PI / 180);
	var zd = z * (Math.PI / 180);
	var m = genimat();
	var A = Math.cos(xd);
	var B = Math.sin(xd);
	var C = Math.cos(yd);
	var D = Math.sin(yd);
	var E = Math.cos(zd);
	var F = Math.sin(zd);
	var AD = A * D;
	var BD = B * D;
	m[0] = C * E;
	m[1] = -C * F;
	m[2] = -D;
	m[4] = -BD * E + A * F;
	m[5] = BD * F + A * E;
	m[6] = -B * C;
	m[8] = AD * E + B * F;
	m[9] = -AD * F + B * E;
	m[10] = A * C;
	m[3] = m[7] = m[11] = m[12] = m[13] = m[14] = 0;
	m[15] = 1;
	return m;
}
window['genrmat'] = genrmat;


////////////////////////////////////////////////////////////////////////////////
//	miniView core functions
////////////////////////////////////////////////////////////////////////////////

var buffer = {};
var envwvft = {};
var envbuffer = {};

var zoom = 1000;
var viewangle = 140;
var ZlockANGx = 190;
var ZlockANGy = 230;
var ZlockANGz = 0;
var fmat = genimat();
var rmat = genimat();
var tmat = genimat();
var pmat = genimat();
var yAMAX = 160;
var yAMIN = 70;


function initViewZlock(x, y, z, zm)
{
	zoom = zm;
	pmat = gentmat(0, 0, 0);
	tmat = gentmat(0, 0, zoom);
	ZlockANGx = x;
	ZlockANGy = y;
	ZlockANGz = z;
	rmat = genrmat( x, y, z);
	genfmat();
}
window['initViewZlock'] = initViewZlock;
function rotateViewZlock(x, y)
{
	ZlockANGy -= y;
	ZlockANGx += x;
	if ( ZlockANGx < 180 ) ZlockANGx = 180;
	if ( ZlockANGx > 190 ) ZlockANGx = 190;
	if ( ZlockANGy < yAMIN ) ZlockANGy = yAMIN;
	if ( ZlockANGy > yAMAX ) ZlockANGy = yAMAX;
//	console.log ('ZlockANGy '+ZlockANGy);
	rmat = genrmat( ZlockANGx, ZlockANGy, ZlockANGz);
}
window['rotateViewZlock'] = rotateViewZlock;
function translateView(x, y, z)
{
	var tmp = gentmat( x, y, z);
	tmat = multiplymatrix (tmp, tmat);
}
window['translateView'] = translateView;
function genfmat() {
	var mat = multiplymatrix(rmat, pmat);
	fmat = multiplymatrix(tmat, mat);
}
window['genfmat'] = genfmat;
function drawenv(container) {
	for (var i = 0; i < envwvft.vertices.length; i++)
		envbuffer.vertices[i] = applymatNpersp(fmat, envwvft.vertices[i]);
	for (var i = 0; i < envwvft.triangles.length; i++)
		envbuffer.triangles[i].n = applymat(rmat, envwvft.triangles[i].n);

	for (var j = 0; j < envwvft.triangles.length ; j++)
	{
		var n = envbuffer.triangles[ j ].n[2];
		if (n>-0.5)
		{
			var svg = document.createElementNS("http://www.w3.org/2000/svg",'polygon');
			envbuffer.triangles[ j ].trigon = '';
			for ( var k = 0 ; k < envwvft.triangles[j].length ; k++)
				envbuffer.triangles[ j ].trigon += ' '+envbuffer.vertices[envwvft.triangles[j][k]-1][0]+','+envbuffer.vertices[envwvft.triangles[j][k]-1 ][1];
			svg.setAttribute('points',envbuffer.triangles[j].trigon);
			svg.setAttribute('class', envwvft.triangles[j].mat);
			svg.setAttribute('class', envbuffer.triangles[ j ].mat);
			container.appendChild(svg);
		}
	}
}
window['drawenv'] = drawenv;
function drawScene(container) {  //optimised speed ( cut in lightening acuracy )

  	container.innerHTML = "";
	$("#arp").attr('transform', 'translate('+(273.44049+ZlockANGy*2)+',-'+(ZlockANGx-50)+')');
	drawenv(container);
	var mat = multiplymatrix(rmat, pmat);
	fmat = multiplymatrix(tmat, mat);
	genItemszmap(miniView.Items);
	for ( var v = 0 ; v < miniView.Items.zmap.length ; v++ )
	{
		var tmpWvft = miniView.Items[miniView.Items.zmap[v][0]].w;
		buffer = $.extend(true, {}, tmpWvft);
		for (var i = 0; i < tmpWvft.vertices.length; i++)
			buffer.vertices[i] = applymatNpersp(fmat, tmpWvft.vertices[i]);
		for (var i = 0; i < tmpWvft.triangles.length; i++)
			buffer.triangles[i].n = applymat(rmat, tmpWvft.triangles[i].n);
		genzmap(buffer);
		for (var i = 0; i < buffer.zmap.length ; i++)
		{
			var j = buffer.zmap[i][0];
			var svg = document.createElementNS("http://www.w3.org/2000/svg",'polygon');
			buffer.triangles[ j ].trigon = buffer.vertices[tmpWvft.triangles[j][0]-1][0]+','+buffer.vertices[tmpWvft.triangles[j][0]-1 ][1];
			for ( var k = 1 ; k < tmpWvft.triangles[j].length ; k++)
				buffer.triangles[ j ].trigon += ' '+buffer.vertices[tmpWvft.triangles[j][k]-1][0]+','+buffer.vertices[tmpWvft.triangles[j][k]-1 ][1];
			svg.setAttribute('points',buffer.triangles[j].trigon);
			svg.setAttribute('class', tmpWvft.triangles[j].mat);
			container.appendChild(svg);
		}
	}
}
window['drawScene'] = drawScene;

function parsewavefront(objText, id) {

	var nv = 0;
	var nt = 0;
	var ng = 0;
	var obj = {};
	var vertexMatches = objText.match(/^v( -?\d+(\.\d+)?){3}$/gm);
//	var triMatches = objText.match(/^f( \d+){3}$/gm);
	var triMatches = objText.match(/^f( \d+){3,4}$/gm);
	var gMatches = objText.match(/^f( \d+){3,4}$|^usemtl (.+)$/gm);

	var positionMatches = objText.match(/^position( -?\d+(\.\d+)?){3}$/gm);
	
	if (vertexMatches) {
		obj.vertices = vertexMatches.map(function(vertex) {
			nv++;
			var vertices = vertex.split(" ");
			vertices.shift();
			var v = Float32Array.from(vertices);
			return v;

		});
	}
	if (positionMatches) {

		console.log (positionMatches );
	}

	if (triMatches) {
		obj.triangles = triMatches.map(function(tri) {
			nt++;
			var triangles = tri.split(" ");
			triangles.shift();
			return triangles;
		});
	}

	var mat = 'mat';
	if (gMatches) {
		gMatches.map(function(g) {
			var inc = true;
			var gMatch = g.split(" ");
			if (gMatch[0] === 'usemtl')
			{
				gMatch.shift();
				inc = false;
				mat = gMatch[0];
			} else if (gMatch[0] === 'f')
			{	
				obj.triangles[ng].mat = mat;
				ng++;
			}
		});
	}
	for (var i = 0 ; i < obj.triangles.length ; i++ )
		obj.triangles[i].id  = id;
	obj.nv = nv;
	obj.nt = nt;
	obj.ng = ng;
	return obj;
}
window['parsewavefront'] = parsewavefront;
function loadWavefrontFromHTLM(object, id) {
	
	var contents = $(object).text();
	var obj = parsewavefront(contents, id);
	genNormales(obj);			
	genzmap(obj);
	return obj;
}
window['loadWavefrontFromHTLM'] = loadWavefrontFromHTLM;
function genzmap(obj) {
	var tmp = new Array();

	for (var i = 0; i < obj.triangles.length; i++) {
		
		var somme = 0;
		for (var l = 0; l < obj.triangles[i].length ; l++ )
			somme += obj.vertices[obj.triangles[i][l] - 1][2];
		somme = somme/obj.triangles[i].length;
		var n = obj.triangles[ i ].n[2];
		if ( somme > 200 && n > -0.3 )
		{
			var tmp2 = new Array(i, somme);
			tmp.push(tmp2);
		}
	}
//	console.log('#? '+obj.triangles.length+' - '+tmp.length);
	obj.zmap = tmp;
	obj.zmap.sort(function(a, b) {
		return b[1] - a[1];
	});
}
window['genzmap'] = genzmap;
function genItemszmap(pcs) {
	if ( typeof genItemszmap.init == 'undefined' ) {
		genItemszmap.init = true;
		
		
	}
	var tmp = new Array();

	for (var i = 0; i < miniView.Items.length; i++)
		buffer.vertices[i] = applymat(fmat, miniView.Items[i].w.vertices[0]);

	for (var i = 0; i < miniView.Items.length; i++) {
		var tmp2 = new Array(i, buffer.vertices[i][2]);
		tmp.push(tmp2);
	}
	pcs.zmap = tmp;
	pcs.zmap.sort(function(a, b) {
		return b[1] - a[1];
	});
}
window['genItemszmap'] = genItemszmap;

function setWavefrontId(w, id) {

	for ( var j = 0 ; j < w.nt  ; j++)
		w.triangles[ j ].id = id;
}
window['setWavefrontId'] = setWavefrontId;


function genNormales(obj) {
	for (var i = 0; i < obj.nt; i += 1) {
		obj.triangles[i].n = normalisevertex(vectorproduct(vectfromvertices(obj.vertices[obj.triangles[i][0] - 1], obj.vertices[obj.triangles[i][2] - 1]).s, vectfromvertices(obj.vertices[obj.triangles[i][0] - 1], obj.vertices[obj.triangles[i][1] - 1]).s));
	}
}
window['genNormales'] = genNormales;

function translateWavefront (wavefront, x, y, z)
{

	for ( var i = 0 ; i < wavefront.vertices.length ; i ++ )
	{

		wavefront.vertices[i][0] =  parseFloat(wavefront.vertices[i][0])+x;
		wavefront.vertices[i][1] =  parseFloat(wavefront.vertices[i][1])+y;
		wavefront.vertices[i][2] =  parseFloat(wavefront.vertices[i][2])+z;

	}	
}
window['translateWavefront'] = translateWavefront;

function rotateWavefront (wavefront, x, y, z)
{
	var tmpmat = genrmat(x, y, z);
	var tmp = wavefront;
	for (var i = 0; i < wavefront.vertices.length; i++)
		wavefront.vertices[i] = applymat(tmpmat, wavefront.vertices[i]);
	genNormales(wavefront); 

}
window['rotateWavefront'] = rotateWavefront;


function miniView () {
}
window['rotateWavefront'] = rotateWavefront;
function initScene()
{
	
	var minA = 150;
	var maxA = 195;
	
	var minR = 1;
	var maxR = 5;
	
	
	var w = $(window).width();
	var h = /*$(window).height()-$('#services').height()-140;
	if ( h < $(window).height()/3 ) h =*/ $(window).height()/2.3;
	var zoom = 30;
	var ratio = w/h;
	var initAng = 165;
	
	// star t view with logo cetered under header title
	yAMAX = 200-10*ratio;
	
	console.log ('min max - '+yAMIN+' '+yAMAX);
	initViewZlock(182, yAMAX, 0, 1000);
	$('#svg8').attr('width', w);
	$('#svg8').attr('height', h);
	$("#svg8").attr('viewBox', '-'+((zoom*ratio)/2)+' -'+(zoom/2)+' '+(zoom*ratio)+' '+zoom);
}
window['initScene'] = initScene;
function buildScene()
{
	var Logo = {};
	var TMPwvft = {};
	Logo = $.extend(true, {}, loadWavefrontFromHTLM('#logo', 'logo'));
	miniView.Items.splice (0,miniView.Items.length );
	var tmpWvft2 = {};
	
	var vpos = [0, 0, 0];
	var u = 0;
	var v = 0;
	var square = 'a0';
	tmpWvft2 = $.extend(true, {}, Logo);
	var altItem = {id: miniView.Items.length, pos: vpos,  x: u, y: v, index: 0, w: {}};
	setWavefrontId(tmpWvft2, miniView.Items.length);			
	altItem.w = $.extend(true, {},tmpWvft2 );
	miniView.Items.push(altItem);
}
window['buildScene'] = buildScene;

(function($) {
  "use strict"; // Start of use strict

	// Smooth scrolling using jQuery easing
	$('a.js-scroll-trigger[href*="#"]:not([href="#"])').click(function() {
		if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
			var target = $(this.hash);
			target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
			if (target.length) {
				$('html, body').animate({
					scrollTop: (target.offset().top - 54)
				}, 1000, "easeInOutExpo");
				return false;
			}
		}
	});

	// Closes responsive menu when a scroll trigger link is clicked
	$('.js-scroll-trigger').click(function() {
		$('.navbar-collapse').collapse('hide');
	});
	// Activate scrollspy to add active class to navbar items on scroll
	$('body').scrollspy({
		target: '#mainNav',
		offset: 54
	});

})(jQuery); // End of use strict
function miniView () {
		

	var mode = (eval("var __temp = null"), (typeof __temp === "undefined")) ? 
	    "strict": 
	    "non-strict";
	    console.log('interprete js : '+mode);

	/*======================================================================
	
		Initialisations
		
	----------------------------------------------------------------------*/

	envwvft = $.extend(true, {}, loadWavefrontFromHTLM('#site-sol', 'site-sol'));
	envbuffer = $.extend(true, {},envwvft);
	buffer = $.extend(true, {}, envwvft);

	var container = document.getElementById("renderbox");
	if ( typeof miniView.init == 'undefined' ) {
		miniView.init = true;
		miniView.Items = [];
		buildScene ();
		initScene();	
		drawScene(container);
	}

	// configuration hammerJS

	var myElement = document.getElementById('svg8');
	var mc = new Hammer(myElement);
	mc.get('pan').set({
		direction: Hammer.DIRECTION_ALL
	});
	
	// Évenements fenetre
		
	$(window).on('resize', function() {

		initScene();
		drawScene(container);
	});
	
	// interactions vue
	mc.on("pan", function(ev) {
		if (miniView.view != 'mobile') {
			rotateViewZlock(ev.velocityY * 15, ev.velocityX * 15, 0);

			drawScene(container);
		}
		else {
			window.scrollBy(0,-ev.velocityY*20);
		}
	});
	$('.test').on('mousedown', function() {
		console.log('test down');
	});
/*	$('#paperseed-tgl').on('click', function() {
	$('#paperseed').css( 'display', 'block');
	});
*/
		$('body').on('click', '#paperseed-tgl', function() {
		$('#paperseed').css( 'display', 'block');
	});	
	
	document.getElementById("paperseed-tgl")
		.addEventListener("click", function() {
			document.getElementById("paperseed").hidden = false;
			document.getElementById("protofdm").hidden = true;
		}, false);
	document.getElementById("protofdm-tgl")
		.addEventListener("click", function() {
			document.getElementById("paperseed").hidden = true;
			document.getElementById("protofdm").hidden = false;
		}, false);
	/*var spin = setInterval(function(){
		//console.log('spining');
		var inc = 0.1;
		if (ZlockANGy < 80 ) inc = -inc;
		if (ZlockANGy > yAMAX ) inc = -inc;
		rotateViewZlock(0, inc, 0);
					drawScene(container);
		}, 90);*/
	}
		
window['miniView'] = miniView;


$(window).on("load", miniView ());


