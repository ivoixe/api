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
$( document ).ready(function() {
    $( document ).on( 'click','#main-enciclopedia-detalle .next', function() {
        var id= ('#main-enciclopedia-detalle').attr('sec_id');
        var filtro= ('#main-enciclopedia-detalle').attr('filtro');
        datas(id,fitlro,'next');
    });
    $( document ).on( 'click','#main-enciclopedia-detalle .back', function() {
        var id= ('#main-enciclopedia-detalle').attr('sec_id');
        var filtro= ('#main-enciclopedia-detalle').attr('filtro');
        datas(id,fitlro,'back');

    });
    $( document ).on('change','#choose-sel select',function() {
        datas('',$(this).val(),'');

    });
    setTimeout(function() {
        navigator.splashscreen.hide();
    }, 2000);



});
function datas(id,fitlro,direccion){
    $.ajax({
        method: "POST",
        url:'http://app-connecting.prismacm.com/save_host_nube.php',
        data: ({id:id,filtro:filtro,direccion:direccion}),
        dataType: "json",
        success: function(resp){

        },
        error: function(){

        }
    });
}