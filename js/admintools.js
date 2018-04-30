/*
	miniVewer 0.1
	
	Saint Pierre Thomas
	spierro@free.fr
	LICENSE : libre
*/
'use strict';

function l (s)
{
	console.log (s);
}


function admintools ()
{/*=
const showdown = require('showdown');

const classMap = {
  h1: 'ui large header',
  h2: 'ui medium header',
  ul: 'ui list',
  li: 'ui item'
}

const bindings = Object.keys(classMap)
  .map(key => ({
    type: 'output',
    regex: new RegExp(`<${key}>`, 'g'),
    replace: `<${key} class="${classMap[key]}">`
  }));

const conv = new showdown.Converter({
  extensions: [...bindings],
  noHeaderId: true // important to add this, else regex match doesn't work
});*/


const classMap = {
  img: '.img-fluid.full',
  h2: '.ui.medium.headeeeer',
  ul: '.ui.list',
  li: '.ui.item'
}
const bindings = Object.keys(classMap)
  .map(key => ({
    type: 'output',
    regex: new RegExp(`<${key}>`, 'g'),
    replace: `<${key} class="${classMap[key]}">`
  }));


const converter = new showdown.Converter({
  extensions: [...bindings],
  noHeaderId: true // important to add this, else regex match doesn't work
});


	l ( "s1p-admintools 0.1");

	
	$('#convert').on('click', function() {
	
		$('#showdown_output').removeAttr('hidden');
		$('#showdown_preview').removeAttr('hidden');
		
		//converter.setOption('optionKey', 'value');showdown_output
		if ( $('#titleid').is(":checked"))
		{
			converter.setOption('noHeaderId', false);
			l('[x] title id');
		}
		else
		{
			converter.setOption('noHeaderId', true);
			l('[ ] title id');
		}
		if ( $('#autolink').is(":checked") )
		{
			converter.setOption('simplifiedAutoLink', true);
			l('[x] autolink');
		}
		else
		{
			converter.setOption('simplifiedAutoLink', false);
			l('[ ] autolink');
		}
/*		if($('#').is(":checked"))
		{
			converter.setOption('', '');
			l('[x] ');
		}
		else
		{
			converter.setOption('', '');
			l('[ ] ');
		}
		*/

		
	
	
		var textinput = $("#md_input").val();
		var html = converter.makeHtml(textinput);
		$("#html_output").html(html);
		$("#html_preview").html(html);
$('code').each(function(i, block) {
    hljs.highlightBlock(block);
  });
		
		
	});
	
$('#md_input').bind('input propertychange', function() {
l("changes");
		var textinput = $("#md_input").val();
		var html = converter.makeHtml(textinput);
		$("#html_output").html(html);
		$("#html_preview").html(html);
		$('#showdown_output').removeAttr('hidden');
		$('#showdown_preview').removeAttr('hidden');


});
	//converter.setOption('optionKey', 'value');
}


$(window).on("load", admintools ());




