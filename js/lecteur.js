
function lecteur () {

	if ( typeof lecteur.init == 'undefined' ) {
		lecteur.init = true;
		lecteur.currenttrack = 0;
		lecteur.playlist = ["Popof - Serenity",
			"C2C - F·U·Y·A"];	
		$('#header-title').replaceWith('<h3 id="header-title">titre</h3>');
		lecteur.audiobuffer = new Audio('/media/'+lecteur.playlist[lecteur.currenttrack]);

	}
}
lecteur.afficher = function ()
{
	$('#header-title').html('<i id="prec" class="icon-pause"></i>'+
				
				'<i id="lire" class="icon-play"></i>'+
				lecteur.playlist[lecteur.currenttrack]);
	$('#header-desc')
	.html('<i id="prec" class="icon-to-start-alt"></i>   '+
		(lecteur.currenttrack+1)+"/"+
		lecteur.playlist.length+' '+
	
	lecteur.playlist[lecteur.currenttrack]+'   <i id="suiv" class="icon-to-end-alt"></i>');
	//$('#header-title').text("");


}
lecteur.prec = function ()
{	
	if (lecteur.currenttrack > 0 )
	lecteur.currenttrack -=1;
	lecteur.afficher();


}
lecteur.lire = function ()
{
	var audio = new Audio('/media/'+lecteur.playlist[lecteur.currenttrack]+'.mp3');
	audio.play();


}
lecteur.suiv = function ()
{
	if ((lecteur.currenttrack+1)<lecteur.playlist.length )
	lecteur.currenttrack +=1;
	lecteur.afficher();

}
	$('body').on('click', '#lire', function() {
		lecteur.lire();
	});
	$('body').on('click', '#prec', function() {
		lecteur.prec();
	});
	$('body').on('click', '#suiv', function() {
		lecteur.suiv();
	});
	$('body').on('click', '.ipod', function() {
			lecteur();
			lecteur.afficher();
	});


