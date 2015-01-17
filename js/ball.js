var nextFrame = (function () {
  var frameFn = window.requestAnimationFrame 		  ||
  window.webkitRequestAnimationFrame  ||
  window.mozRequestAnimationFrame 	 ||
  function(cb) {
    window.setTimeout(cb, 1000/60);
  };

  return function(cb) {
    frameFn.call(window, cb);
  };
}());

var stop = true,
    g = 1 / 350, // speed
    v0 = 0,
    y0 = 0,
    size = 25,
    size_2 = size / 2,
    bounce = 0.8,
    lastTime = window.performance.now(),
    delay, time;
    t0, t1,
    speed, nextStop,
    y, oldY, i, HEIGHT,
    $ball, $shadow;

function renderBoxShadow(val) {
  return ', 0 ' + val.toFixed(0) + 'px 0 rgba(255, 0, 0, 0.03)';
}

function getBoxShadow(deltaY) {

  if (Math.abs(deltaY) < size_2) {
    return 'none';
  }

  var boxShadow = '0 ' + deltaY.toFixed(0) + 'px 0 rgba(255, 100, 100, 0.2)';

  if (deltaY > size) {
    for (i=0; i<deltaY; i+=3) {
      boxShadow += renderBoxShadow(deltaY - i);
    }
  } else {
    for (i=deltaY; i<0; i+=3) {
      boxShadow += renderBoxShadow(i);
    }
  }

  return boxShadow;
}

function loop(t) {

  if (!t0) {
    t0 = t;
  }

  delay = t - lastTime;
  lastTime = t;

  time = t - t0;

  if (delay > 200) { // prevent big delay
    time = t0 = 0;
  }

  speed = g * time - v0;

  if (oldY > HEIGHT) {
    stop = true;
  }
  oldY = y;
  y = 0.5 * g * time * time - v0 * time + y0 - 10 * speed * speed;

  var scale = '';

  var absSpeed = Math.abs(speed);
  if (absSpeed > 2) {
    absSpeed = 2;
  }
  var scaleX = Math.round(100 * (1 - 0.3 * Math.sin((absSpeed / 2) * 3.14 / 2))) / 100;

  if (nextStop) {
    scaleX = 1;
    nextStop = false;
  }

  var overflow = y - HEIGHT;
  if (overflow > 0) {
    //stop = true;
    y0 = HEIGHT - overflow; // approximation
    y = HEIGHT;
    v0 = bounce * g * time - v0;
    t0 = false;

    if (Math.abs(v0) < (70 * g)) {  // ending bouncing
      stop = true;
      $ball.style.boxShadow = 'none';

      setTimeout(function() {
        stop = false;
        v0 = -1 - 1 * Math.random();
        t0 = false;
        nextFrame(loop);
      }, 1000);
    }

    scaleX = 1;
    scale = ' scale(1)';
    nextStop = true;

  } else {
    $ball.style.boxShadow = getBoxShadow(oldY - y);
  }

  scale = ' scale(' + scaleX + ', ' + 1 / scaleX + ')';
  if (y < 0.1) {
    scaleX = 0.1;
  } else {
    scaleX = scaleX * Math.cos(overflow / HEIGHT * 3.14 / 2);
  }

  $shadow.style.webkitTransform = $shadow.style.transform = 'scale(' + 1.2 * scaleX + ',' + 0.7 * scaleX + ')';
  $ball.style.webkitTransform = $ball.style.transform = 'translatey(' + y.toFixed(0) + 'px)' + scale;

  if (!stop) {
    nextFrame(loop);
  }
}

stop = !stop;
y = 0;
y0 = 0;
v0 = 0;
t0 = false;
t1 = false;
nextStop = false;
HEIGHT = 0.85 * (document.documentElement.clientHeight, window.innerHeight || 0);
$ball = document.querySelector('.ball');
$shadow = document.querySelector('.shadow');
$shadow.style.display = 'block';
nextFrame(loop);

document.addEventListener("visibilitychange", function() {
  stop = document.hidden;
});
