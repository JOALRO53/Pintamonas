var video;
var range;
var label;

function iniciar()
{
  video = document.getElementById('videoPlayer');
  range = document.getElementById('myRange');
  label = document.getElementById('lbTemps');
  range.max = video.duration;
  range.value = 0;
}

function playPause()
{
    if(video.paused)
        video.play();
    else
        video.pause();
}

function reiniciar()
{
    video.load();
    range.value=0;
}

function tempsChanged()
{
    video.currentTime= range.value;
}

function mostraTemps()
{
  label.innerHTML=Math.round(video.currentTime,0);
  range.value = video.currentTime;
}