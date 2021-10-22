var posx,posy;

function position(event) {
    posx = event.clientX;
    posy = event.clientY;
    //var mousePositions = document.getElementById('areagrafica');
    //mousePositions.innerHTML = 'X coords: ' + posx + ', Y coords: ' + posy;
}

function mouseClick(event){
    
    mousePositions.innerHTML = 'X coords: ' + posx + ', Y coords: ' + posy;
    if(posx < 170 && posy < 90)
    {
       let info = document.getElementById('lbInfo');
       info.innerHTML = "Seleccinat Rectangle. Clickeu el punt inicial.";
    }
}