var posx, posy;
var queDibuixem = 0;
var punt1 = { x: undefined, y: undefined };
var punt2 = { x: undefined, y: undefined };
var canvas = undefined;
var ctx = undefined;
var info = undefined;
var costats = 0;

function iniciar() {
    canvas = document.getElementById('lienzo');
    ctx = canvas.getContext('2d');
    ctx.strokeStyle = "black";
    ctx.fillStyle = "white";
    document.getElementById('clin').value = "#000000";
    document.getElementById('cfarcit').value = "#FFFFFF";
    info = document.getElementById('lbInfo');
    document.getElementById('tbCostats').value = '';
    document.getElementById('tbCostats').addEventListener('keyup', checkEnter);
}

function position(event) {
    posx = event.clientX - 323;
    posy = event.clientY - 9;
}

function asigColorLin(event) {
    ctx.strokeStyle = document.getElementById('clin').value;
}

function asigColorFarcit(event) {
    ctx.fillStyle = document.getElementById('cfarcit').value;
}


function mouseClick(event) {
    if (!queDibuixem || (queDibuixem && posx <= 0) || (queDibuixem && posy > 680)) {
        seleccionarOpcio();
    }
    else {
        aplicaOpcio();
    }
}


function asigPunt1() {
    punt1.x = posx;
    punt1.y = posy;
}


function asigPunt2() {
    punt2.x = posx;
    punt2.y = posy;
}

function seleccionarOpcio() {
    if (posx < -160 && posy < 90) {
        info.innerHTML = "Seleccionat Rectangle. Clickeu el punt inicial.";
        queDibuixem = 1; //Rectangle seleccionat
    }
    else if (posx > -160 && posx < 1 && posy < 90) {
        info.innerHTML = "Seleccionada El-lipse. Clickeu el punt inicial.";
        queDibuixem = 2; //El-lipse seleccionada
    }
    else if (posx < -160 && posy > 90 && posy < 180) {
        info.innerHTML = "Seleccionat Poligon. Introduïu nombre de costats i clickeu posició del vertex superior esquerre.";
        document.getElementById("tbCostats").hidden = false;
        document.getElementById("tbCostats").focus();
        queDibuixem = 3; //Poligon seleccionat
    }
    else
        queDibuixem = 0;
}

function aplicaOpcio() {
    switch (queDibuixem) {
        case 1://Rectangle
            if (posx > 0 && posy < 680 && punt1.x == undefined)// Click en area grafica
            {
                asigPunt1();
                info.innerHTML = "Clickeu el punt final.";
            }
            else if (punt1.x && !punt2.x && posx > 0 && posy < 680) {
                asigPunt2();
                drawRectangle();
                info.innerHTML = "Dibuixat rectangle.";
            }
            break;
        case 2://Elipse
            if (posx > 0 && punt1.x == undefined)// Click en area grafica
            {
                asigPunt1();
                info.innerHTML = "Clickeu el punt final.";
            }
            else if (punt1.x && !punt2.x) {
                asigPunt2();
                drawElipse();
                info.innerHTML = "Dibuixada el-lipse.";
            }
            break;
        case 3://Poligon
            if (posx > 0 && punt1.x == undefined)// Click en area grafica
            {
                if(costats == 0)
                {
                    alert("Quantitat de costats no introduida.Introduïu-la primer.")
                    queDibuixem = 0;
                    punt1.x = punt2.x = punt1.y = punt2.y = undefined;
                    info.innerHTML="";
                    document.getElementById('tbCostats').hidden = true;
                    return;
                }
                asigPunt1();
                info.innerHTML = "Clickeu el punt per llarg del costat.";
            }
            else if (punt1.x && !punt2.x) {
                asigPunt2();
                drawPoligon();
                info.innerHTML = "Dibuixat poligon.";
            }
            break;
    }
}


function drawRectangle() {
    ctx.fillRect(punt1.x, punt1.y, punt2.x - punt1.x, punt2.y - punt1.y);
    ctx.strokeRect(punt1.x, punt1.y, punt2.x - punt1.x, punt2.y - punt1.y);
    queDibuixem = 0;
    punt1.x = punt2.x = punt1.y = punt2.y = undefined;
}

function drawElipse() {
    let start = 0;
    let end = 2 * Math.PI; // 360 grads
    let width = punt2.x - punt1.x;
    let height = punt2.y - punt1.y;
    let circumference = Math.max(width, height);
    let scaleX = width / circumference;
    let scaleY = height / circumference;
    let centerx = punt1.x + width / 2;
    let centery = punt1.y + height / 2;
    ctx.save();
    ctx.translate(centerx, centery);
    ctx.scale(scaleX, scaleY);
    ctx.beginPath();
    ctx.arc(0, 0, width / 2, start, end, true);
    ctx.closePath();
    ctx.restore();
    ctx.stroke();
    ctx.fill();
    queDibuixem = 0;
    punt1.x = punt2.x = punt1.y = punt2.y = undefined;
}

function drawPoligon()
{
    let nombrecostats = costats;
    let angle = 2*Math.PI/nombrecostats;
    let costat = Math.sqrt(Math.pow(punt2.x - punt1.x,2) + Math.pow(punt2.y-punt1.y,2));
    ctx.save();
    ctx.translate(0,0);
    let anterior = new Object();
    anterior.x = punt1.x;
    anterior.y = punt1.y;
    ctx.beginPath();
    ctx.moveTo(punt1.x,punt1.y);
    let vector = { i:1,j:0}; // Vector de direccció inicial
    let angleacumulat = angle;
    for(let i=1; i < nombrecostats;i++)
    {
        let seguent = new Object();
        seguent.x = anterior.x + vector.i * costat;
        seguent.y = anterior.y + vector.j * costat;
        ctx.lineTo(seguent.x,seguent.y);
        vector = calcularVector(angleacumulat);
        angleacumulat += angle;
        anterior = seguent;
    }
    ctx.closePath();
    ctx.stroke();
    ctx.fill();
    queDibuixem = 0;
    punt1.x = punt2.x = punt1.y = punt2.y = undefined;
    document.getElementById('tbCostats').value = '';
    costats = 0;
    ctx.restore();
}


function calcularVector(angle)
{
    vector = new Object();
    if(Math.PI/2 >= angle) // Angle menor de 90º
    {
        vector.i = Math.cos(angle);
        vector.j = Math.sin(angle);
    }
    else if(Math.PI/2 < angle < Math.PI) //Angle mes gran de 90º i menor de 180º
    {
        let complementario = Math.PI-angle;
        vector.i = -Math.cos(complementario);
        vector.j = Math.sin(complementario);
    }
    else if(Math.PI < angle < Math.PI * 3 / 2) // Angle mes gran de 180º i menor a 270º
    {
        let complementario = (Math.PI*3/2) - angle;
        vector.i = -Math.sin(complementario);
        vector.j = -Math.cos(complementario);
    }
    else if(angle > Math.PI*3/2) // Angle mes gran de 270º
    {
        vector.i = Math.cos(angle);
        vector.j = -Math.sin(angle);
    }
    return vector;
}



function checkEnter(e)
{
    
    if (e.key === 'Enter' || e.keyCode === 13) {
        let ncostats = document.getElementById('tbCostats').value;
        if(isNaN(ncostats) || ncostats < 3)
            alert("Quantitat de costats no vàlida. Introuïu no més nombres enters més grans que 2");
        else
        {
            costats = ncostats;   
            document.getElementById('tbCostats').hidden = true;
        }
    }
    
}
