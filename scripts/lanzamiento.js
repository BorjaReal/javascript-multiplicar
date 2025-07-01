'use strict';

window.onload = function() {
    miFormulario.reset();
    PrevalidarFormulario();
}

//------------------------------1 validaciones (pre y post)-------------------------------//


// setCustomValidity
// IMPORTANTE ESTOY DETENIENDO EL FORMULARIO, NO EL BOTON.
function PrevalidarFormulario()
{
    let inputFilas = document.getElementsByName('filas')[0];

    inputFilas.setCustomValidity('las filas deben tener un valor de 1 a 10');
    document.miFormulario.addEventListener("invalid", marcarInvalid, true);
    inputFilas.oninput = function() {
   
        if(this.value.trim() != "" && /^([1-9]|10)$/.test(this.value))
            inputFilas.setCustomValidity('');
        
    };
    // IMPORTANTE ESTOY DETENIENDO EL FORMULARIO, NO EL BOTON
    miFormulario.addEventListener('submit', validarPostSubmit)
}

//   event.preventDefault();
function validarPostSubmit()
{
    event.preventDefault();
    let errorEdicion=false;
    let valorTabla = false;
    let errorAlert = "";
  
    let desplegableMetodo = document.getElementsByName('metodo')[0];
    let inputTabla = document.getElementsByName('tabla')[0];
    let valorMetodo = desplegableMetodo.value;

   
    if(ValorRadioSiNo() && (valorMetodo == "" || valorMetodo == "section"
        || valorMetodo == "table" || valorMetodo == "select"))
    {
        errorEdicion=true;
    }
    

    if(inputTabla.value.trim() != "" && /^([1-9]|10)$/.test(inputTabla.value))
    {    
        valorTabla = true;
        inputTabla.style.background = 'white';
    }
    else
        inputTabla.style.background = '#FFDDDD';

    if(errorEdicion)
        errorAlert += "El editable solo se puede establecer metodos de lista\n";
    if(!ComprobarChecked())
        errorAlert += "debe establecerse un valor en el radio\n";
    if(!valorTabla)
        errorAlert += "El valor de la tabla debe estar comprendido entre 1 y 10\n";

    if(errorAlert != "")
    {
        alert(errorAlert);
        return false;
    }

    FijarFormulario(); 
    CrearNodos();
}

// .checked
function ComprobarChecked()
{
    let radiosChecked =false;
    let inputRadios = document.getElementsByName('editable');

    for(let radio of inputRadios)
    {
        if (radio.checked)
        {
            radiosChecked = true;
        }
    }

    return radiosChecked;
}

// value y checked en minusculas.
function ValorRadioSiNo()
{
    let inputRadios = document.getElementsByName('editable');
    let valorRadio = "";

    for(let radio of inputRadios)
    {
        if (radio.checked)
        {
            valorRadio = radio.value;
        }
    }
    if(valorRadio === "SI")
        return true;
    else
        return false;
}


function marcarInvalid(e) {
    let elemento = e.target;

    if(elemento.type === "radio")
    {
        elemento.previousSibling.style.backgroundColor = '#FFDDDD';
    }
    
    else (elemento.type === "text")
    {
        if(elemento.validity.valid)
        {
            elemento.style.background="white";
        }
        else
        {
            elemento.style.background='#FFDDDD';
        }
    }
}

//------------------------------2 lanzar formulario -------------------------------//
// Activa el evento cambio del desplegable y desabilita elementos del formulario
function FijarFormulario()
{
    let inputFilas = document.getElementById('filas');
    let inputTabla = document.getElementById('tabla');
    let inputRadios = document.getElementsByName('editable');
    inputRadios.className = "estiloRadios";
    console.log("estiloRadios:", inputRadios );
    let botones = document.getElementsByClassName('btn');
    let desplegableMetodo = document.getElementsByName('metodo')[0];
    desplegableMetodo.addEventListener('change', Conversion);

    
    
    if(ValorRadioSiNo())
    {
        inputTabla.disabled = true;
        desplegableMetodo.disabled = true;
    }

    inputFilas.disabled = true;

    for(let radio of inputRadios)
        radio.disabled = true;

    for(let boton of botones)
    {
        if(boton.name === "btn_lanzar")
            boton.style.display = "none";

        if(boton.name === "btn_reset")
        {
            boton.style.display = "inline-block";
            boton.addEventListener("click", function() {
                Resetear();
            });
        }
    }
}


//------------------------------3 Crear nodos del formulario -------------------------------//
// 3.1 Parrafos.
// 3.2 Listas (6,7,8)
// 3.3 Tablas.
// 3.4 Select


