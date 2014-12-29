var nextFrame = (function () {
  var frameFn = window.requestAnimationFrame 		    ||
                window.webkitRequestAnimationFrame 	||
                window.mozRequestAnimationFrame 	  ||
                function(cb) {
                  window.setTimeout(cb, 1000/60);
                };

  return function(cb) {
    frameFn.call(window, cb);
  };

}());

var stop = true,
    g = 1 / 1500, // vitesse de 1 pixel par 1 ms
    delta, t0, t1;

var v0 = 0,
    y0 = 0,
    y;

var loop = function(t) {

  if (!t0) {
    t0 = t;
  }

  var time = t - t0;
  if (t1) {
    delta = t - t1;
    //console.log(delta.toFixed(2));
  }
  t1 = t;
  var vy = g * time - v0;
  var oldY = y;
  y = 0.5 * g * time * time - v0 * time + y0;
  //console.log('y: ' + y.toFixed(0));
  //console.log('vy : ' + vy.toFixed(2));

  $('.ball').css('margin-top', y.toFixed(0) + 'px');

  if (y > 500) {

    var newY = 1000 - y;
    //console.log('new position: ' + newY);

    y0 = newY;
    v0 = 0.7 * vy;
    t0 = false;

    if (v0 < 0.04) {
      //console.log(v0);
      stop = true;
    }
  }

  if (!stop) {
    nextFrame(loop);
  }
}

var action = {
  start: function() {
    stop = !stop;
    y = 0;
    v0 = 0;
    t0 = false;
    nextFrame(loop);
  }
}

$('.js-btn').on('click', function() {
  action[ $(this).data('param')]();
});
