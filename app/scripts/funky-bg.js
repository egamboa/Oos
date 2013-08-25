var QUALITY = 4,
WIDTH = Math.floor(window.innerWidth / QUALITY), HEIGHT = Math.floor(window.innerHeight / QUALITY), SIZE = WIDTH * HEIGHT,

context, image, data,
buffer1, buffer2, tempbuffer,

isUserInteracting, pointers;

init();
setInterval(loop, 2000 / 60);

function init() {

	var container, canvas;
	
	container = document.getElementById('funky-bg');

	canvas = document.createElement("canvas");
	canvas.width = WIDTH;
	canvas.height = HEIGHT;
	canvas.style.width = window.innerWidth + "px";
	canvas.style.height = window.innerHeight + "px";
	container.appendChild(canvas);

	context = canvas.getContext("2d");
	context.fillStyle = "rgb(0, 0, 0)";
	context.fillRect (0, 0, WIDTH, HEIGHT);
	image = context.getImageData(0, 0, WIDTH, HEIGHT);
	data = image.data;

	buffer1 = [];
	buffer2 = [];
	
	for (var i = 0; i < WIDTH * HEIGHT; i ++) {

		buffer1[i] = 0;
		buffer2[i] = 0;

	}

	buffer2[ Math.floor(WIDTH / 2) + 1 + (Math.floor(HEIGHT / 2) * WIDTH)] = 20000;
	buffer2[ Math.floor(WIDTH / 2) - 1 + (Math.floor(HEIGHT / 2) * WIDTH)] = 20000;
}

//

function emit(x, y) {

	buffer2[ Math.floor(x) + (Math.floor(y) * WIDTH)] = 255;

}

function loop() {

	if (isUserInteracting) {
		
		for (var i = 0; i < pointers.length; i++) {
			
			emit(pointers[i][0], pointers[i][1]);
			
		}
	}

	var pixel;
	var iMax = (WIDTH * HEIGHT) - WIDTH;
	
	for (var i = WIDTH; i < iMax; i ++) {

		pixel = ((buffer1[i - 1] + buffer1[i + 1] + buffer1[i - WIDTH] + buffer1[i + WIDTH]) >> 1) - buffer2[i];
		pixel -= pixel >> 20;

		buffer2[i] = pixel;
		
		pixel = pixel > 255 ? 255 : pixel < 0 ? 0 : pixel;

		data[ (i * 4) + 1 ] = pixel;
		data[ ((i + 1) * 4) + 2 ] = pixel;
		
	}

	tempbuffer = buffer1;
	buffer1 = buffer2;
	buffer2 = tempbuffer;

	context.putImageData(image, 0, 0);
	
}