// on écoute l'événement 'ready'
// cela permet de n'exécuter notre code JavaScript que lorsque
// l'ensemble de la page a été chargée
document.addEventListener(('deviceready', init));

function getPicture(){
	navigator.camera.getPicture(
		init,
		onPhotoError,
		{quality : 50, destinationType : Camera.DestinationType.DATA_URL, correctOrientation: true}
	);
}

var image;
function onPhotoSuccess(imageData) {


	// Show the captured photo
	// The in-line CSS rules are used to resize the image
	//
	console.log('1');
	init();
}

function onPhotoError(message) {
	//AfDisplay error message
	alert('Failed because: ' + message);
}



// durée entre chaque création de nouveau monstre
var MONSTER_DELAY = 500;
// on crée un tableau vide qui va contenir les différents monstres du jeu
var monsters = [];
// variables canvas et context pour manipulation ultérieure
var canvas, context, image;

// compatibilité requestAnimationFrame selon différents navigateurs
window.requestAnimationFrame = window.requestAnimationFrame
	|| window.mozRequestAnimationFrame
	|| window.webkitRequestAnimationFrame
	|| window.oRequestAnimationFrame;

/**
 * La fonction init sera appelée lors de l'événément 'ready'
 * (@see ligne 4)
 */
function init(imageData) {
	console.log("2");
	image = document.getElementById('smallImage');

	// Unhide image elements
	//
	image.style.display = 'block';

	// Show the captured photo
	// The in-line CSS rules are used to resize the image
	//
	image.src = "data:image/jpeg;base64," + imageData;
	// on écoute le click sur le bouton startGame
	canvas = $('canvas');
// on initialise notre classe Monster pour lancer le téléchargement de l'image à afficher dans le canvas
	Monster.initialize();
	context = canvas[0].getContext('2d');


	startGame();
}
/**
 * Fonction appelée lors du click sur le bouton startGame.
 * Affiche le canvas et démarrage le jeu.
 * @param  {Event} event événement click lancé par le bouton startGame
 */
function startGame()
{	console.log("3");

	// on masque le bouton startGame
	$( 'a.startGame' ).hide();
	// à la place on affiche le canvas
	canvas.css( 'display', 'block' );
	// on écoute le click sur le canvas
	canvas.click( canvas_clickHandler );

	// on lance le processus de créaction de monstres à intervalles réguliers
	setInterval( createMonster, MONSTER_DELAY );
	// on lance le processus de rendu du canvas
	requestAnimationFrame( render );
}

/**
 * Fonction appelée par le setInterval (cf. ligne 40) toutes les 500ms (MONSTER_DELAY)
 * Crée un nouveau monstre à une position aléatoire.
 */
function createMonster()
{
	// si l'on a 50 monstres déjà à l'écran, on n'en crée pas de nouveau
	if (monsters.length < 50 )
	{
		// on crée un nouveau monstre
		var monster = new Monster();
		// position x et y aléatoire, en fonction des dimensions du canvas
		monster.y = Math.random()*$('canvas').height();
		monster.x = Math.random()*$('canvas').width();
		// taille du nouveau monstre aléatoire également
		monster.size = monster.size * ( 0.5 + 0.5*Math.random() )
		// on enregistre le monstre dans notre tableau de monstres
		// pour un affichage ultérieur dans le canvas
		monsters.push( monster );
	}
}

/**
 * Fonction appelée au click sur le canvas
 * teste si l'utilisateur a cliqué sur un monstre ou non
 * @param  {Event} event événement click lancé par le canvas
 */
function canvas_clickHandler( event )
{
	// on calcule les coordonnées du point cliqué
	// relativement au canvas
	var offset = canvas.offset();
	var x = event.pageX-offset.left,
		y = event.pageY-offset.top;
	// on parcours la liste des monstres
	for ( var i = monsters.length - 1; i >= 0 ; i-- )
	{
		var monster = monsters[ i ];
		// si l'utilisateur a touché un monstre...
		if ( monster.hits( x, y ) )
		{
			// ... alors on le supprime du tableau
			// (attention au sens de lecture du tableau)
			monsters.splice( i, 1 );
		}
	}
}

/**
 * Méthode appelée via la méthode requestAnimationFrame
 * Affiche les monstres sur le canvas
 */
function render()
{
	// on calcule les dimensions du canvas
	var bounds = canvas[0].getBoundingClientRect();
	// on efface complètement le canvas
	context.clearRect(0, 0, canvas.width(), canvas.height() );
	image.renderTo(context);
	// on affiche un à un les monstres dans le canvas
	for ( var i = 0, monstersLength = monsters.length; i < monstersLength; i++ )
	{
		var monster = monsters[ i ];
		// on déplace le monstre
		monster.move( bounds );
		// on l'affiche dans le canvas
		monster.renderTo( context );
	}

	// on redemande un nouveau render à la frame suivante		monster.move( bounds );

	requestAnimationFrame( render );
}