function CrearNodos()
{
    let selectMetodo = document.getElementsByName('metodo')[0];
    let multiplicador=+document.getElementsByName('tabla')[0].value;
    let inputFilas=+document.getElementsByName('filas')[0].value;
    let valorSelect = selectMetodo.value;

    switch(valorSelect)
    {
        case 'section':
            CrearParrafos(multiplicador, inputFilas)
            break;
        case 'ul':
            CrearLista('ul', multiplicador, inputFilas);
            break;
        case 'ol':
            CrearLista('ol',multiplicador, inputFilas);
            break;
        case 'table':
            CrearTablas(multiplicador, inputFilas);
            break;
        case 'select':
            CrearSelect(multiplicador, inputFilas);
            break;
    }
}

// 3.1 Parrafos. 
// TextNode
// TEXTNODE
// APPENDChild
function CrearParrafos(multiplicador, filas)
{
    let divRespuesta = document.getElementById('respuesta');
    let seccionCrear = document.createElement('section');
    let parrafo;
    let textoParrafo;
    let nodeTexto;

    for(let i=1; i<=filas; i++)
    {
        textoParrafo = multiplicador + " x " + i + " = " + multiplicador*i;
        nodeTexto = document.createTextNode(textoParrafo);
        parrafo = document.createElement('p');
        parrafo.appendChild(nodeTexto);
        seccionCrear.appendChild(parrafo);
    }
    divRespuesta.appendChild(seccionCrear);
    seccionCrear.addEventListener('click', Conversion);
    //parrafo.addEventListener('click', function(){ Conversion()}); No he podido borrar los parrafos (pierdo la referencia this).  
    if (ValorRadioSiNo())
        parrafo.removeEventListener('click', Conversion);

}

// 3.2 Listas.
function CrearLista(tipo, multiplicador, filas)
{
    let divRespuesta = document.getElementById('respuesta');
    let elementoUlOl = document.createElement(tipo);
    divRespuesta.appendChild(elementoUlOl);
    let elementoLista;

    if(ValorRadioSiNo())
        EditarListas(elementoUlOl);

    else
    {
        for(let i=1; i<=filas; i++)
        {
            elementoLista = document.createElement('li');
            elementoLista.textContent = multiplicador + " x " + i + " = " + multiplicador*i 
            elementoUlOl.appendChild(elementoLista);             
        }  
        elementoUlOl.addEventListener('click', Conversion);
    } 
}
// 6, 7 y 8 lo dejo junto con la listas
//----------------------------- 6 Editar listas-------------------------------//

// OJO: uso del insertBefore/previousSibling
function EditarListas(elementoUlOl)
{
    let liBotones = document.createElement('li');
    liBotones.id = "liBotones";
    elementoUlOl.appendChild(liBotones)
    CrearBotonAnyadir(elementoUlOl);
    
    //console.log(divRespuesta.firstElementChild.firstElementChild);
    //tengo el padre (lista ul/ol) e inserto la listabotones antes del primerElemento de la lista ul/ol
    //divRespuesta.firstElementChild.insertBefore(liBotones, divRespuesta.firstElementChild.firstElementChild)
    //divRespuesta.firstElementChild.firstElementChild.appendChild(inputMenos);
    //divRespuesta.firstElementChild.firstElementChild.appendChild(inputMas);
}

// 6.1 Agrega botones quitar filas
function CrearBotonAnyadir(elementoUlOl)
{
    let inputMas =  document.createElement('button');
    inputMas.name = "addB";
    inputMas.type = "button";
    inputMas.src = "img/add.png";
    inputMas.style.width = "30px";
    inputMas.style.height = "30px";

    let imagenMas = document.createElement('img')
    imagenMas.src = "img/add.png";
    imagenMas.alt = "signo mas";
    imagenMas.style.width = "15px";
    imagenMas.style.height = "15px";
    inputMas.appendChild(imagenMas);

    elementoUlOl.firstElementChild.appendChild(inputMas);
    //console.log("Un evento " + event.type + ". Fase: " + event.eventPhase);
    inputMas.addEventListener('click', function(){ 
        console.log("Un evento " + event.type + ". Fase: " + event.eventPhase + " nombre elemento: " + this.name);
        GestionarFilas(inputMas, elementoUlOl);
        
    });
}

