/* eslint-disable quotes */
/* globals app, nataUIDialog,nata, doT, swal, axios */
app.aseguradora = {
    index: function () {
        console.log( "%c app.aseguradoras.index", "background:red;color:#fff;font-size:11px");        
        const asegurador = nata.localStorage.getItem("aseguradores-informe");  
        
        app.core.dialog.removeAll();

        const template = `
            <div class="mb-3">
                <input type="text" id="filterInput" class="form-control" placeholder="Filtrar por ID, NIT o Asegurador">
            </div>
            <table class="table" id="tableAsegurador">
                <colgroup>
                    <col width="10">
                    <col width="20">
                    <col width="100">
                    <col width="50">
                </colgroup>
                <thead>
                    <tr>
                        <th scope="col">ID</th>
                        <th scope="col">NIT</th>
                        <th scope="col">Asegurador</th>
                        <th scope="col"></th>
                    </tr>
                </thead>
                <tbody id="tableBody">
                {{~ it.detail:d:i }}
                    <tr>
                        <th>{{=d.id}}</th>
                        <td>{{=d.an}}</td>
                        <td>{{=d.am}}</td>
                        <td> 
                            <div class="btn-group me-2" role="group" aria-label="First group">
                                <button type="button" class="btn btn-primary btn-detalle-asegurador"
                                    data-id="{{=d.an}}"
                                    data-id-tipo="soat">
                                    <svg class="btn-detalle-asegurador" data-id-tipo="soat" data-id="{{=d.an}}"  xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                        <path class="btn-detalle-asegurador" data-id-tipo="soat" data-id="{{=d.an}}" stroke-linecap="round" stroke-linejoin="round" d="m15.75 15.75-2.489-2.489m0 0a3.375 3.375 0 1 0-4.773-4.773 3.375 3.375 0 0 0 4.774 4.774ZM21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                    </svg>
                                </button>
                            </div>
                        </td>                            
                    </tr>
                {{~}}
                </tbody>
            </table>
        `;

        const html = doT.template(template)({ detail: asegurador });
        new nataUIDialog({
            html: html,
            title: `
                Control Aseguradoras
            `,
            events: {
                render: function () { 
                    const filterInput = document.getElementById("filterInput");
                    const tableBody = document.getElementById("tableBody");
                    
                    filterInput.addEventListener("keyup", function() {
                        const filterValue = this.value.toLowerCase();
                        const rows = tableBody.getElementsByTagName("tr");

                        Array.from(rows).forEach(row => {
                            const id = row.cells[0].textContent.toLowerCase();
                            const nit = row.cells[1].textContent.toLowerCase();
                            const asegurador = row.cells[2].textContent.toLowerCase();

                            if (id.includes(filterValue) || nit.includes(filterValue) || asegurador.includes(filterValue)) {
                                row.style.display = "";
                            } else {
                                row.style.display = "none";
                            }
                        });
                    });
                },
                close: function () { },
            }
        });

        document.querySelector("#tableAsegurador").addEventListener("click", function (event) {
            event.preventDefault();
            event.stopPropagation();

            const element = event.target;
            const id = element.dataset.id;
            console.log(id);

            if(element.classList.contains("btn-detalle-asegurador")){
                app.core.dialog.removeAll();

                axios.get(app.config.server.php1 + "x=asegurador&k=aseguradorGet_v1&z=1&w=0&y=" + id)
                    .then(function (response) {
                        console.log(response.data);

                        const templateOperacion = `
                            <table class="table" id="tableOperacion">
                                <colgroup>
                                    <col width="10">
                                    <col width="200">
                                    <col width="50">
                                </colgroup>
                                <thead>
                                    <tr>
                                        <th scope="col">ID</th>
                                        <th scope="col">Operación</th>
                                        <th scope="col"></th>
                                    </tr>
                                </thead>
                                <tbody id="tableBody">
                                {{~ it.detail:d:i }}
                                    <tr>
                                        <th>{{=d.ope_id}}</th>
                                        <td>{{=d.ope_nombre}}</td>
                                        <td> 
                                            <div class="btn-group me-2" role="group" aria-label="First group">
                                                <button type="button" class="btn btn-primary btn-detalle-operacion"
                                                    data-id="{{=d.ope_id}}"
                                                    data-id-tipo="soat">
                                                    <svg class="btn-detalle-operacion" data-id-tipo="soat" data-id="{{=d.ope_id}}"  xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                                        <path class="btn-detalle-operacion" data-id-tipo="soat" data-id="{{=d.ope_id}}" stroke-linecap="round" stroke-linejoin="round" d="m15.75 15.75-2.489-2.489m0 0a3.375 3.375 0 1 0-4.773-4.773 3.375 3.375 0 0 0 4.774 4.774ZM21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>                            
                                    </tr>
                                {{~}}
                                </tbody>
                            </table>
                        `;

                        const htmlOperacion = doT.template(templateOperacion)({ detail: response.data });
                        new nataUIDialog({
                            height: 410,
                            width: 600,
                            html: htmlOperacion,
                            title: `
                                Operaciones
                            `,
                            events: {
                                render: function () { },
                                close: function () { },
                            }
                        });

                        
                        document.querySelector("#tableOperacion").addEventListener("click", function (event) {
                            event.preventDefault();
                            event.stopPropagation();

                            const element = event.target;
                            const operacion = element.dataset.id;
                            console.log(operacion);
                            console.log(element);

                            if(element.classList.contains("btn-detalle-operacion")){
                                axios.get(app.config.server.php1 + "x=asegurador&k=aseguradorGet_v1&z=2&w=" + operacion + "&y=" + id)
                                    .then(function (response) {
                                        console.log(response.data);
                                
                                        if (!response.data || response.data.length === 0) {
                                            swal(app.config.title, "No se tienen datos del asegurador, Solicitar accesos!", "info");
                                            return;
                                        }
                                
                                        let details = response.data.map(row => {
                                            let detailHtml = `<ul class="list-group list-group-flush">`;
                                
                                            if (row.ap) {
                                                detailHtml += `
                                                    <li class="list-group-item">
                                                        <b>(${row.ptp})</b> <a href="${row.ap}" target="_blank">Link plataforma</a>
                                                    </li>
                                                `;
                                            }
                                
                                            if (row.pusu) {
                                                detailHtml += `
                                                    <li class="list-group-item">
                                                        Usuario: ${row.pusu} &nbsp&nbsp
                                                        <button class="btn btn-sm btn-outline-primary copy-btn" data-copy="${row.pusu}" title="Copiar Usuario">
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                                                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
                                                            </svg>
                                                        </button>
                                                    </li>
                                                `;
                                            }
                                
                                            if (row.ppas) {
                                                detailHtml += `
                                                    <li class="list-group-item">
                                                        Contraseña: ${row.ppas} &nbsp&nbsp
                                                        <button class="btn btn-sm btn-outline-primary copy-btn" data-copy="${row.ppas}" title="Copiar Contraseña">
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                                                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
                                                            </svg>
                                                        </button>
                                                    </li>
                                                `;
                                            }
                                
                                            if (row.pem) {
                                                detailHtml += `
                                                    <li class="list-group-item">
                                                        <b>(${row.ptp})</b> Correo de solicitud: ${row.pem} &nbsp&nbsp
                                                        <button class="btn btn-sm btn-outline-primary copy-btn" data-copy="${row.pem}" title="Copiar Correo">
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                                                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
                                                            </svg>
                                                        </button>
                                                    </li>
                                                `;
                                            }

                                            if(operacion == 3 || operacion == 1) {
                                                detailHtml += `
                                                    <li class="list-group-item">
                                                        <b><a href="javascript:void(0);" onclick="app.wizard.documentacion.operacionesAseguradoras(${operacion}, ${id});">Ver Documentación</a></b>
                                                    </li>
                                                    <!--<li class="list-group-item">
                                                        <b><a href="javascript:void(0);" onclick="app.wizard.documentacion.notasRapidas(${operacion}, ${id});">Ver Documentación</a></b>
                                                    </li>-->
                                                `
                                            }
                                
                                            detailHtml += `</ul><br/>`;
                                            return detailHtml;
                                        });
                                
                                        const template = `
                                            <div class="scroll-x">
                                                <h6>Información del Asegurador</h6>
                                                ${details.join('')}
                                            </div>
                                        `;
                                
                                        const html = doT.template(template)({ detail: response.data });
                                
                                        new nataUIDialog({
                                            height: 410,
                                            width: 600,
                                            html: html,
                                            title: `Ingreso Plataforma Aseguradora &nbsp&nbsp
                                                <span class="badge rounded-pill text-bg-primary">
                                                    <b>NIT: </b>${response.data[0].n}
                                                </span>
                                            `,
                                            events: {
                                                render: function () {
                                                    document.querySelectorAll('.copy-btn').forEach(button => {
                                                        button.addEventListener('click', function () {
                                                            const textToCopy = this.getAttribute('data-copy');
                                                            const originalIcon = this.innerHTML;
                                                
                                                            navigator.clipboard.writeText(textToCopy).then(() => {
                                                                this.innerHTML = `
                                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                                                        <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                                                    </svg>
                                                                `;
                                                
                                                                setTimeout(() => {
                                                                    this.innerHTML = originalIcon;
                                                                }, 500);
                                                
                                                            }).catch(error => {
                                                                swal(app.config.title, "Error al copiar texto", "error");
                                                            });
                                                        });
                                                    });
                                                },
                                                
                                                close: function () { },
                                            }
                                        });


                                
                                    })
                                    .catch(function (error) {
                                        console.error(error);
                                    });
                            }    
                        });
                    })
                    .catch(function (error){
                        console.error(error);
                    });
            }   
        });     
    },
    driveHomi : function () {
        console.log( "%c app.aseguradora.driveHomi", "background:red;color:#fff;font-size:11px");  

        const html = `
            <div class="scroll-x">
                <a href="https://fundacionhomi-my.sharepoint.com/:x:/g/personal/cartera_homifundacion_org_co/ETjVg672x8JGiT8gWvS6PJcBWWwdOPeyusIjFYiBa-EN7A?e=4%3AdORX5M&at=9" target="new_">Drive HOMI</a><br><br>
                Ingresar el correo de: <small><b>gerencia.salud@crescend.software</b></small><br>
                Ir al link del correo para obtener el codigo:
                <a href="https://crescend.software:2096/" target="new_">Correo Crescend</a><br>
                Usuario: <small><b>gerencia.salud@crescend.software</b></small><br>
                Contraseña: <small><b>ZQF@a7Xz1hKUsqgEpY</b></small><br><br>
            </div>
        `;    

        new nataUIDialog({
            height: 300,
            width: 600,
            html: html,
            title: `
                Ingreso Drive
            `,
            events: {
                render: function () { },
                close: function () { },
            }
        });

    },

    estadoRadicacionAdres: function () {
        console.log("%c app.aseguradora.estadoRadicacionAdres", "background:red;color:#fff;font-size:11px");
    
        const html = `
            <div class="scroll-x">
                <div class="chat-container">
                    <!-- Chat Header -->
                    <div class="chat-header">
                        Actualizar Estado Radicación
                    </div>
    
                    <!-- Chat Body -->
                    <div class="chat-body" id="chatBody">
                        <!-- Aquí se agregarán los mensajes -->
                    </div>
    
                    <!-- Input field con botón de envío -->
                    <div class="chat-footer">
                        <input type="text" class="input-option" id="userInput" placeholder="Mensaje" disabled />
                        <button class="send-button" id="sendButton" disabled>
                            <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                <path fill-rule="evenodd" d="M12 2a1 1 0 0 1 .932.638l7 18a1 1 0 0 1-1.326 1.281L13 19.517V13a1 1 0 1 0-2 0v6.517l-5.606 2.402a1 1 0 0 1-1.326-1.281l7-18A1 1 0 0 1 12 2Z" clip-rule="evenodd"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        `;
    
        new nataUIDialog({
            height: 660,
            width: 700,
            html: html,
            title:'',
            events: {
                render: function () { },
                close: function () { },
            }
        });
    
        const chatBody = document.getElementById('chatBody');
        const userInputField = document.getElementById('userInput');
        const sendButton = document.getElementById('sendButton');
    
        // Respuestas predefinidas según la opción seleccionada
        const responses = {
            yes: "Has seleccionado 'Sí'. Te permitió ingresar al sistema.",
            no: "Por favor comunicate con soporte para solucionar el problema lo más pronto posible.",
            claimInfo: 'Ahora selecciona la opción: </br> Información de Reclamaciones. </br> Luego ingresa el año que deseas consultar.</br></br> Dar click en el boton ver reporte',
            claimInfo2: 'Te aparecera una nueva ventana en la parte superior aparece un campo que dice Select a format </br>1. selecciona la opcion Excel </br> 2. Selecciona la opcion de export',
        };
    
        // Función para mostrar los mensajes secuenciales con retraso
        const showMessages = () => {
            let messageIndex = 0;
    
            const messages = [
                "¡Bienvenido al chat!",
                'Para acceder al estado de cuenta de Adres debes ingresar al siguiente link: </br> <a href="https://aplicaciones.adres.gov.co/SII_ECAT_WEB/reportes/Login.aspx" target="_blank">Haz clic aquí para ingresar y actualizar tu información</a>',
                'Estas son tus credenciales: </br> Usuario: 899999123 </br> Contraseña: 1d$V035{4)&b',
                "¿Te permito ingresar al sistema? </br> 1 -> Sí </br> 2 -> No",
            ];
    
            const showNextMessage = () => {
                if (messageIndex < messages.length) {
                    const systemMessage = document.createElement('div');
                    systemMessage.classList.add('chat-message', 'system');
                    
                    // Avatar + mensaje del sistema
                    const avatar = document.createElement('div');
                    avatar.classList.add('avatar');
                    avatar.innerText = "S"; // Letra inicial del Sistema o avatar en círculo
    
                    const messageText = document.createElement('div');
                    messageText.classList.add('message-text', 'system');
                    messageText.innerHTML = `<strong>Sistema:</strong> ${messages[messageIndex]}`;
    
                    systemMessage.appendChild(avatar);
                    systemMessage.appendChild(messageText);
                    chatBody.appendChild(systemMessage);
    
                    messageIndex++;
                    setTimeout(showNextMessage, 2000); // Espera 2 segundos antes de mostrar el siguiente mensaje
                } else {
                    // Mostrar el campo para que el usuario ingrese la opción
                    const inputField = document.getElementById('userInput');
                    const sendBtn = document.getElementById('sendButton');
                    inputField.disabled = false; // Habilitar la barra de texto para el usuario
                    sendBtn.disabled = false; // Habilitar el botón
                    inputField.focus();
                    chatBody.scrollTop = chatBody.scrollHeight; // Desplazar al final
                }
            };
    
            showNextMessage(); // Inicia el proceso de mostrar mensajes
        };
    
        showMessages(); // Inicia el proceso de mostrar mensajes secuenciales
    
        // Manejar la respuesta del usuario
        sendButton.addEventListener('click', () => {
            sendMessage();
        });
    
        // Detectar presionar Enter
        userInputField.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && userInputField.value.trim() !== '') {
                sendMessage();
            }
        });
    
        // Función para enviar el mensaje
        function sendMessage() {
            const userInput = userInputField.value.trim();
            
            // Mostrar el mensaje del usuario con burbuja
            const userMessage = document.createElement('div');
            userMessage.classList.add('chat-message', 'me');
            const userAvatar = document.createElement('div');
            userAvatar.classList.add('avatar');
            userAvatar.innerText = "T"; // Letra inicial del usuario o avatar en círculo
    
            const userText = document.createElement('div');
            userText.classList.add('message-text', 'me');
            userText.innerHTML = `<strong>Tú:</strong> Opcion ${userInput}`;
    
            userMessage.appendChild(userAvatar);
            userMessage.appendChild(userText);
            chatBody.appendChild(userMessage);
    
            // Validar la respuesta
            let systemResponse = document.createElement('div');
            systemResponse.classList.add('chat-message', 'system');
    
            if (userInput === '1') {
                const yesMessage = document.createElement('div');
                yesMessage.classList.add('chat-message', 'system');
            
                const yesAvatar = document.createElement('div');
                yesAvatar.classList.add('avatar');
                yesAvatar.innerText = "S"; // Letra inicial del Sistema
            
                const yesText = document.createElement('div');
                yesText.classList.add('message-text', 'system');
                yesText.innerHTML = `<strong>Sistema:</strong> ${responses.yes}`;
            
                yesMessage.appendChild(yesAvatar);
                yesMessage.appendChild(yesText);
                chatBody.appendChild(yesMessage);
            
                // Mostrar el siguiente conjunto de mensajes con los estilos correctos
                setTimeout(() => {
                    const infoMessage = document.createElement('div');
                    infoMessage.classList.add('chat-message', 'system');
                    const infoAvatar = document.createElement('div');
                    infoAvatar.classList.add('avatar');
                    infoAvatar.innerText = "S";
            
                    const infoText = document.createElement('div');
                    infoText.classList.add('message-text', 'system');
                    infoText.innerHTML = `<strong>Sistema:</strong> ${responses.claimInfo}`;
            
                    infoMessage.appendChild(infoAvatar);
                    infoMessage.appendChild(infoText);
                    chatBody.appendChild(infoMessage);
                    chatBody.scrollTop = chatBody.scrollHeight;
                }, 2000);

                setTimeout(() => {
                    const infoMessage = document.createElement('div');
                    infoMessage.classList.add('chat-message', 'system');
                    const infoAvatar = document.createElement('div');
                    infoAvatar.classList.add('avatar');
                    infoAvatar.innerText = "S";
            
                    const infoText = document.createElement('div');
                    infoText.classList.add('message-text', 'system');
                    infoText.innerHTML = `<strong>Sistema:</strong> ${responses.claimInfo2}`;
            
                    infoMessage.appendChild(infoAvatar);
                    infoMessage.appendChild(infoText);
                    chatBody.appendChild(infoMessage);
                    chatBody.scrollTop = chatBody.scrollHeight;
                }, 2000);
            } else if (userInput === '2') {
                systemResponse.classList.add('message-text', 'system');
                systemResponse.innerHTML = `<strong>Sistema:</strong> ${responses.no}`;
            } else {
                systemResponse.classList.add('message-text', 'system');
                systemResponse.innerHTML = `<strong>Sistema:</strong> Opción no válida. Por favor ingresa 1 para Sí o 2 para No.`;
            }
    
            chatBody.appendChild(systemResponse);
            chatBody.scrollTop = chatBody.scrollHeight;
            userInputField.value = '';
            userInputField.focus();
        }
    },
    
    monitor: function(){
        console.log("%c app.aseguradora.monitor", "background:red;color:#fff;font-size:11px");

        axios.get(app.config.server.php1 + "x=asegurador&k=monitorSeguimiento")
            .then(function(response){
                console.log(response.data);

                const options = {
                    id: "tableMonitorSOAT",
                    columns: [
                        {
                            title: "Asegurador",
                            width: "200",
                            prop: "a"
                        },
                        {
                            title: "Días actualización mínima",
                            width: "150",
                            prop: "dmin",
                            class: "text-end",
                            widget: {
                                w: "badge",
                                c: "text-bg-danger pulse-red"
                            }
                        },
                        {
                            title: "Días actualización máxima",
                            width: "150",
                            prop: "dmax",
                            class: "text-end",
                            widget: {
                                w: "badge",
                                c: "text-bg-danger pulse-red"
                            }
                        },
                        {
                            title: "",
                            width: "200",
                            class: "text-center",
                            html: `
                                <button data-id="[id]" type="button" class="btn btn-primary btn-sm btn-ver-detalle">Ver detalle</button>
                            `
                        }
                    ],
                    data: response.data
                };
                nata.sessionStorage.setItem("widget", options);

                new nataUIDialog({
                    html: `
                        <nata-ui-table></nata-ui-table>
                    `,
                    title: `
                        Seguimiento Aseguradoras
                    `,
                    events: {
                        render: function () { 
                            document.querySelectorAll('.btn-ver-detalle').forEach(button => {
                                button.addEventListener('click', function() {
                                    const id = this.getAttribute('data-id');
                                    console.log(id);
        
                                    axios.get(app.config.server.php1 + "x=asegurador&k=monitorSeguimientoDetalle&z=" + id)
                                        .then(function(response) {
                                            console.log(response.data);
        
                                            new nataUIDialog({
                                                html: `
                                                    <div>
                                                        <h3>Detalle</h3>
                                                        <pre>${JSON.stringify(response.data, null, 2)}</pre>
                                                    </div>
                                                `,
                                                title: `Detalle de Asegurador ${id}`,
                                            });
                                        })
                                        .catch(function(error) {
                                            console.error('Error fetching detail:', error);
                                        });
                                });
                            })
                        },
                        close: function () { },
                    }
                });
            })
            .catch(function(error){
                console.error(error);
            });
    }
      
};