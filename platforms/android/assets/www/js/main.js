// on écoute l'événement 'ready'
// cela permet de n'exécuter notre code JavaScript que lorsque
// l'ensemble de la page a été chargée
document.addEventListener('deviceready', init, false);
// durée entre chaque création de nouveau monstre
var MONSTER_DELAY = 500;
// on crée un tableau vide qui va contenir les différents monstres du jeu
var monsters = [];
// variables canvas et context pour manipulation ultérieure
var canvas, context, hero;
hero = new Hero();

// compatibilité requestAnimationFrame selon différents navigateurs
window.requestAnimationFrame = window.requestAnimationFrame
	|| window.mozRequestAnimationFrame
	|| window.webkitRequestAnimationFrame
	|| window.oRequestAnimationFrame;

function getPic(){
	navigator.camera.getPicture(
		onPhotoSuccess,
		onPhotoError,
		{quality : 50, destinationType : Camera.DestinationType.DATA_URL, correctOrientation: true}
	);
}


function onPhotoSuccess(imageData) {
	console.log("2");
	hero = document.getElementById("smallImage");

	// Unhide image elements
	//
	hero.style.display = 'block';
		hero.size = 100;
	// Show the captured photo
	// The in-line CSS rules are used to resize the image
	//
	hero.img = new Image();
	hero.img.src = "data:image/jpeg;base64," + imageData;

	// Show the captured photo
	// The in-line CSS rules are used to resize the image
	//
	console.log('1');
	startGame();

}

function onPhotoError(message) {
	//AfDisplay error message
	alert('Failed because: ' + message);
}


/**
 * La fonction init sera appelée lors de l'événément 'ready'
 * (@see ligne 4)
 */
function init(imageData) {
	// on écoute le click sur le bouton startGame
	/*navigator.accelerometer.watchAcceleration(
		onAccelerationReceived,
		onErrorAcceleration,
		{ frequency : 20 }
	);*/
	navigator.accelerometer.watchAcceleration(
		accelerometerSuccess,
		accelerometerError,
		{ frequency : 20 }
	);
// on initialise notre classe Monster pour lancer le téléchargement de l'image à afficher dans le canvas
	Monster.initialize();
	canvas = $('canvas');
	context = canvas[0].getContext('2d');
}

function accelerometerSuccess(acceleration){

	hero.vx = acceleration.x;
	hero.vy = acceleration.y;
	var element = document.getElementById('accel');
	element.innerHTML = 'Acceleration X: ' + acceleration.x + '<br />' +
		'Acceleration Y: ' + acceleration.y +'<br />' +
		'Acceleration Z: ' + acceleration.z + '<br />' +
		'Timestamp: ' + hero.vx + '<br />';



}

function accelerometerError(){
	alert('Failed because: ' + message);

}

/**
 * Fonction appelée lors du click sur le bouton startGame.
 * Affiche le canvas et démarrage le jeu.
 * @param  {Event} event événement click lancé par le bouton startGame
 */
function startGame()
{

	// on masque le bouton startGame
	$( 'a.startGame' ).hide();
	// à la place on affiche le canvas
	canvas.css( 'display', 'block' );
	// on écoute le click sur le canvas
	canvas.click( canvas_clickHandler );

	// on lance le processus de créaction de monstres à intervalles réguliers
	setInterval( createMonster, MONSTER_DELAY );
	// on lance le processus de rendu du canvas
	createHero();
	requestAnimationFrame( render );
}

function createHero(){
	var h = new Hero;
	h.x = hero.x;
	h.y = hero.y;
	h.vx = hero.vx;
	h.vy = hero.vy;
	h.size = hero.size;
	h.img = new Image();
	h.img.src = hero.img.src;
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
		console.log('ty'+monsters.length);

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



	hero.move( bounds );
	// on l'affiche dans le canvas
	hero.renderTo( context );
	// on affiche un à un les monstres dans le canvas
	for ( var i = 0, monstersLength = monsters.length; i < monstersLength; i++ )
	{
		console.log('nn');

		var monster = monsters[ i ];
		// on déplace le monstre
		monster.move( bounds );
		// on l'affiche dans le canvas
		monster.renderTo( context );
	}

	// on redemande un nouveau render à la frame suivante		monster.move( bounds );

	requestAnimationFrame( render );
}