// 6.2 Agrega botones agregar filas
function CrearBotonQuitar(elementoUlOl) // si el numero de elementos es 2 te creo y añado al 
{
    let inputMas = document.getElementsByName('addB')[0];

    let inputMenos = document.createElement('button');
    inputMenos.name = "minusB";
    inputMenos.type = "button";
    inputMenos.style.width = "30px";
    inputMenos.style.height = "30px";
    
    let imagenMenos = document.createElement('img')
    imagenMenos.src = "img/minus.png";
    imagenMenos.alt = "signo menos";
    imagenMenos.style.width = "15px";
    imagenMenos.style.height = "15px";
    inputMenos.appendChild(imagenMenos);

    elementoUlOl.firstElementChild.insertBefore(inputMenos, inputMas);
   
    inputMenos.addEventListener('click', function(){ 
        console.log("Un evento " + event.type + ". Fase: " + event.eventPhase + " nombre elemento: " + this.name);
        GestionarFilas(inputMenos, elementoUlOl);
    });
}

function GestionarFilas(boton, elementoUlOl)
{
    let numeroElementos = elementoUlOl.children.length;
    let numeroElementosFuturos = numeroElementos;
    if(boton.name === "addB")
        numeroElementosFuturos++;
    if(boton.name === "minusB")
        numeroElementosFuturos--;

    let multiplicador=+document.getElementsByName('tabla')[0].value;
    console.log("presente:"+ numeroElementos +"Futuro:"+numeroElementosFuturos);

    
    if(boton.name === "addB") // pulsando+
    {
        if(numeroElementosFuturos <= 11) // si pulsando+ tengo un elemento 10+1
        {
            if(numeroElementos==1 && numeroElementosFuturos == 2) //si pulsando+ tengo 1+1
            {
                CrearBotonQuitar(elementoUlOl);
            }
            CrearElementosListaEditada(elementoUlOl, multiplicador, numeroElementos);
        }
        else
        {
            alert("No pueden haber más de 10 multiplicaciones")
            boton.parentNode.removeChild(boton);
        }
    }

    if(boton.name === "minusB") // pulsando -
    {
        if(numeroElementos ==2 && numeroElementosFuturos ==1) // pulsando -, tenemos 1+1 llega al 10, creamos minusB
            boton.parentNode.removeChild(boton);
        else if(numeroElementos == 11 && numeroElementosFuturos == 10) // pulsando -, tenemos 1+9 llegamos al 10, creamos minusB
            CrearBotonAnyadir(elementoUlOl)
        
        elementoUlOl.lastElementChild.parentNode.removeChild(elementoUlOl.lastElementChild);
    }

    if(elementoUlOl.firstElementChild.children.length == 3 && (numeroElementos == 10 || numeroElementos == 11))
        elementoUlOl.firstElementChild.removeChild(elementoUlOl.firstElementChild.lastElementChild);

}


//-----------------------------6/7/8 Editar, borrar y modificar filas-------------------------------//


// ADEMAS TE COMPRUEBO SI HAY 1 CUANDO BORRAS POR AQUI PARA ELIMINAR EL BOTON QUITAR FILAS.
function CrearElementosListaEditada(elementoUlOl, multiplicador, numeroElementos)
{
    let elementoLista = document.createElement('li');
    elementoLista.textContent = multiplicador + " x " + numeroElementos + " = " + multiplicador*numeroElementos;
    let borrarB = document.createElement('button');
    borrarB.type = "button";
    borrarB.className = "botonimagen";
    borrarB.addEventListener('click', function(){
        if(this.parentNode.previousElementSibling.id == "liBotones" && this.parentNode.parentNode.children.length == 2)
            this.parentNode.previousElementSibling.removeChild(this.parentNode.previousElementSibling.firstElementChild)
        
        console.log(this.parentNode.parentNode.children.length)
        
        this.parentNode.parentNode.removeChild(this.parentNode);
    });
    let modificarB = document.createElement('button')
    modificarB.className = 'botonModificar';
    modificarB.type = "button";
    modificarB.id = "botonModificar"+numeroElementos;
    elementoLista.appendChild(borrarB);
    elementoLista.appendChild(modificarB);
    
    modificarB.addEventListener('click', ModificarFila);  
    elementoUlOl.appendChild(elementoLista);
}

