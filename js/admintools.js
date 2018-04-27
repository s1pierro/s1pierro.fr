/*
	miniVewer 0.1
	
	Saint Pierre Thomas
	spierro@free.fr
	LICENSE : libre
*/
'use strict';

function admintools ()
{
	var converter = new showdown.Converter({noHeaderId: true});
	console.log ( "s1p-admintools 0.1");
	showdown.setOption('optionKey', 'value');
	
	$('#convert').on('click', function() {
	
		var textinput = $("#md_input").val();
		var html = converter.makeHtml(textinput);
		$("#html_output").html(html);
		$("#html_preview").html(html);
		console.log ( "converting ..."+ html);
	});


}


$(window).on("load", admintools ());




