/* globals io */
//const socket = io.connect('ws://localhost:3001', { transports: ['websocket'] });
const socket = io.connect("http://localhost:3001");
// Notificar al servidor que soy el cliente B
socket.emit("soy_cliente_B");
socket.on("connect", () => {
    console.log("Cliente: Conectado");
});
socket.on('cliente-armado', (data) => {
    try {
        console.log("cliente-armado");
        console.log(data);
        /*
        const tbody = document.querySelector('#tabla-descargas tbody');
        const tr = document.createElement('tr');
        tr.innerHTML = `
        <td>${data.maquina}</td>
        <td>${data.soporte}</td>
        <td>${data.fecha}</td>
    `;
        tbody.appendChild(tr);
        */
        
        if (document.querySelector("#container-cuentaMedicaArmado") !== null) {
            // actualizar la cantidad de procesados
            const element = document.querySelector("#cp-0");
            let CProcesadoValor = element.innerText;
            if (CProcesadoValor.trim() == "") {
                CProcesadoValor = 0;
            }
            element.innerText = ++CProcesadoValor;
        }

        //alert("nueva descarga 02");
    }
    catch (error) {
        console.error("Error al procesar el evento cliente-armado:", error);
    }
});