//-------------------------------8 modificar fila----------------------//
// HE PODIDO BORRAR EL TEXTO CON PREVIOUSSIBLING -> NO CON PREVIOUSELEMENTSIBLING (ES QUE ES TEXTO, NO UN ELEMENTO)
let ModificarFila = function(event) {
    console.log("Has pulsado: " + this.id + ". Fase: " + event.eventPhase + 
    " Tipo de evento " + event.type);

    let stringFila = this.parentNode.textContent.replaceAll(" ", "");
    event.stopPropagation();
    
    console.log(stringFila);
    
    //primer input y su numero
    let inputMultiplicadorModify = document.createElement('input');
    inputMultiplicadorModify.type = "text";
    inputMultiplicadorModify.name = "iMM";
    let posicionX=+stringFila.indexOf("x");
    inputMultiplicadorModify.value = stringFila.substring(0, posicionX);
    console.log(inputMultiplicadorModify.value);

    let spanX = document.createElement("span")
    spanX.id = "spanX";
    spanX.style.margin = "0,10"
    spanX.textContent = " x ";
    
    // segundo input y su numero
    let inputFilaModify = document.createElement('input');
    inputFilaModify.type = "text";
    inputFilaModify.name = "iFM";
    let posicionIgual=+stringFila.indexOf("=");
    inputFilaModify.value = stringFila.substring(posicionX+1, posicionIgual);
    console.log(inputFilaModify.value);

    let spanIgual = document.createElement("span")
    spanIgual.id = "spanIgual";
    spanX.style.margin = "0,10"
    spanIgual.textContent = " = ";
    
    // resultado multiplicacion
    let inputResultadoModify = document.createElement('input');
    inputResultadoModify.type = "text";
    inputResultadoModify.id = "iRM";
    inputResultadoModify.value = stringFila.substring(posicionIgual+1, stringFila.length);
    inputResultadoModify.disabled = true;
    console.log(inputResultadoModify.value);

    let guardarB =  document.createElement('button');
    guardarB.id = "guardarB";
    guardarB.type = "button";
    guardarB.src = "img/disco.png";
    guardarB.style.width = "30px";
    guardarB.style.height = "30px";

    let imagenGuardar = document.createElement('img');
    imagenGuardar.src = "img/disco.png";
    imagenGuardar.alt = "boton guardar";
    imagenGuardar.style.width = "30px";
    imagenGuardar.style.height = "30px";
    imagenGuardar.style.repeat = "no-repeat";
    imagenGuardar.style.backgroundPosition = "center";
    guardarB.appendChild(imagenGuardar);

   
    this.style.display = "none";
    this.previousElementSibling.style.display = "none";

    this.parentNode.appendChild(inputMultiplicadorModify);
    this.parentNode.appendChild(spanX);
    this.parentNode.appendChild(inputFilaModify);
    this.parentNode.appendChild(spanIgual);
    this.parentNode.appendChild(inputResultadoModify);
    this.parentNode.appendChild(guardarB);

    let thisModificarB = this;
    let thisBorrarB = this.previousElementSibling;
    thisBorrarB.previousSibling.parentNode.removeChild(thisBorrarB.previousSibling);

    
    guardarB.addEventListener('click', function(){
        ObtenerValor(thisModificarB, thisBorrarB, inputMultiplicadorModify, 
            spanX, inputFilaModify, spanIgual, inputResultadoModify,
            this);
    });
}

function ObtenerValor(thisModificarB, thisBorrarB, inputMultiplicadorModify, 
    spanX, inputFilaModify, spanIgual, inputResultadoModify,
    guardarB)
{
    
    let texto = inputMultiplicadorModify.value 
        + " x " + inputFilaModify.value + " = " + inputMultiplicadorModify.value*inputFilaModify.value; 

    let nodeTexto = document.createTextNode(texto);
    thisBorrarB.parentNode.insertBefore(nodeTexto, thisBorrarB);

    thisModificarB.style.display = "inline";
    thisBorrarB.style.display = "inline";
    
    inputMultiplicadorModify.parentNode.removeChild(inputMultiplicadorModify);
    spanX.parentNode.removeChild(spanX);
    inputFilaModify.parentNode.removeChild(inputFilaModify)
    spanIgual.parentNode.removeChild(spanIgual);
    inputResultadoModify.parentNode.removeChild(inputResultadoModify);
    guardarB.parentNode.removeChild(guardarB);
}

// 3.3 Tablas.
function CrearTablas(multiplicador, filas)
{
    let divRespuesta = document.getElementById('respuesta');
    let tabla = document.createElement('table');

    let filaTr;
    let celdaTd;
    let texto;
    let nodoTexto;

    for(let i=1; i<=filas; i++)
    {
        texto = multiplicador + " x " + i + " = " + multiplicador*i;
        
        filaTr = document.createElement('tr');
        celdaTd = document.createElement('td');
        nodoTexto = document.createTextNode(texto);
        tabla.appendChild(filaTr);
        celdaTd.appendChild(nodoTexto);
        filaTr.appendChild(celdaTd);
        celdaTd.style.border = "solid black 1px";
        celdaTd.style.padding= "1px";
    }
    tabla.style.border = "solid black 1px";
    tabla.style.textAlign= "center";
    divRespuesta.appendChild(tabla);

    tabla.addEventListener('click', Conversion);
    if (ValorRadioSiNo())
        tabla.removeEventListener('click', Conversion);
}

