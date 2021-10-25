/* Variables globals */
var posx, posy; //Recullen posicio del ratoli quan es fa click
var queDibuixem = 0; // 0 sense seleccio, 1 Rectangle, 2 El-lipse, 3 Poligon
var punt1 = { x: undefined, y: undefined };//Recullen punt inicial i final de element a dibuixar
var punt2 = { x: undefined, y: undefined };
var canvas = undefined;// Canvas
var ctx = undefined;// Context de canvas 
var info = undefined;// Etiqueta pels missatges al usuari
var costats = 0; // Per dibuixar poligons

/* Assigna valors inicials */
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

/* Assigna les posicions del ratoli al area grafica quan es fa click */
function position(event) {
    posx = event.clientX - 323;
    posy = event.clientY - 9;
}

/* Assigna al context del canvas el color de linia quan es canvia la seleccio al color picker clin */
function asigColorLin(event) {
    ctx.strokeStyle = document.getElementById('clin').value;
}

/* Assigna al context del canvas el color de farcit quan es canvia la seleccio al color picker cfarcit */
function asigColorFarcit(event) {
    ctx.fillStyle = document.getElementById('cfarcit').value;
}

/* Crida al metode adequat en funcio del estat de seleccio actual i la posicio on es fa click */
function mouseClick(event) {
    //Si no hi ha seleccio i es fa click fora del area grafica
    if (!queDibuixem || (queDibuixem && posx <= 0) || (queDibuixem && posy > 680)) {
        seleccionarOpcio();
    }
    else { 
        aplicaOpcio();
    }
}

/* Assigna el nombre de opcio a dibuixar en funcio de la posicio on s'hagi fet click a l'area de seleccio */
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

/* En funcio de la opcio abans seleccionada, obté els punts inicial i final i crida al metode per a 
   dibuixar l'element */
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

/* Assigna les coordenades del punt inicial del element a dibuixar */
function asigPunt1() {
    punt1.x = posx;
    punt1.y = posy;
}
/* Assigna les coordenades del punt final del element a dibuixar */
function asigPunt2() {
    punt2.x = posx;
    punt2.y = posy;
}

/* Dibuixa un rectangle amb els punts superior esquerre i inferior dret */
function drawRectangle() {
    ctx.fillRect(punt1.x, punt1.y, punt2.x - punt1.x, punt2.y - punt1.y);
    ctx.strokeRect(punt1.x, punt1.y, punt2.x - punt1.x, punt2.y - punt1.y);
    queDibuixem = 0;
    punt1.x = punt2.x = punt1.y = punt2.y = undefined;
}

/* Dibuixa una el-lipse tangent al rectangle format amb els punts superior esquerre i inferior dret */
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
    ctx.arc(0, 0, circumference / 2, start, end, true);
    ctx.closePath();
    ctx.restore();
    ctx.stroke();
    ctx.fill();
    queDibuixem = 0;
    punt1.x = punt2.x = punt1.y = punt2.y = undefined;
}

/* Dibuixa un poligon de n costats amb el vertex superior esquerre al primer punt clicat
   i un llarg de costat segons la distancia entre el primer punt i el segon clicat */
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
