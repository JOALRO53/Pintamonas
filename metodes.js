var posx, posy;
var queDibuixem = 0;
var punt1 = { x:undefined, y:undefined};
var punt2 = { x:undefined, y:undefined};
var canvas = undefined;
var ctx = undefined;

function iniciar()
{
    canvas = document.getElementById('lienzo');
    ctx = canvas.getContext('2d');
    ctx.strokeStyle = "black";
    ctx.fillStyle = "white";
    document.getElementById('clin').value = "#000000";
    document.getElementById('cfarcit').value = "#FFFFFF";
}

function position(event) 
{
    posx = event.clientX-323;
    posy = event.clientY-9;
    let info = document.getElementById('lbInfo');
}

function asigColorLin(event)
{
    ctx.strokeStyle = document.getElementById('clin').value;
}

function asigColorFarcit(event)
{
    ctx.fillStyle=document.getElementById('cfarcit').value;
}


function mouseClick(event) {
    let info = document.getElementById('lbInfo');
    //info.innerHTML = 'X coords: ' + posx + ', Y coords: ' + posy;
    if(!queDibuixem || (queDibuixem && posx <= 0) || (queDibuixem && posy > 680) )
    {
        if (posx < -160 && posy < 90) {
            info.innerHTML = "Seleccionat Rectangle. Clickeu el punt inicial.";
            queDibuixem = 1; //Rectangle seleccionat
        } 
        else if (posx > -160 && posx < 1 && posy < 90) {
            info.innerHTML = "Seleccionada El-lipse. Clickeu el punt inicial.";
            queDibuixem = 2; //El-lipse seleccionada
        }
        else
            queDibuixem = 0;
    }
    else 
    {
        switch(queDibuixem)
        {
            case 1://Rectangle
                if (posx > 0 && posy < 680 && punt1.x == undefined)// Click en area grafica
                {
                    punt1.x = posx;
                    punt1.y = posy;
                    //info.innerHTML = "Clickeu el punt final.";
                    info.innerText=colorlin;
                }
                else if(punt1.x && !punt2.x && posx > 0 && posy < 680)
                {
                    punt2.x = posx;
                    punt2.y = posy;
                    drawRectangle();
                    info.innerHTML = "Dibuixat rectangle.";
                }
                break;
                case 2://Elipse
                if (posx > 0 && punt1.x == undefined)// Click en area grafica
                {
                    punt1.x = posx;
                    punt1.y = posy;
                    info.innerHTML = "Clickeu el punt final.";
                }
                else if(punt1.x && !punt2.x)
                {
                    punt2.x = posx;
                    punt2.y = posy;
                    drawElipse();
                    info.innerHTML = "Dibuixada el-lipse.";
                }
                break;
        }
    }
}

function drawRectangle(){
    ctx.fillRect(punt1.x,punt1.y,punt2.x-punt1.x,punt2.y-punt1.y);
    ctx.strokeRect(punt1.x,punt1.y,punt2.x-punt1.x,punt2.y-punt1.y);
    queDibuixem = 0;
    punt1.x = punt2.x = punt1.y = punt2.y = undefined;
}

function drawElipse(){
    let start = 0;
    let end = 2 * Math.PI; // 360 grads
    let width = punt2.x - punt1.x;
    let height = punt2.y - punt1.y;
    let circumference = Math.max(width, height);
    let scaleX = width / circumference;
    let scaleY = height / circumference;
    let centerx = punt1.x + width/2;
    let centery = punt1.y + height/2;
    ctx.save();
    ctx.translate(centerx, centery);
    ctx.scale(scaleX, scaleY);
    ctx.beginPath();
    ctx.arc(0, 0, width/2, start, end, true);
    ctx.closePath();
    ctx.restore();
    ctx.stroke();
    ctx.fill();
    queDibuixem = 0;
    punt1.x = punt2.x = punt1.y = punt2.y = undefined;  
}
    