// 3.4 Select.
function CrearSelect(multiplicador, filas)
{
    //div respuesta <-- formulario
    let divRespuesta = document.getElementById('respuesta');
    
    let formulario = document.createElement('form');
    formulario.action = "p2.html";
    formulario.method = "get";
    formulario.name = "formularioSelect";
    divRespuesta.appendChild(formulario);

    // option <-- nodoTexto <-- texto
    
    //formulario <-- p
    let parrafo  = document.createElement('p');
    formulario.appendChild(parrafo);
    
    //p <-- label
    let etiqueta = document.createElement('label');
    parrafo.appendChild(etiqueta);
    
    //label <-- nodoLabel(con texto Multiplicar)
    let nodoTextoLabel = document.createTextNode("Multiplicar: ");    
    etiqueta.appendChild(nodoTextoLabel);
    
    //label <-- select
    let desplegable = document.createElement('select');
    etiqueta.appendChild(desplegable);
    let optionSelected;
    let textoNodoMultiplicar;
    let texto;
    for(let i=1; i<=filas; i++)
    {
        optionSelected = document.createElement('option');
        texto = multiplicador + " x " + i + " = " + multiplicador*i;
        // nodotexto <-- texto
        textoNodoMultiplicar = document.createTextNode(texto);
        //option <-- nodoTexto
        optionSelected.appendChild(textoNodoMultiplicar);
        //select <-- option
        desplegable.appendChild(optionSelected);
    }
    desplegable.addEventListener('change', Conversion);

    if (ValorRadioSiNo())
        desplegable.removeEventListener('click', Conversion);
}

//----------------------------------4. Conversion no editable-------------------------------//
function Conversion()
{
    if(this.id !== 'metodo') // si venimos de pulsar estructura
    {
        let desplegableEstructura = document.getElementsByName('metodo')[0];
        let desplegableEstructuraValor = desplegableEstructura.value;

        console.log("no metodo");
        switch(desplegableEstructuraValor)
        {
            case 'section':
                desplegableEstructura.value='ul';
                break;
            case'ul':
                desplegableEstructura.value='ol';
                break;
            case'ol':
                desplegableEstructura.value='table';
                break;
            case'table':
                desplegableEstructura.value='select';
                break;
            case 'select':
                desplegableEstructura.value='section'; 
                break;      
        }

        if(this.tagName ==='SELECT')
            this.parentNode.parentNode.parentNode.removeChild(this.parentNode.parentNode);
        else
            this.parentNode.removeChild(this);

        CrearNodos();
    }
    else // venimos cambio en el desplegable
    {
        let divRespuesta = document.getElementById('respuesta');
        console.log("no metodo");

        if(this.value != "") 
        {   
            // OJO: no es lo mismo firstChild(creo que referencia a un nodo(firstChild) que un Elemento(firstElementChild)) --> mirar mejor cuando puedas
            while(divRespuesta.children.length != 0)
                divRespuesta.removeChild(divRespuesta.firstElementChild); 
            
            CrearNodos();
        } 
    }
}


// desactiva el evento cambio del desplegable y habilita elementos del formulario

//------------------------------5 resetear formulario -------------------------------//
function Resetear()
{
    let inputFilas = document.getElementById('filas');
    let inputTabla = document.getElementById('tabla');
    let inputRadios = document.getElementsByName('editable');
    let botones = document.getElementsByClassName('btn');
    let desplegableMetodo = document.getElementsByName('metodo')[0];
    desplegableMetodo.removeEventListener('change', Conversion); 

    if(ValorRadioSiNo())
    {    
        inputTabla.disabled = false;
        desplegableMetodo.disabled = false;
    }

    inputFilas.disabled = false;
    inputFilas.value = "";
    inputTabla.disabled = false;
    inputTabla.value = "";
    for(let radio of inputRadios)
    {
        if(radio.checked)
            radio.checked = false;
        radio.disabled = false;
    }
    for(let boton of botones)
    {
        if(boton.name === "btn_lanzar")
            boton.style.display = "inline-block";
        if(boton.name === "btn_reset")
        {
            boton.style.display = "none";
        }
    }
    let divRespuesta = document.getElementById('respuesta'); 
    
    if(divRespuesta.firstElementChild)
        divRespuesta.removeChild(divRespuesta.firstElementChild);       
}
