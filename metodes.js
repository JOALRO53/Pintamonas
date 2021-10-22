var posx, posy;
var queDibuixem = 0;
punt1 = undefined;

function position(event) 
{
    posx = event.clientX;
    posy = event.clientY;
    let info = document.getElementById('lbInfo');
    if (punt1 != undefined && posx > 330) 
    {
        switch (queDibuixem) 
        {
            case 1: //Rectangle
                info.innerHTML = "Seleccioneu el punt final"
                break;
        }
    }

    //var mousePositions = document.getElementById('areagrafica');
    //mousePositions.innerHTML = 'X coords: ' + posx + ', Y coords: ' + posy;
}

function mouseClick(event) {
    let mousePositions = document.getElementById('areagrafica');
    let info = document.getElementById('lbInfo');
    mousePositions.innerHTML = 'X coords: ' + posx + ', Y coords: ' + posy;
    if(!queDibuixem)
    {
        if (posx < 170 && posy < 90) {
            info.innerHTML = "Seleccionat Rectangle. Clickeu el punt inicial.";
            queDibuixem = 1;
        }
    }
    else
    {
        if (posx > 330 && punt1 == undefined)// Click en area grafica
         {
            punt1 = posx;
         }
    }
}