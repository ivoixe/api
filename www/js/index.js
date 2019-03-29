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


    localStorage.setItem('jugando',true);
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
        ons.notification.alert('');

        pregunta(res,pre);
        var mensaje = last_ans();

       if(mensaje==true){
           ons.notification.alert('Emaitza');
           localStorage.setItem('jugando',false);
       }else{
           ons.notification.alert('Hurrengo galdera');
       }

    });
    $( document ).on( 'change','#choose-sel-interactua select', function(e) {
            var carga = $(this).val();

            interactua(carga);
    });






    $( document ).on('change','#choose-sel select',function() {
        datas('no',$(this).val(),'no');
    });

   /* setTimeout(function() {
        navigator.splashscreen.hide();
    }, 2000);*/


    //valido si no funciona el ultimo
    /*$(document).on('click','#main-enciclopedia-detalle .imagen a',function(e) {
        e.preventDefault();
        var imagen=$(this).attr('data-zoom-image');

        $('#light').show();
       // $('#light').append('<div class=""><img src="'+imagen+'"/></div>');
    });*/

});
function carga_seccion(){
    $.ajax({
        method: "POST",
        url:'https://www.kantaur.com/scripts/conexiones_app/seccion.php',
        data: ({id_sec:'4'}),
        dataType: "json",
        success: function(resultado){
            $('#main-aholkuak h1 span').text(resultado.titulo);
            $('#main-aholkuak .textos').html(resultado.descripcion);
            $('#main-aholkuak .imagen img').attr('src',resultado.imagen.imagen);
        },
        error: function(){

        }
    });
}
function consejos(){
    $.ajax({
        method: "POST",
        url:'https://www.kantaur.com/scripts/conexiones_app/consejos.php',
        data: ({id:'3'}),
        dataType: "json",
        success: function(resp){
            $.each(resp, function(k,v) {

                //onclick="fn.load('detalle.html')"
             /*     <img src="mini.jpg" width="200" height="200"
      class="reel"
      id="image"
      data-images="mini/###.jpg"
      data-frames="20"
      data-frame="14"
      data-rows="6"
      data-row="3"
      data-speed="0.3">>*/


               $('#main-hondakinak .content-content').append('<ons-row >' +
                    '                        <ons-col class="left"  id="urlcute" align="center">' +
                    '                            <div class="imagen  result  ">' +
                    '                                <img  id="image_1" class=" img-responsive" src="'+v.imagen+'"  >' +
                    '                            </div>' +
                    '                        </ons-col>' +
                    '                        <ons-col class="texto">' +
                    '                            <p>'+v.titulo+'</p>' +
                    '                        </ons-col>' +
                    '                    </ons-row>'
                );


            });
        },
        error: function(){

        }
    });
}
function categorias(){
    $.ajax({
        method: "POST",
        url:'https://www.kantaur.com/scripts/conexiones_app/categorias.php',
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
function categorias_interactua(){
    $.ajax({
        method: "POST",
        url:'https://www.kantaur.com/scripts/conexiones_app/categorias_interactua.php',
        data: ({id:'3'}),
        dataType: "json",
        success: function(resp){
            $.each(resp.categorias, function(k,v) {
                $('#choose-sel-interactua select').append($('<option>', {
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
        url:'https://www.kantaur.com/scripts/conexiones_app/index.php',
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
        url:'https://www.kantaur.com/scripts/conexiones_app/detalle.php',
        data: ({filtro:filtro,direccion:direccion}),
        dataType: "json",
        success: function(resp){

            $(document).find('.zoom a').colorbox({
                width:'100%',
                height:'100%',
                maxWidth:'100%',
                maxHeight:'100%',
                'onComplete': function(){
                    $('#cboxLoadedContent').zoom({ on:'click' });
                }
            });

           /**********************************/

            localStorage.removeItem('detalle');
            localStorage.setItem("detalle", resp.id);
            var id_seccion = localStorage.getItem('detalle');
           // console.log(resp.imagen.small);
            $('#main-enciclopedia-detalle h2 span').text(resp.titulo);
            $('#main-enciclopedia-detalle h3').text(resp.titulo_detalle);
            $('#main-enciclopedia-detalle .imagen img').attr('src',resp.imagen.small.imagen);
           // $('#main-enciclopedia-detalle .imagen img').addClass('reel');

           // img-src="'+v.imagen+'" data-images="'+v.demas+'/###_original.jpg"   data-frame="14" data-rows="6" data-speed="0.3"  data-frames="20" data-footage="4"  width="126" height="126" data-revolution="800"
            $('#main-enciclopedia-detalle .imagen a').attr('href',resp.imagen.imagen);
            $('#main-enciclopedia-detalle .textos').html(resp.descripcion);
            $('#main-enciclopedia-detalle').find('.right').addClass('next');
            $('#main-enciclopedia-detalle').find('.left').addClass('back');
            if(resp.sitio =="ultimo"){
                     $(document).find('#main-enciclopedia-detalle .back').removeClass('back');
            }
            if(resp.sitio =="primero"){
                $(document).find('#main-enciclopedia-detalle .next').removeClass('next');
                /*
                $easyzoom = $(document).find('.easyzoom').easyZoom();
                var api = $easyzoom.data('easyZoom');
                $(document).find('.easyzoom').show();*/

            }
          //  $(document).find("#image-detalle").reel({});

        },
        error: function(){

        }
    });
}
function interactua(categoria){
    console.log(categoria);
    /*******limpiamos lo que hay de antes*******************/
    $('#main-interactua.imagen a').attr('href','');
    $('#main-interactua .textos').html('');
    $('#main-interactua .photo_3d img').remove();
    $('#main-interactua h2 span').text('');
    $('#main-interactua h3').text('');
    $.ajax({
        method: "POST",
        url:'https://www.kantaur.com/scripts/conexiones_app/interactua.php',
        data: ({id:categoria}),
        dataType: "json",
        success: function(resp){
        console.log(resp.imagen.dataimages);
            $(document).find('.zoom a').colorbox({
                width:'100%',
                height:'100%',
                maxWidth:'100%',
                maxHeight:'100%',
                'onComplete': function(){
                    $('#cboxLoadedContent').zoom({ on:'click' });
                }
            });

            /**********************************/
           /* src="mini.jpg" width="200" height="200"
        class="reel"
            id="image"
            data-images="mini/###.jpg"*/

            $(document).find('#img-interactua');
           //  console.log(resp);
          //  $('#main-interactua h2 span').text(resp.titulo);
           // $('#main-interactua h3').text(resp.titulo_detalle);
          //  $('#main-interactua .imagen img').attr('src',resp.imagen.dataimages+'/0.jpg');
         //   $('#main-interactua .imagen img').attr('data-images',resp.imagen.dataimages+'/###.jpg');
           // img-interactua

            // $('#main-enciclopedia-detalle .imagen img').addClass('reel');

            // img-src="'+v.imagen+'" data-images="'+v.demas+'/###_original.jpg"   data-frame="14" data-rows="6" data-speed="0.3"  data-frames="20" data-footage="4"  width="126" height="126" data-revolution="800"
            $('#main-interactua.imagen a').attr('href',resp.imagen.imagen);
            $('#main-interactua .textos').html(resp.descripcion);

            $(document).find('.photo_3d').rotate3d({
                'source': resp.imagen.dataimages,
                'count' : 23,
                'ext' : '.png',
                 'speed': 10,
            });
            $(document).find('.photo_3d').css({'posimgition:relative':'z-index:9999999'})
            $(document).find('.photo_3d').find('img').css('max-width','100%')


            //  $(document).find("#image-detalle").reel({});
           /* $(document).find('#img-interactua').reel();
            $(document).find('#img-interactua').css('background-size','inherit');
            $.reel.def.indicator = 5;*/
        },
        error: function(){

        }
    });
}
function carga_preguntas(){
    $.ajax({
        method: "POST",
        url:'https://www.kantaur.com/scripts/conexiones_app/preguntas.php',
        dataType: "json",
        success: function(resp){
            var datas=  JSON.stringify(resp);
            localStorage.removeItem("todas_preguntas");
            localStorage.setItem("todas_preguntas", datas);
        },
        error: function(){

        }
    });
}
function dibuja(){
   /*******************************/
    $(document).find('#preguntasContenido').html('');
    $.ajax({
        url:location.href,
        dataType: "html",
        type:'GET',
        success: function(resp){
            var contenido="";
            var todas = localStorage.getItem("todas_preguntas");
            var index = 1;
            var hidden= '';

            $.each( JSON.parse(todas), function( key, value ) {
                var pregunta_contestada = localStorage.getItem("pregunta"+value.id);

                hidden='';
               if(!pregunta_contestada) {
                    if(index != 1){
                        hidden='hidden';
                    }
                   contenido += ' <div class="pregunta marco '+hidden+'" >' +
                       '                <div class="pregunta-content">' +
                       '                    <div class="content text-center">' +
                       '                        <i class="fas fa-map-marker mark"><span>a</span></i>' +
                       '                          ' + value.titulo +
                       '                    </div>' +
                       '                </div>' +
                       '            </div>' +
                       '            <div class="respuestas '+hidden+'">' +
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
                       '                                    <i class="fas fa-map-marker mark"><span>b</span></i>' +
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
                       '                                    <i class="fas fa-map-marker mark"><span>c</span></i>' +
                       '                                    ' + value.preguntas.respuesta3.respuesta +
                       '                                </div>' +
                       '                            </div>' +
                       '                        </div> ' +
                       '                    </ons-col> ' +
                       '                    <ons-col >' +
                       '                        <div class="respuesta marco " pregunta="' + value.id + '" res="' + value.preguntas.respuesta4.valor + '" >' +
                       '                            <div class="respuesta-content">\n' +
                       '                                <div class="content text-center">' +
                       '                                    <i class="fas fa-map-marker mark"><span>d</span></i>' +
                       '                                    ' + value.preguntas.respuesta4.respuesta +
                       '                                </div>' +
                       '                            </div>' +
                       '                        </div>' +
                       '                    </ons-col>' +
                       '                </ons-row>' +
                       '            </div>';
                   index++;
               }

            });
            if(contenido){
                $(document).find('#preguntasContenido').append(contenido);

            }else{
               var todas_contestadas= comprobar_preguntas();
              var jugando=  localStorage.getItem('jugando');
               if(todas_contestadas == true ){
                   window.fn.load('resultado.html');


               }
            }

            //**comprobamos si ya ha resuelto todas las preguntas***/



        },
        error: function(e){

          //  alert(window.location.pathname);
           alert('error'+e.status);

        }
    });
   /*******************************/

   // $('#preguntasContenido').append(contenido);

}

function vaciar_juego(){
    var todas = localStorage.getItem("todas_preguntas");

    $.ajax({
        url:location.href,
        dataType: "html",
        type:'GET',
        success: function(resp){
            var content = document.getElementById('content');
            var todas = localStorage.getItem("todas_preguntas");
            $.each( JSON.parse(todas), function( key, value ) {
               // console.log(localStorage.getItem("pregunta"+value.id));
                localStorage.removeItem("pregunta"+value.id);
            });
           // dibuja();
        },
        error: function(e){
            alert('error'+e.status);
        }
    });


}
function vaciar_juego_preguntas(){
    var todas = localStorage.getItem("todas_preguntas");

    $.ajax({
        url:location.href,
        dataType: "html",
        type:'GET',
        success: function(resp){
            var content = document.getElementById('content');
            var todas = localStorage.getItem("todas_preguntas");
            $.each( JSON.parse(todas), function( key, value ) {
                // console.log(localStorage.getItem("pregunta"+value.id));
                localStorage.removeItem("pregunta"+value.id);
            });
            // dibuja();
        },
        error: function(e){
            alert('error'+e.status);
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

        if(cada ){
            respondidas++;
        }
        todas_cont++;
    });
    if(respondidas == todas_cont){

       return true;
    }else{
      //  dibuja();
        return false;
    }

}
function last_ans(){
    var todas = localStorage.getItem("todas_preguntas");
    var contador = [];
    var todas_cont = 0;
    var respondidas=0;
    $.each( JSON.parse(todas), function( key, value ) {

        var cada = localStorage.getItem("pregunta"+value.id);

        if(cada ){
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
function datos_resultado(){
    var todas = localStorage.getItem("todas_preguntas");
    var malas = 0;
    var num_partidas = 0;
    var buenas = 0;
    var historial =[];
    var respondidas=0;
    var todas_count=0;
    var part = [];
    var tiempo= new Date().getTime();

    $.each( JSON.parse(todas), function( key, value ) {
        var cada = localStorage.getItem("pregunta"+value.id);

        if(cada == '"respuesta_correcta"'){
            buenas ++;
        }
        todas_count ++;
    });

    var res_num= buenas * 10 /todas_count;

    historial = JSON.parse(localStorage.getItem("partidas"));
    if(!historial){
        part.push(res_num);
        localStorage.setItem('partidas', JSON.stringify(part));
    }else{
        /*********vemos las anteriores**********************/
        var itemsArray = [];
        var comparacion= 0;

        $.each(historial, function (key, value) {
            itemsArray.push(value);

        });
        itemsArray.push(res_num);

        localStorage.setItem('partidas', JSON.stringify(itemsArray));

    }
    historial = JSON.parse(localStorage.getItem("partidas"));
    var suma_media= 0;
    if(historial){
        $.each(historial, function (key, value) {
            if(value > comparacion){
                comparacion = value;
                suma_media = suma_media + (value*1);
            }
            num_partidas ++;
        });
    }else{
        comparacion = suma_media;
    }


    var media = suma_media/num_partidas ;
    var n = media.toFixed(1);
    var texto ="";
    var icono ="";
    $.ajax({
        url:location.href,
        dataType: "html",
        type:'GET',
        success: function(resp){

            if(res_num > 7){
               icono="fa-thumbs-up";
               texto="BIKAIN!";
            }
            if(res_num < 7 && res_num > 4){
                icono="fa-thumbs-up";
                texto="LEHENENGO HOBETZEA!";
            }
            if(res_num < 5){
                icono="fa-thumbs-down";
                texto="Saiatu berriro!";
            }
            $('#texto-res').text(texto);
            $('.total .fas').addClass(icono);
            $('#resultado_numero').text(res_num);
            $('#partidas').text(num_partidas);
            $('#hoberena').text(comparacion);
            $('#ranking').text(n);
            vaciar_juego_preguntas();
        },
        error: function(e){
            alert('error'+e.status);
        }
    });



}
function pregunta(res,id_pregunta){
    //ha hecho click en la pregunnta
     var preguntas = [];
      preguntas[id_pregunta] = res;
    localStorage.setItem("pregunta"+id_pregunta, JSON.stringify(res));
    dibuja();
   var  veo = JSON.parse(localStorage.getItem("pregunta"+id_pregunta));
    //console.log(typeof veo); //object
   // console.log(veo); //object
  //  var comprobacion = carga_preguntas();
   // return comprobacion;
}
