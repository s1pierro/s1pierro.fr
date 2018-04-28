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
function Vector(a,b,c){this.o=a;this.s=b;this.n=c}function vectfromvertices(a,b){var c=Math.sqrt((b[0]-a[0])*(b[0]-a[0])+(b[1]-a[1])*(b[1]-a[1])+(b[2]-a[2])*(b[2]-a[2]));return new Vector(a,[(b[0]-a[0])/c,(b[1]-a[1])/c,(b[2]-a[2])/c],c)}window.vectfromvertices=vectfromvertices;window.Vector=Vector;function logVector(a){console.log("origine: "+a.o+" sens: "+a.s+" norme: "+a.n)}window.logVector=logVector;function magnitudevertex(a){return Math.sqrt(a[0]*a[0]+a[1]*a[1]+a[2]*a[2])}
window.magnitudevertex=magnitudevertex;function normalisevertex(a){var b=[0,0,0],c=magnitudevertex(a);b[0]=a[0]/c;b[1]=a[1]/c;b[2]=a[2]/c;return b}window.normalisevertex=normalisevertex;function vectorproduct(a,b){return[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]]}window.vectorproduct=vectorproduct;function scalarproduct(a,b){return a[0]*b[0]+a[1]*b[1]+a[2]*b[2]}window.scalarproduct=scalarproduct;
function multiplymatrix(a,b){var c=[];c.length=16;var d,e,f;for(e=0;4>e;e++)for(d=0;4>d;d++)for(f=c[d+4*e]=0;4>f;f++)c[d+4*e]+=a[f+4*e]*b[d+4*f];return c}window.multiplymatrix=multiplymatrix;function applypersp(a){v1[0]=viewangle/a[2]*a[0];v1[1]=viewangle/a[2]*a[1];v1[2]=a[2];return v1}window.applypersp=applypersp;function applymat(a,b){var c=$.extend(!0,[],b);c[0]=a[0]*b[0]+a[1]*b[1]+a[2]*b[2]+a[3];c[1]=a[4]*b[0]+a[5]*b[1]+a[6]*b[2]+a[7];c[2]=a[8]*b[0]+a[9]*b[1]+a[10]*b[2]+a[11];return c}
window.applymat=applymat;function applymatNpersp(a,b){var c=[];c.lenth=3;c[2]=a[8]*b[0]+a[9]*b[1]+a[10]*b[2]+a[11];c[0]=viewangle/c[2]*(a[0]*b[0]+a[1]*b[1]+a[2]*b[2]+a[3]);c[1]=viewangle/c[2]*(a[4]*b[0]+a[5]*b[1]+a[6]*b[2]+a[7]);return c}window.applymatNpersp=applymatNpersp;function genimat(){var a=[];a.length=16;var b,c;for(b=0;4>b;b++)for(c=0;4>c;c++)a[b+4*c]=b==c?1:0;return a}window.genimat=genimat;function gentmat(a,b,c){var d=genimat();d[3]=a;d[7]=b;d[11]=c;return d}window.gentmat=gentmat;
function genrmat(a,b,c){a*=Math.PI/180;var d=Math.PI/180*b,e=Math.PI/180*c;c=genimat();b=Math.cos(a);a=Math.sin(a);var f=Math.cos(d);d=Math.sin(d);var g=Math.cos(e);e=Math.sin(e);var h=b*d,k=a*d;c[0]=f*g;c[1]=-f*e;c[2]=-d;c[4]=-k*g+b*e;c[5]=k*e+b*g;c[6]=-a*f;c[8]=h*g+a*e;c[9]=-h*e+a*g;c[10]=b*f;c[3]=c[7]=c[11]=c[12]=c[13]=c[14]=0;c[15]=1;return c}window.genrmat=genrmat;

////////////////////////////////////////////////////////////////////////////////
//	miniView core functions
////////////////////////////////////////////////////////////////////////////////
function Log(s)
{
	console.log (s);
}
window['Log'] = Log;


