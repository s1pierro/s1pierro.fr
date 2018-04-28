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
{
	var converter = new showdown.Converter();
	l ( "s1p-admintools 0.1");
	showdown.setOption('optionKey', 'value');
	
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




