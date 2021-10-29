/* Variables globals */
var posx, posy; //Recullen posicio del ratoli quan es fa click
var queDibuixem = 0; // 0 sense seleccio, 1 Rectangle, 2 El-lipse, 3 Poligon, 4 Linia
var punt1 = { x: undefined, y: undefined };//Recullen punt inicial i final de element a dibuixar
var punt2 = { x: undefined, y: undefined };
var punt3 = { x: undefined, y: undefined };
var canvas = undefined;// Canvas
var ctx = undefined;// Context de canvas 
var info = undefined;// Etiqueta pels missatges al usuari
var costats = 0; // Per dibuixar poligons
var graus = 0; // Per a els girs
var sim = ''; // Per a la simetria
var direcciosimetria ='';
var gruixlin = 1; // Gruix de linia
var fontsize = 13; //Mida de font
var copia = undefined; // Contingut de la copia d'una finestra ( array de pixels)


/* Assigna valors inicials */
function iniciar() {
    canvas = document.getElementById('lienzo');
    ctx = canvas.getContext('2d');
    ctx.strokeStyle = "black";
    ctx.fillStyle = "white";
    ctx.font = "normal Arial 13";
    document.getElementById('clin').value = "#000000";
    document.getElementById('cfarcit').value = "#FFFFFF";
    info = document.getElementById('lbInfo');
    document.getElementById('tbCostats').value = '';
    document.getElementById('tbCostats').addEventListener('keyup', checkEnter);
    document.getElementById('tbGraus').addEventListener('keyup', checkGraus);
    document.getElementById('tbSimetria').addEventListener('keyup', checkSimetria);
    document.getElementById('lbGruix').innerText = gruixlin;
    document.getElementById('tipotxt').value = "Normal";
}

/* Assigna les coordenades de posicio del ratoli al area grafica quan es fa click */
function position(event) {
    posx = event.clientX - 385;
    posy = event.clientY - 8;
    //info.innerHTML = "X: " + posx + " Y: " + posy;
}

/* Assigna al context del canvas el color de linia quan es canvia la seleccio al color picker clin */
function asigColorLin(event) {
    ctx.strokeStyle = document.getElementById('clin').value;
}

/* Assigna al context del canvas el color de farcit quan es canvia la seleccio al color picker cfarcit */
function asigColorFarcit(event) {
    ctx.fillStyle = document.getElementById('cfarcit').value;
}

/* Reseteja les seleccions actuals */
function reset() {
    queDibuixem = 0;
    punt1.x = punt2.x = punt1.y = punt2.y = undefined;
    document.getElementById('tbCostats').value = '';
    document.getElementById('tbGraus').value = '';
    document.getElementById('tbSimetria').value = '';
    document.getElementById('tbGraus').hidden = true;
    document.getElementById('tbSimetria').hidden = true;
    document.getElementById('tbCostats').hidden = true;
}

/* Augmenta el gruix de linia quan es prem el botó + */
function incrementGl() {
    gruixlin++;
    document.getElementById('lbGruix').innerText = gruixlin;
    ctx.lineWidth = gruixlin;
}

/* Redueix el gruix de linia quan es prem el botó - */
function decrementGl() {
    if (gruixlin > 1)
        gruixlin--;
    document.getElementById('lbGruix').innerText = gruixlin;
    ctx.lineWidth = gruixlin;
}

/*Augmenta la mida de la font quan es prem el botó + */
function incrementFs() {
    fontsize++;
    document.getElementById('midatxt').innerText = fontsize;
    ctx.font = fontsize + "px Arial";
}

/* Redueix la mida de la font quan es prem el botó - */
function decrementFs() {
    if (fontsize > 1)
        fontsize--;
    document.getElementById('midatxt').innerText = fontsize;
    ctx.font = fontsize + "px Arial";
}