var buffer = {};

var zoom = 100;
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
function rotateView(x, y, z)
{
	var tmp = genrmat( x, y, z);
	rmat = multiplymatrix (tmp, rmat);
	genfmat();
}
window['rotateView'] = rotateView;
function rotateViewZlock(x, y)
{
	ZlockANGy -= y;
	ZlockANGx += x;
/*	if ( ZlockANGx < 180 ) ZlockANGx = 180;
	if ( ZlockANGx > 190 ) ZlockANGx = 190;
	if ( ZlockANGy < yAMIN ) ZlockANGy = yAMIN;
	if ( ZlockANGy > yAMAX ) ZlockANGy = yAMAX;*/
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

/* render quick selection */
function drawScene (container) { drawSceneSolid(container) } window['drawScene'] = drawScene;

function drawSceneFlat(container) {  //optimised speed ( cut in lightening acuracy )

  	container.innerHTML = "";
	//$("#arp").attr('transform', 'translate('+(273.44049+ZlockANGy*2)+',-'+(ZlockANGx-50)+')');
	//drawenv(container);
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
window['drawSceneFlat'] = drawSceneFlat;
function drawSceneSolid(container) {  //optimised speed ( cut in lightening acuracy )

  	container.innerHTML = "";
	//$("#arp").attr('transform', 'translate('+(273.44049+ZlockANGy*2)+',-'+(ZlockANGx-50)+')');
	//drawenv(container);
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
			var n = buffer.triangles[ j ].n[2];


			buffer.triangles[ j ].trigon = buffer.vertices[tmpWvft.triangles[j][0]-1][0]+','+buffer.vertices[tmpWvft.triangles[j][0]-1 ][1];
			
			for ( var k = 1 ; k < tmpWvft.triangles[j].length ; k++)
				buffer.triangles[ j ].trigon += ' '+buffer.vertices[tmpWvft.triangles[j][k]-1][0]+','+buffer.vertices[tmpWvft.triangles[j][k]-1 ][1];

			svg.setAttribute('points',buffer.triangles[j].trigon);
			svg.setAttribute('class', 'tri-'+j+' solid solid-step-'+Math.floor(n*16) );
			container.appendChild(svg);
		}
	}
}
window['drawSceneSolid'] = drawSceneSolid;

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
			return vertices;
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
		if ( somme > 20 && n > -0.3 )
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

	var w = $(window).width();
	var h = $(window).height();

	var zoom = 10;
	var ratio = w/h;

	initViewZlock(182, yAMAX, 0, 70);
	$('#svg7').attr('width', h*210/297);
	$('#svg7').attr('height', h);
	$('#svg8').attr('width', w-h*210/297-55);
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

function miniView () {
		

	var mode = (eval("var __temp = null"), (typeof __temp === "undefined")) ? 
	    "strict": 
	    "non-strict";
	    console.log('interprete js : '+mode);

	/*======================================================================
	
		Initialisations
		
	----------------------------------------------------------------------*/

	var container = document.getElementById("renderbox");
	if ( typeof miniView.init == 'undefined' ) {
		miniView.init = true;
		miniView.Items = [];
		buildScene ();
	buffer = $.extend(true, {}, loadWavefrontFromHTLM('#logo', 'buffer'));
		
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
			rotateView(ev.velocityY * 15, ev.velocityX * 15, 0);
			drawScene(container);
		}
		else {
			window.scrollBy(0,-ev.velocityY*20);
		}
	});
	$('.test').on('mousedown', function() {
		console.log('test down');
	});

		$('body').on('click', '#paperseed-tgl', function() {
		$('#paperseed').css( 'display', 'block');
	});	
	$('#svg8').on('mousewheel', function(event) {
		console.log(event.deltaX, event.deltaY, event.deltaFactor);
		translateView (0, 0,event.deltaY*event.deltaFactor );
		drawScene(container);
	});

}
		
window['miniView'] = miniView;


$(window).on("load", miniView ());




