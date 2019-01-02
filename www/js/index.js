/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');


    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);

        function editSelects(event) {
            document.getElementById('choose-sel').removeAttribute('modifier');
            if (event.target.value == 'material' || event.target.value == 'underbar') {
                document.getElementById('choose-sel').setAttribute('modifier', event.target.value);
            }
        }
        function addOption(event) {
            const option = document.createElement('option');
            var text = document.getElementById('optionLabel').value;
            option.innerText = text;
            text = '';
            document.getElementById('dynamic-sel').appendChild(option);
        }



    }
};
$(document).ready(function() {
    carga_preguntas();
    dibuja();

   $( document ).on( 'click','#main-enciclopedia-detalle .next', function() {
       
        datas_detalle('next');
    });
    $( document ).on( 'click','#main-enciclopedia-detalle .back', function() {
        datas_detalle('back');
    });

    $( document ).on( 'click','#list-filtro ons-col', function(e) {
        var id_seccion = $(this).attr('id_seccion')
         localStorage.setItem("detalle", id_seccion);
          window.fn.load('detalle.html');

    });
    $( document ).on( 'click','.respuesta.marco', function(e) {
        var res = $(this).attr('res');
        var pre = $(this).attr('pregunta');
        pregunta(res,pre);
    });


    $( document ).on('change','#choose-sel select',function() {
        datas('no',$(this).val(),'no');
    });

   /* setTimeout(function() {
        navigator.splashscreen.hide();
    }, 2000);*/

});
function categorias(){
    $.ajax({
        method: "POST",
        url:'https://app.kantaur.com/scripts/conexiones_app/categorias.php',
        data: ({id:'3'}),
        dataType: "json",
        success: function(resp){
            $.each(resp.categorias, function(k,v) {
                $('#choose-sel select').append($('<option>', {
                    value: v.id,
                    text: v.titulo
                }));
            });
        },
        error: function(){

        }
    });
}
function datas(id,filtro,direccion){
    /*******limpiamos lo que hay de antes*******************/
    $('#list-filtro').find('ons-col').remove();

    $.ajax({
        method: "POST",
        url:'https://app.kantaur.com/scripts/conexiones_app/index.php',
        data: ({id:id,filtro:filtro,direccion:direccion}),
        dataType: "json",
        success: function(resp){
            $('#list-filtro').append(resp.listado);

        },
        error: function(){

        }
    });
}
function datas_detalle(direccion){
    /*******limpiamos lo que hay de antes*******************/
    $('#list-filtro').find('ons-col').remove();
   var filtro = localStorage.getItem('detalle');

    $.ajax({
        method: "POST",
        url:'https://app.kantaur.com/scripts/conexiones_app/detalle.php',
        data: ({filtro:filtro,direccion:direccion}),
        dataType: "json",
        success: function(resp){
            
            localStorage.removeItem('detalle');
            localStorage.setItem("detalle", resp.id);
            var id_seccion = localStorage.getItem('detalle');
            
            $('#main-enciclopedia-detalle h2 span').text(resp.titulo);
            $('#main-enciclopedia-detalle h3').text(resp.titulo_detalle);
            $('#main-enciclopedia-detalle .imagen img').attr('src',resp.imagen.imagen);
            $('#main-enciclopedia-detalle .textos').html(resp.descripcion);
            $('#main-enciclopedia-detalle').find('.right').addClass('next');
            $('#main-enciclopedia-detalle').find('.left').addClass('back');
            if(resp.sitio =="ultimo"){
                     $('#main-enciclopedia-detalle').find('.back').removeClass('back');
            }
            if(resp.sitio =="primero"){
                    $('#main-enciclopedia-detalle').find('.next').removeClass('next');   
            }
           

        },
        error: function(){

        }
    });
}
function carga_preguntas(){
    $.ajax({
        method: "POST",
        url:'https://app.kantaur.com/scripts/conexiones_app/preguntas.php',
        dataType: "json",
        success: function(resp){
            var datas=  JSON.stringify(resp);
            localStorage.setItem("todas_preguntas", datas);

        },
        error: function(){

        }
    });
}
function dibuja(){
   /*******************************/

    $.ajax({
        url:'js/preguntas.js',
        dataType: "script",
        success: function(resp){
            var contenido="";
            var todas = localStorage.getItem("todas_preguntas");
            $.each( JSON.parse(todas), function( key, value ) {

                var pregunta_contestada = localStorage.getItem("pregunta"+value.id);
             //  console.log(pregunta_contestada);
               if(!pregunta_contestada) {
                   contenido += ' <div class="pregunta marco">' +
                       '                <div class="pregunta-content">' +
                       '                    <div class="content text-center">' +
                       '                        <i class="fas fa-map-marker mark"><span>a</span></i>' +
                       '                          ' + value.titulo +
                       '                    </div>' +
                       '                </div>' +
                       '            </div>' +
                       '            <div class="respuestas">' +
                       '                <ons-row>' +
                       '                    <ons-col   align="center">' +
                       '                        <div class="respuesta marco"  pregunta="' + value.id + '" res="' + value.preguntas.respuesta1.valor + '"  >' +
                       '                            <div class="respuesta-content">' +
                       '                                <div class="content text-center">' +
                       '                                    <i class="fas fa-map-marker mark"><span>a</span></i>' +
                       '                                    ' + value.preguntas.respuesta1.respuesta +
                       '                                </div>' +
                       '                            </div>' +
                       '                        </div> ' +
                       '                    </ons-col> ' +
                       '                    <ons-col >' +
                       '                        <div class="respuesta marco " pregunta="' + value.id + '" res="' + value.preguntas.respuesta2.valor + '" >' +
                       '                            <div class="respuesta-content">\n' +
                       '                                <div class="content text-center">' +
                       '                                    <i class="fas fa-map-marker mark"><span>a</span></i>' +
                       '                                    ' + value.preguntas.respuesta2.respuesta +
                       '                                </div>' +
                       '                            </div>' +
                       '                        </div>' +
                       '                    </ons-col>' +
                       '                </ons-row>' +
                       '                <ons-row>' +
                       '                    <ons-col   align="center">' +
                       '                        <div class="respuesta marco"  pregunta="' + value.id + '" res="' + value.preguntas.respuesta3.valor + '"  >' +
                       '                            <div class="respuesta-content">' +
                       '                                <div class="content text-center">' +
                       '                                    <i class="fas fa-map-marker mark"><span>a</span></i>' +
                       '                                    ' + value.preguntas.respuesta3.respuesta +
                       '                                </div>' +
                       '                            </div>' +
                       '                        </div> ' +
                       '                    </ons-col> ' +
                       '                    <ons-col >' +
                       '                        <div class="respuesta marco " pregunta="' + value.id + '" res="' + value.preguntas.respuesta4.valor + '" >' +
                       '                            <div class="respuesta-content">\n' +
                       '                                <div class="content text-center">' +
                       '                                    <i class="fas fa-map-marker mark"><span>a</span></i>' +
                       '                                    ' + value.preguntas.respuesta4.respuesta +
                       '                                </div>' +
                       '                            </div>' +
                       '                        </div>' +
                       '                    </ons-col>' +
                       '                </ons-row>' +
                       '            </div>';
               }

            });
            if(contenido){
                $(document).find('#preguntasContenido').append(contenido);
            }

            //**comprobamos si ya ha resuelto todas las preguntas***/



        },
        error: function(){

        }
    });
   /*******************************/

   // $('#preguntasContenido').append(contenido);

}
function vaciar_juego(){
    var todas = localStorage.getItem("todas_preguntas");

    $.ajax({
        url:'js/preguntas.js',
        dataType: "script",
        success: function(resp){

        },
        error: function(){

        }
    });


}
function comprobar_preguntas(){
    var todas = localStorage.getItem("todas_preguntas");
    var contador = [];
    var todas_cont = 0;
    var respondidas=0;
    $.each( JSON.parse(todas), function( key, value ) {

        var cada = localStorage.getItem("pregunta"+value.id);

        if(cada ||cada != 'undefined'){
            respondidas++;
        }
        todas_cont++;
    });
    if(respondidas == todas_cont){
       return true;
    }else{
        return false;
    }

}
function pregunta(res,id_pregunta){
    //ha hecho click en la pregunnta
     var preguntas = [];
      preguntas[id_pregunta] = res;

    localStorage.setItem("pregunta"+id_pregunta, JSON.stringify(res));
   var  veo = JSON.parse(localStorage.getItem("pregunta"+id_pregunta));
    //console.log(typeof veo); //object
   // console.log(veo); //object
}