/* Canvia l'estil de linia del canvas quan es selecciona al desplegable */
function tipolinChanged() {
    let tipolin = document.getElementById('tipolin').value;
    switch (tipolin) {
        case "Continua":
            ctx.setLineDash([]);
            break;
        case "Discontinua":
            ctx.setLineDash([5, 10]);
            break;
        case "Linia punt":
            ctx.setLineDash([5, 10, 2]);
            break;
    }
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
    reset();
    document.getElementById("tbCostats").hidden = true;
    if (posx < -188 && posy < 85) {
        info.innerHTML = "Seleccionat Rectangle. Clickeu el punt inicial.";
        queDibuixem = 1; //Rectangle seleccionat
    }
    else if (posx > -160 && posx < 1 && posy < 90) {
        info.innerHTML = "Seleccionada El-lipse. Clickeu el punt inicial.";
        queDibuixem = 2; //El-lipse seleccionada
    }
    else if (posx < -188 && posy > 90 && posy < 180) {
        info.innerHTML = "Seleccionat Poligon. Introduïu nombre de costats i clickeu posició del vertex superior esquerre.";
        document.getElementById("tbCostats").hidden = false;
        document.getElementById("tbCostats").focus();
        queDibuixem = 3; //Poligon seleccionat
    }
    else if (posx > -160 && posx < 1 && posy > 90 && posy < 168) {
        info.innerHTML = "Seleccionada línia. Clickeu el punt inicial.";
        queDibuixem = 4; //Linia
    }
    else if (posx > 378 && posx < 508 && posy > 485) {
        if (ctx.fillStyle == "#ffffff")
            ctx.fillStyle = "black";
        info.innerHTML = "Seleccionat text. Escriviu el text i clickeu el punt d'inserció.";
        document.getElementById('tbText').hidden = false;
        document.getElementById('tbText').focus();
        queDibuixem = 5; //Text
    }
    else if (posx < -188 && posy > 175 && posy < 255) {
        info.innerHTML = "Seleccionat copia. Clickeu el punt superior esquerre de la finestra a copiar."
        queDibuixem = 6; // Copia d'una finestra.
    }
    else if (posx > -188 && posy > 175 && posy < 255) {
        info.innerHTML = "Seleccionat escala. Clickeu el punt superior esquerre de la finestra a escalar."
        queDibuixem = 7; // Escalat d'una finestra.
    }
    else if (posx < -188 && posy > 258 && posy < 339) {
        document.getElementById("tbGraus").hidden = false;
        document.getElementById("tbGraus").focus();
        info.innerHTML = "Seleccionat gir. Introduiu la quantitat de graus i clickeu el punt superior esquerre de la finestra a girar."
        queDibuixem = 8; // Gir d'una finestra.
    }
    else if (posx > -188 && posy > 258 && posy < 339) {
        document.getElementById("tbSimetria").hidden = false;
        document.getElementById("tbSimetria").focus();
        info.innerHTML = "Seleccionada simetria. Introduiu: h o H per a simetria horitzontal, o: v o V per a simetria vertical. Després, seleccioneu el punt superior esquerre de la finestra."
        queDibuixem = 9; // Gir d'una finestra.
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
                if (costats == 0) {
                    alert("Quantitat de costats no introduida.Introduïu-la primer.")
                    document.getElementById('tbCostats').focus();
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
        case 4://Linia
            if (posx > 0 && punt1.x == undefined)// Click en area grafica
            {
                asigPunt1();
                info.innerHTML = "Clickeu el punt final de la línia.";
            }
            else if (punt1.x && !punt2.x) {
                asigPunt2();
                drawLinia();
                info.innerHTML = "Dibuixada línia.";
            }
            break;
        case 5://Text
            if (posx > 0 && punt1.x == undefined)// Click en area grafica
            {
                asigPunt1();
                let texto = document.getElementById('tbText').value;
                ctx.font = document.getElementById('tipotxt').value + " " + fontsize + "px Arial";
                ctx.fillText(texto, punt1.x, punt1.y);
                info.innerHTML = "Dibuixat text";
                document.getElementById('tbText').value = '';
                document.getElementById('tbText').hidden = true;
                reset();
            }
            break;
        case 6://Copia d'una finestra
            if (posx > 0 && punt1.x == undefined)// Click en area grafica
            {
                asigPunt1();
                info.innerHTML = "Clickeu el punt inferior esquerre de la finestra a copiar.";
            }
            else if (punt1.x && !punt2.x) {
                asigPunt2();
                copiaFinestra();
                info.innerHTML = "Clikeu el punt de inserció de la copia.";
            }
            else if (punt1.x && punt2.x && !punt3.x) {
                asigPunt3();
                enganxaCopia();
                info.innerHTML = "Finestra copiada.";
                reset();
            }
            break;
        case 7://Escala una finestra
            if (posx > 0 && punt1.x == undefined)// Click en area grafica
            {
                asigPunt1();
                info.innerHTML = "Clickeu el punt inferior esquerre de la finestra a escalar.";
            }
            else if (punt1.x && !punt2.x) {
                asigPunt2();
                escalaFinestra();
                info.innerHTML = "Finestra escalada al doble.";
                reset();
            }
            break
        case 8: //Gir d'una finestra
        if (posx > 0 && punt1.x == undefined)// Click en area grafica
            {
                if (graus == 0) {
                    alert("Quantitat de graus no introduida o zero.Introduïu-la primer.")
                    document.getElementById('tbGraus').focus();
                    return;
                }
                asigPunt1();
                info.innerHTML = "Clickeu el punt inferior esquerre de la finestra a girar.";
            }
            else if (punt1.x && !punt2.x) {
                asigPunt2();
                copiaFinestra();
                giraFinestra();
                info.innerHTML = "Finestra girada.";
                reset();
            }
            break
        case 9: //Simetria d'una finestra
            if (posx > 0 && punt1.x == undefined)// Click en area grafica
            {
                if (sim == '') {
                    alert("Direcció de simetria no introduida. Si us plau introduïu-la primer.")
                    document.getElementById('tbSimetria').focus();
                    return;
                }
                asigPunt1();
                info.innerHTML = "Clickeu el punt inferior esquerre de la finestra a fer simetria.";
            }
            else if (punt1.x && !punt2.x) {
                asigPunt2();
                simetriaFinestra();
                info.innerHTML = "Simetria feta.";
                reset();
            }
            break
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

/* Assigna les coordenades del punt final del element a dibuixar */
function asigPunt3() {
    punt3.x = posx;
    punt3.y = posy;
}

/* Dibuixa un rectangle amb els punts superior esquerre i inferior dret */
function drawRectangle() {
    ctx.fillRect(punt1.x, punt1.y, punt2.x - punt1.x, punt2.y - punt1.y);
    ctx.strokeRect(punt1.x, punt1.y, punt2.x - punt1.x, punt2.y - punt1.y);
    reset();
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
    reset();
}

/* Dibuixa un poligon de n costats amb el vertex superior esquerre al primer punt clicat
   i un llarg de costat segons la distancia entre el primer punt i el segon clicat */
function drawPoligon() {
    let nombrecostats = costats;
    let angle = 2 * Math.PI / nombrecostats;
    let costat = Math.sqrt(Math.pow(punt2.x - punt1.x, 2) + Math.pow(punt2.y - punt1.y, 2));
    ctx.save();
    ctx.translate(0, 0);
    let anterior = new Object();
    anterior.x = punt1.x;
    anterior.y = punt1.y;
    ctx.beginPath();
    ctx.moveTo(punt1.x, punt1.y);
    let vector = { i: 1, j: 0 }; // Vector de direccció inicial
    let angleacumulat = angle;
    for (let i = 1; i < nombrecostats; i++) {
        let seguent = new Object();
        seguent.x = anterior.x + vector.i * costat;
        seguent.y = anterior.y + vector.j * costat;
        ctx.lineTo(seguent.x, seguent.y);
        vector = calcularVector(angleacumulat);
        angleacumulat += angle;
        anterior = seguent;
    }
    ctx.closePath();
    ctx.stroke();
    ctx.fill();
    reset();
    document.getElementById('tbCostats').value = '';
    costats = 0;
    ctx.restore();
}

/* Retorna un vector de direccio ( unitari ) en funcio del angle passat com a argument */
function calcularVector(angle) {
    vector = new Object();
    if (Math.PI / 2 >= angle) // Angle menor de 90º
    {
        vector.i = Math.cos(angle);
        vector.j = Math.sin(angle);
    }
    else if (Math.PI / 2 < angle < Math.PI) //Angle mes gran de 90º i menor de 180º
    {
        let complementario = Math.PI - angle;
        vector.i = -Math.cos(complementario);
        vector.j = Math.sin(complementario);
    }
    else if (Math.PI < angle < Math.PI * 3 / 2) // Angle mes gran de 180º i menor a 270º
    {
        let complementario = (Math.PI * 3 / 2) - angle;
        vector.i = -Math.sin(complementario);
        vector.j = -Math.cos(complementario);
    }
    else if (angle > Math.PI * 3 / 2) // Angle mes gran de 270º
    {
        vector.i = Math.cos(angle);
        vector.j = -Math.sin(angle);
    }
    return vector;
}

/* Comproba que s'introdueix un nombre correcte de costats per a dibuixar un poligon */
function checkEnter(e) {

    if (e.key === 'Enter' || e.keyCode === 13) {
        let ncostats = document.getElementById('tbCostats').value;
        if (isNaN(ncostats) || ncostats < 3)
            alert("Quantitat de costats no vàlida. Introuïu no més nombres enters més grans que 2");
        else {
            costats = ncostats;
            document.getElementById('tbCostats').hidden = true;
        }
    }
}
/* Comproba que s'introdueix un nombre correcte de graus per a fer el gir i converteix de graus decimals a radians */
function checkGraus(e) {

    if (e.key === 'Enter' || e.keyCode === 13) {
        let ngraus = document.getElementById('tbGraus').value;
        if (isNaN(ngraus) || ngraus > 360)
            alert("Quantitat de graus no vàlida. Introuïu no més nombres menors a 360");
        else {
            graus = ngraus * Math.PI / 180;
            document.getElementById('tbGraus').hidden = true;
        }
    }
}

function checkSimetria(e) {

    if (e.key === 'Enter' || e.keyCode === 13) {
        sim = document.getElementById('tbSimetria').value;
        if (sim != 'h' && sim != 'H' && sim != 'v' && sim != 'V')
            alert("Valor invalid. Si us plau introduïu: h o H per a simetria horitzontal, y v o V per simetria vertical.");
        else {
            direcciosimetria = sim;
            document.getElementById('tbSimetria').hidden = true;
        }
    }
}

/* Dibuixa una linia */
function drawLinia() {
    ctx.beginPath();
    ctx.moveTo(punt1.x, punt1.y);
    ctx.lineTo(punt2.x, punt2.y);
    ctx.closePath();
    ctx.stroke();
    reset();
}

function copiaFinestra() {
    let distx = punt2.x - punt1.x;
    let disty = punt2.y - punt1.y;
    distx = (distx < 0)?distx * -1:distx;
    disty = (disty < 0)?disty * -1:disty;
    copia = ctx.getImageData(punt1.x, punt1.y, distx,disty );
}

function enganxaCopia() {
    ctx.putImageData(copia, punt3.x, punt3.y);
}

function escalaFinestra() {
    let canvasocult = document.createElement('canvas');
    canvasocult.style.display = 'none';
    document.body.appendChild(canvasocult);
    canvasocult.width = (punt2.x - punt1.x) * 2;
    canvasocult.height = (punt2.y - punt1.y) * 2;
    let ctxocult = canvasocult.getContext('2d');
    ctxocult.drawImage(canvas, punt1.x, punt1.y, punt2.x - punt1.x, punt2.y - punt1.y, 0, 0, canvasocult.width, canvasocult.height);
    let fitxer = canvasocult.toDataURL("image/png").replace("image/png", "image/octet-stream");
    let imag = new Image;
    ctx.drawImage(imag, 0, 0);
    imag.src = fitxer;
    ctxocult.drawImage(imag, punt1.x, punt1.y);
    ctx.clearRect(punt1.x, punt1.y, canvasocult.width, canvasocult.height);
    ctx.drawImage(canvasocult, punt1.x, punt1.y);
}

function giraFinestra()
{
    // Establir un nou canvas invisible el doble de gran que la finestra seleccionada
    let canvasocult = document.createElement('canvas');
    canvasocult.style.display = 'none';
    document.body.appendChild(canvasocult);
    canvasocult.width = (punt2.x - punt1.x)*2;
    canvasocult.height = (punt2.y - punt1.y)*2;
    let ctxocult = canvasocult.getContext('2d');
    // Establir el context del canvas ocult amb escala la meitat i traslladar el punt origen
    ctxocult.scale(0.5,0.5);
    ctxocult.translate(canvasocult.width*Math.sin(graus),0);
    // Rotar el context del canvas ocult la quantitat de graus desitjada i dibuixar una imatge
    // extreta del canvas original del tamany de la finestra de selecció
    ctxocult.rotate(graus);
    ctxocult.drawImage(canvas, punt1.x, punt1.y, punt2.x - punt1.x, punt2.y - punt1.y, 0, 0, canvasocult.width, canvasocult.height);
    // Esborrar el dibuix contingut a la finestra de seleccio i afegir el dibuix en el canvas ocult
    ctx.clearRect(punt1.x, punt1.y, canvasocult.width, canvasocult.height);
    ctx.drawImage(canvasocult, punt1.x, punt1.y);
    graus = 0;
}

function simetriaFinestra()
{
  // Establir un nou canvas invisible el doble de gran que la finestra seleccionada
  let canvasocult = document.createElement('canvas');
  canvasocult.style.display = 'none';
  document.body.appendChild(canvasocult);
  canvasocult.width = (punt2.x - punt1.x);
  canvasocult.height = (punt2.y - punt1.y);
  let ctxocult = canvasocult.getContext('2d');
  // Extreure una imatge de la finestra de seleccio al canvas original
  ctxocult.drawImage(canvas, punt1.x, punt1.y, punt2.x - punt1.x, punt2.y - punt1.y, 0, 0, canvasocult.width, canvasocult.height);
  // Voltejar el canvas horitzontal o verticalment, esborrar el dibuix contingut a la finestra
  // de seleccio i afegir el dibuix en el canvas ocult voltejat.
  ctx.save();
  ctx.clearRect(punt1.x, punt1.y, canvasocult.width, canvasocult.height);
  if(sim == 'h' || sim == 'H'){
    ctx.scale(1,-1);
    ctx.translate(0,-440);
  }
  else if(sim == 'v' || sim == 'V'){
    ctx.scale(-1,1);
    ctx.translate((-punt1.x*2)-180,0);
  }
  ctx.drawImage(canvasocult, punt1.x, punt1.y);
  ctx.restore();
  sim = '';
}