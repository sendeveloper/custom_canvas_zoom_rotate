var TO_RADIANS = Math.PI/180;
var img = new Image();
var ctx1;
var canvas1 = document.getElementById('canvas1');

var image_half_width = 500;
img.src = 'target.jpg';

// var image_half_width = 100;
// img.src = 'dog.jpg';

img.onload = function () {

	ctx1 = initCanvas(canvas1);
	ctx1.drawImage(img, -image_half_width, -image_half_width );
}
CanvasRenderingContext2D.prototype.rotateByPosition = function(delta_rotate_degrees, x_pos = 0, y_pos = 0) {
	// angle in radian
	// x_pos: offset pixels from center of the view, x-axis
	// y_pos: offset pixels from center of the view, y-axis
	var original_zoom, original_x, original_y, original_rotate;
	if (!delta_rotate_degrees){
		delta_rotate_degrees = parseFloat(document.getElementById("default_degree").value);
		if (!isNaN(delta_rotate_degrees)) 
			delta_rotate_degrees = toRadians(delta_rotate_degrees);
		else
			delta_rotate_degrees = 0;
		original_rotate = 0;
	}
	else
	{
		original_rotate = parseFloat(this.canvas.getAttribute('zoom-r'));
		if (isNaN(original_rotate)) original_rotate = 0;
	}
	delta_rotate_degrees = parseFloat(delta_rotate_degrees);
	original_zoom = parseFloat(this.canvas.getAttribute('zoom'));
	original_x = parseFloat(this.canvas.getAttribute('zoom-x'));
	original_y = parseFloat(this.canvas.getAttribute('zoom-y'));
	if (isNaN(original_zoom)) original_zoom = 1;
	if (isNaN(original_x)) original_x = 0;
	if (isNaN(original_y)) original_y = 0;

	original_rotate += delta_rotate_degrees;
	this.draw(original_rotate, original_zoom, original_x, original_y);
}
CanvasRenderingContext2D.prototype.zoom = function(zoom_percentage, x_pos = 0, y_pos = 0) {
	// zoom percentage
	// x_pos: offset pixels from center of the view, x-axis
	// y_pos: offset pixels from center of the view, y-axis
	var zoom, original_zoom, original_x, original_y, original_rotate;

	if (!zoom_percentage){		
		zoom_percentage = document.getElementById("default_percent").value;
		original_zoom = 1;
		original_x = 0;
		original_y = 0;
	}
	else{
		original_zoom = parseFloat(this.canvas.getAttribute('zoom'));
		original_x = parseFloat(this.canvas.getAttribute('zoom-x'));
		original_y = parseFloat(this.canvas.getAttribute('zoom-y'));
		if (isNaN(original_zoom)) original_zoom = 1;
		if (isNaN(original_x)) original_x = 0;
		if (isNaN(original_y)) original_y = 0;
	}
	original_y = -original_y;
	original_rotate = parseFloat(this.canvas.getAttribute('zoom-r'));
	if (isNaN(original_rotate)) original_rotate = 0;

	if (!x_pos)
		x_pos = document.getElementById("default_x").value;
	if (!y_pos)
		y_pos = document.getElementById("default_y").value;

	zoom_percentage = parseFloat(zoom_percentage);
	x_pos = parseFloat(x_pos);
	y_pos = parseFloat(y_pos);

	var zoom = zoom_percentage / 100;
	var newzoom, newx, newy;
	newzoom = original_zoom * zoom;
	if (newzoom == 1){
		newx = newy = 0;
	}
	else
	{
		newx = ((original_zoom-1) * zoom * original_x + (zoom - 1) * x_pos) / (-1.0+newzoom);
		newy = ((original_zoom-1) * zoom * (0-original_y) + (zoom - 1) * (0-y_pos)) / (-1.0+newzoom);
	}

    this.draw(original_rotate, newzoom, newx, newy)
}
CanvasRenderingContext2D.prototype.draw = function(rotate, zoom, x, y) {
	this.save();
	this.fillStyle = "white";
	this.fillRect(-300,-300,600,600);

	this.translate(x, -y);
	this.scale(zoom, zoom);
	this.rotate( rotate );
	this.translate(-x, y);
	this.drawImage(img, -image_half_width , -image_half_width );
	// this.translate(this.canvas.width/2, this.canvas.height/2);
    this.restore();

    this.canvas.setAttribute('zoom', zoom);
	this.canvas.setAttribute('zoom-x', x);
	this.canvas.setAttribute('zoom-y', y);
    this.canvas.setAttribute('zoom-r', rotate);
}
function toRadians(angle){
	return TO_RADIANS * angle;
}
function initCanvas(canvas) {
	var ctx = canvas.getContext('2d');
	ctx.setTransform(1, 0, 0, 1, 0, 0);
	ctx.clearRect(0,0,canvas.width, canvas.height);
	ctx.translate(canvas.width/2, canvas.height/2);
	return ctx;
}
function rotateFunc() {
	var degree = document.getElementById("rotation_degree").value;
	var init = document.getElementById("default_degree").value;
	var merge;
	// ctx1.save();

	ctx1.rotateByPosition(toRadians(degree),0,0);
	merge = parseFloat(init) + parseFloat(degree);
	document.getElementById("default_degree").value = merge;

	// ctx1.restore();
}
function zoomFunc() {

	var default_percent = parseFloat(document.getElementById("default_percent").value);
	var default_x = parseFloat(document.getElementById("default_x").value);
	var default_y = parseFloat(document.getElementById("default_y").value);
	var zoom_percent = document.getElementById("zoom_percent").value;
	var zoom_x = document.getElementById("zoom_x").value;
	var zoom_y = document.getElementById("zoom_y").value;

	var newp, newx, newy;
	// ctx1.save();

	ctx1.zoom(zoom_percent, zoom_x, zoom_y);
	zoom_percent = parseFloat(zoom_percent);
	zoom_x = parseFloat(zoom_x);
	zoom_y = parseFloat(zoom_y);

	default_percent /= 100;
	zoom_percent /= 100;
	newp = default_percent * zoom_percent;
	if (newp == 1){
		newx = 0;
		newy = 0;
	}
	else
	{
		newx = ((default_percent-1) * zoom_percent * default_x + (zoom_percent - 1) * zoom_x) / (-1.0+newp);
		newy = ((default_percent-1) * zoom_percent * (0-default_y) + (zoom_percent - 1) * (0-zoom_y)) / (-1.0+newp);
	}
	document.getElementById("default_percent").value = newp * 100;
	document.getElementById("default_x").value = newx;
	document.getElementById("default_y").value = (0-newy).toString();
	// ctx1.restore();
}
function initDraw(){
	initCanvas(canvas1);
	// ctx1.save();

	ctx1.zoom();
	ctx1.rotateByPosition();

	// ctx1.restore();
}