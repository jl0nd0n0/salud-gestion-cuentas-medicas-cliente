/* globals axios, swal, nataUIDialog, session, nata, app, XLSX */

// eslint-disable-next-line no-unused-vars
class nataUIUpload extends HTMLElement {
    constructor() {
        // Siempre llamar primero a super en el constructor
        super();
        const self = this;

        const template = `
            <style>
                /* General Styles */

                :root {
                    --clr-white: rgb(255, 255, 255);
                    --clr-black: rgb(0, 0, 0);
                    --clr-light: rgb(245, 248, 255);
                    --clr-blue: rgb(63, 134, 255);
                    --clr-light-blue: rgb(171, 202, 255);
                }

                /* End General Styles */

                    /* Upload Area */
                    .upload-area {
                        max-width: 600px;
                        background-color: var(--clr-white);
                        padding: 2rem 1.875rem 5rem 1.875rem;
                        text-align: center;
                    }

                    .upload-area--open {
                    /* Slid Down Animation */
                    animation: slidDown 500ms ease-in-out;
                    }

                    @keyframes slidDown {
                    from {
                        height: 28.125rem; /* 450px */
                    }

                    to {
                        height: 35rem; /* 560px */
                    }
                    }

                    /* Header */
                    .upload-area__header {
                    }

                    .upload-area__paragraph {
                        font-size: 0.9375rem;
                        color: var(--color-label);
                        margin-top: 0;
                    }

                    .upload-area__tooltip-data {
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -125%);
                        min-width: max-content;
                        background-color: var(--clr-white);
                        color: var(--clr-blue);
                        border: 1px solid var(--clr-light-blue);
                        padding: 0.625rem 1.25rem;
                        font-weight: 500;
                        opacity: 0;
                        visibility: hidden;
                        transition: none 300ms ease-in-out;
                        transition-property: opacity, visibility;
                    }

                    .upload-area__tooltip:hover .upload-area__tooltip-data {
                        opacity: 1;
                        visibility: visible;
                    }

                    /* Drop Zoon */
                    .upload-area__drop-zoon {
                        position: relative;
                        height: 11.25rem; /* 180px */
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        flex-direction: column;
                        border: 2px dashed var(--clr-light-blue);
                        border-radius: 15px;
                        margin-top: 2.1875rem;
                        cursor: pointer;
                        transition: border-color 300ms ease-in-out;
                    }

                    .upload-area__drop-zoon:hover {
                        border-color: var(--clr-blue);
                    }

                    .drop-zoon__icon {
                        display: flex;
                        font-size: 3.75rem;
                        color: var(--clr-blue);
                        transition: opacity 300ms ease-in-out;
                    }

                    .drop-zoon__paragraph {
                        font-size: 0.9375rem;
                        color: var(--clr-light-gray);
                        margin: 0;
                        margin-top: 0.625rem;
                        transition: opacity 300ms ease-in-out;
                    }

                    .drop-zoon:hover .drop-zoon__icon,
                    .drop-zoon:hover .drop-zoon__paragraph {
                        opacity: 0.7;
                    }

                    .drop-zoon__loading-text {
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        display: none;
                        color: var(--clr-light-blue);
                        z-index: 10;
                    }

                    .drop-zoon__preview-image {
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        object-fit: contain;
                        padding: 0.3125rem;
                        border-radius: 10px;
                        display: none;
                        z-index: 1000;
                        transition: opacity 300ms ease-in-out;
                    }

                    .drop-zoon:hover .drop-zoon__preview-image {
                        opacity: 0.8;
                    }

                    .drop-zoon__file-input {
                        display: none;
                    }

                    /* (drop-zoon--over) Modifier Class */
                    .drop-zoon--over {
                        border-color: var(--clr-blue);
                    }

                    .drop-zoon--over .drop-zoon__icon,
                    .drop-zoon--over .drop-zoon__paragraph {
                        opacity: 0.7;
                    }

                    /* (drop-zoon--over) Modifier Class */
                    .drop-zoon--Uploaded {
                    }

                    .drop-zoon--Uploaded .drop-zoon__icon,
                    .drop-zoon--Uploaded .drop-zoon__paragraph {
                        display: none;
                    }

                    /* File Details Area */
                    .upload-area__file-details {
                        height: 0;
                        visibility: hidden;
                        opacity: 0;
                        text-align: left;
                        transition: none 500ms ease-in-out;
                        transition-property: opacity, visibility;
                        transition-delay: 500ms;
                    }

                    /* (duploaded-file--open) Modifier Class */
                    .file-details--open {
                        height: auto;
                        visibility: visible;
                        opacity: 1;
                    }

                    /* Uploaded File */
                    .uploaded-file {
                        display: flex;
                        align-items: center;
                        padding: 0.625rem 0;
                        visibility: hidden;
                        opacity: 0;
                        transition: none 500ms ease-in-out;
                        transition-property: visibility, opacity;
                    }

                    /* (duploaded-file--open) Modifier Class */
                    .uploaded-file--open {
                        visibility: visible;
                        opacity: 1;
                    }

                    .uploaded-file__icon-container {
                        position: relative;
                        margin-right: 0.3125rem;
                    }

                    .uploaded-file__icon {
                        font-size: 3.4375rem;
                        color: var(--clr-blue);
                    }

                    .uploaded-file__icon-text {
                        position: absolute;
                        top: 1.5625rem;
                        left: 50%;
                        transform: translateX(-50%);
                        font-size: 0.9375rem;
                        font-weight: 500;
                        color: var(--clr-white);
                    }

                    .uploaded-file__info {
                        position: relative;
                        top: -0.3125rem;
                        width: 100%;
                        display: flex;
                        justify-content: space-between;
                    }

                    .uploaded-file__info::before,
                    .uploaded-file__info::after {
                        content: "";
                        position: absolute;
                        bottom: -0.9375rem;
                        width: 0;
                        height: 0.5rem;
                        background-color: #ebf2ff;
                        border-radius: 0.625rem;
                    }

                    .uploaded-file__info::before {
                        width: 100%;
                    }

                    .uploaded-file__info::after {
                        width: 100%;
                        background-color: var(--clr-blue);
                    }

                    /* Progress Animation */
                    .uploaded-file__info--active::after {
                        animation: progressMove 800ms ease-in-out;
                        animation-delay: 300ms;
                    }

                    @keyframes progressMove {
                    from {
                        width: 0%;
                        background-color: transparent;
                    }

                    to {
                        width: 100%;
                        background-color: var(--clr-blue);
                    }
                    }
                    .uploaded-file__name {
                        width: 100%;
                        display: inline-block;
                        font-size: 1rem;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                    }

                    .uploaded-file__counter {
                        font-size: 1rem;
                        color: var(--clr-light-gray);
                    }
            </style>
            <!-- Upload Area -->
            <div id="uploadArea" class="upload-area liquid">
                <!-- Header -->
                <div class="upload-area__header">
                    <h4 class="upload-area__title">${self.dataset.title}</h4>
                    <p class="upload-area__paragraph">
                        ${self.dataset.subtitle}
                    <strong class="upload-area__tooltip">
                        <span class="upload-area__tooltip-data"></span> <!-- Data Will be Comes From Js -->
                    </strong>
                    </p>
                </div>
                <!-- End Header -->

                <!-- Drop Zoon -->
                <div id="dropZoon" class="upload-area__drop-zoon drop-zoon">
                    <span class="drop-zoon__icon">
                        <i class='bx bxs-file-image'></i>
                    </span>
                    <p class="drop-zoon__paragraph">
                        Arrastra y suelta tu archivo aquí o click para buscarlo
                    </p>
                    <span id="loadingText" class="drop-zoon__loading-text">Please Wait</span>
                    <img src="" alt="Preview Image" id="previewImage" class="drop-zoon__preview-image" draggable="false">
                    <input type="file" id="fileInput" class="drop-zoon__file-input" multiple>
                </div>
                <!-- End Drop Zoon -->

                <!-- File Details -->
                <div id="fileDetails" class="upload-area__file-details file-details">
                    <div id="uploadedFile" class="uploaded-file">
                    <div class="uploaded-file__icon-container">
                        <i class='bx bxs-file-blank uploaded-file__icon'></i>
                        <span class="uploaded-file__icon-text"></span> <!-- Data Will be Comes From Js -->
                    </div>

                    <div id="uploadedFileInfo" class="uploaded-file__info">
                        <span class="uploaded-file__name">Proejct 1</span>
                        <span class="uploaded-file__counter">0%</span>
                    </div>
                    </div>
                </div>
                <!-- End File Details -->

                <div class="w-100 text-center container-spinner mt-4" id="spinner-border">
                    <div class="spinner-border d-inline-block" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                </div>
            </div>
            <!-- End Upload Area -->
        `;

        self.innerHTML = template;
    }

    connectedCallback() {

        const self = this;

        console.log(self.dataset);

        // Design By
        // - https://dribbble.com/shots/13992184-File-Uploader-Drag-Drop

        // Select Upload-Area
        const uploadArea = document.querySelector("#uploadArea");

        // Select Drop-Zoon Area
        const dropZoon = document.querySelector("#dropZoon");

        // Loading Text
        const loadingText = document.querySelector("#loadingText");

        // Slect File Input
        const fileInput = document.querySelector("#fileInput");

        // Select Preview Image
        const previewImage = document.querySelector("#previewImage");

        // File-Details Area
        const fileDetails = document.querySelector("#fileDetails");

        // Uploaded File
        const uploadedFile = document.querySelector("#uploadedFile");

        // Uploaded File Info
        const uploadedFileInfo = document.querySelector("#uploadedFileInfo");

        // Uploaded File  Name
        const uploadedFileName = document.querySelector(".uploaded-file__name");

        // Uploaded File Icon
        // const uploadedFileIconText = document.querySelector(".uploaded-file__icon-text");

        // Uploaded File Counter
        const uploadedFileCounter = document.querySelector(".uploaded-file__counter");

        // ToolTip Data
        const toolTipData = document.querySelector(".upload-area__tooltip-data");

        if (Object.keys(self.dataset).length == 0) {
            console.error("No se han definido las propiedades de datos: fileTypes, title, subtitle, url");
            return false;
        }
        else {
            if (typeof self.dataset.url == "undefined") {
                console.error("No se ha definido la propiedad de datos: url");
                return false;
            }
            else if (typeof self.dataset.etl == "undefined") {
                console.log("%c error", "background:red;color:#fff;font-size:11px");
                console.error("No se ha definido la propiedad de datos: etl");
                return false;
            }
        }

        console.log(self.dataset);
        let oAccept;
        if (typeof self.dataset.fileTypes !== "undefined") {
            oAccept = self.dataset.fileTypes.split(",");
        }
        else {
            oAccept = self.dataset.accept;
        }

        switch (oAccept) {
            case "csv":
                fileInput.setAttribute("accept", ".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel");
                break;
            case "xlsx":
                fileInput.setAttribute("accept", ".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel");
                break;
            case ".zip":
                fileInput.setAttribute("accept", ".zip, application/zip");
                break;
            case "zip":
                fileInput.setAttribute("accept", ".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel");
                break;
            case ".txt":
                fileInput.setAttribute("accept", ".txt, application/txt");
            break;
        }

        // Append Images Types Array Inisde Tooltip Data
        /*
        console.log(fileTypes.join(","));
        toolTipData.innerHTML = fileTypes.join(",");
        fileTypes = null;
        */

        // When (drop-zoon) has (dragover) Event
        dropZoon.addEventListener("dragover", function (event) {
            // Prevent Default Behavior
            event.preventDefault();

            // Add Class (drop-zoon--over) On (drop-zoon)
            dropZoon.classList.add("drop-zoon--over");
        });

        // When (drop-zoon) has (dragleave) Event
        dropZoon.addEventListener("dragleave", function (event) {
            // Remove Class (drop-zoon--over) from (drop-zoon)
            dropZoon.classList.remove("drop-zoon--over");
        });

        // When (drop-zoon) has (drop) Event
        dropZoon.addEventListener("drop", function (event) {
            app.core.robot.message("Voy a cargar tu documento");
            // Prevent Default Behavior
            event.preventDefault();

            // Remove Class (drop-zoon--over) from (drop-zoon)
            dropZoon.classList.remove("drop-zoon--over");

            // Select The Dropped File
            self.file = event.dataTransfer.files[0];
            // Call Function uploadFile(), And Send To Her The Dropped File :)
            uploadFile(self.file);
        });

        // When (drop-zoon) has (click) Event
        dropZoon.addEventListener("click", function (event) {
            // Click The (fileInput)
            fileInput.click();
        });

        document.querySelector("#fileInput").onchange = () => {
            console.log("fileInput.change");
            app.core.robot.message("Voy cargar tus archivos");
            setTimeout(() => {
                self.files = fileInput.files;
                console.log(self.files);
                for (let i = 0; i < self.files.length; i++) {
                    uploadFile(self.files[i]);
                }
            }, 1 * 1000);
        };

        // Upload File Function
        function uploadFile(file) {
            console.trace("uploadFile");

            setTimeout(() => {

            }, 1 * 1000);

            // FileReader()
            const fileReader = new FileReader();
            // File Type
            //const fileType = file.type;
            // File Size
            //const fileSize = file.size;

            // If File Is Passed from the (File Validation) Function
            /*
            if (fileValidate(fileType, fileSize)) {
                // Add Class (drop-zoon--Uploaded) on (drop-zoon)
                dropZoon.classList.add("drop-zoon--Uploaded");

                // Show Loading-text
                loadingText.style.display = "block";
                // Hide Preview Image
                previewImage.style.display = "none";

                // Remove Class (uploaded-file--open) From (uploadedFile)
                uploadedFile.classList.remove("uploaded-file--open");
                // Remove Class (uploaded-file__info--active) from (uploadedFileInfo)
                uploadedFileInfo.classList.remove("uploaded-file__info--active");

                // After File Reader Loaded
                fileReader.addEventListener("load", function () {
                    // After Half Second
                    setTimeout(function () {
                        // Add Class (upload-area--open) On (uploadArea)
                        uploadArea.classList.add("upload-area--open");

                        // Hide Loading-text (please-wait) Element
                        loadingText.style.display = "none";
                        // Show Preview Image
                        previewImage.style.display = "block";

                        // Add Class (file-details--open) On (fileDetails)
                        fileDetails.classList.add("file-details--open");
                        // Add Class (uploaded-file--open) On (uploadedFile)
                        uploadedFile.classList.add("uploaded-file--open");
                        // Add Class (uploaded-file__info--active) On (uploadedFileInfo)
                        uploadedFileInfo.classList.add("uploaded-file__info--active");
                    }, 500); // 0.5s

                    // Add The (fileReader) Result Inside (previewImage) Source
                    previewImage.setAttribute("src", fileReader.result);

                    // Add File Name Inside Uploaded File Name
                    uploadedFileName.innerHTML = file.name;

                    // Call Function progressMove();
                    progressMove();
                });

                // Read (file) As Data Url
                fileReader.readAsDataURL(file);
            } else { // Else

                this; // (this) Represent The fileValidate(fileType, fileSize) Function

            }
            */

            // Add Class (drop-zoon--Uploaded) on (drop-zoon)
            dropZoon.classList.add("drop-zoon--Uploaded");

            // Show Loading-text
            loadingText.style.display = "block";
            // Hide Preview Image
            previewImage.style.display = "none";

            // Remove Class (uploaded-file--open) From (uploadedFile)
            uploadedFile.classList.remove("uploaded-file--open");
            // Remove Class (uploaded-file__info--active) from (uploadedFileInfo)
            uploadedFileInfo.classList.remove("uploaded-file__info--active");

            // After File Reader Loaded
            fileReader.addEventListener("load", function () {
                // After Half Second
                setTimeout(function () {
                    // Add Class (upload-area--open) On (uploadArea)
                    uploadArea.classList.add("upload-area--open");

                    // Hide Loading-text (please-wait) Element
                    loadingText.style.display = "none";
                    // Show Preview Image
                    //previewImage.style.display = "block";
                    document.querySelector("#dropZoon").style.display = "none";

                    // Add Class (file-details--open) On (fileDetails)
                    fileDetails.classList.add("file-details--open");
                    // Add Class (uploaded-file--open) On (uploadedFile)
                    uploadedFile.classList.add("uploaded-file--open");
                    // Add Class (uploaded-file__info--active) On (uploadedFileInfo)
                    uploadedFileInfo.classList.add("uploaded-file__info--active");

                    // Add The (fileReader) Result Inside (previewImage) Source
                    //previewImage.setAttribute("src", fileReader.result);

                    // Add File Name Inside Uploaded File Name
                    uploadedFileName.innerHTML = file.name;

                    // Call Function progressMove();
                    const callback = function () {
                        //app.core.robot.message("Ahora vamos a generar tus Furips. <br>Te informo cuando esten listos");
                        app.core.robot.message("Ahora vamos a Realizar la carga del archivo. <br>Te informo cuando esten listos");
                        console.log(self.file);

                        //console.log(fileInput);
                        //console.log(fileInput.files);
                        const formData = new FormData();
                        formData.append("file", file);
                        if (typeof self.dataset.etl !== "undefined") {
                            formData.append("etl", self.dataset.etl);
                        }
                        if (typeof self.dataset.userid !== "undefined") {
                            formData.append("userid", self.dataset.userid);
                        }
                        if (typeof self.dataset.idlocal !== "undefined") {
                            formData.append("idlocal", self.dataset.idlocal);
                        }
                        if (typeof self.dataset.params !== "undefined") {
                            console.log(self.dataset.params);
                            console.log(JSON.parse(self.dataset.params));

                            for (const [key, value] of Object.entries(JSON.parse(self.dataset.params))) {
                                formData.append(key, value);
                            }

                            //formData.append("params", self.dataset.params);
                        }
                        
                        console.log(self.dataset.consola);

                        
                        document.querySelector(".container-spinner").style.display = "block";
                        setTimeout(() => {

                            axios.post(self.dataset.url, formData, {
                                headers: {
                                    "Content-Type": "multipart/form-data",
                                }
                            }).then(function (response) {
                                console.log(response.data);
                                if(self.dataset.consola == 1){ 
                                    if(response.data.toLowerCase().includes('error') == false){
                                        swal("Éxito", "Se ha realizado la carga", "success");
                                    }
                                    else{
                                        swal("Error", response.data, "error");
                                    }

                                    const elements = document.querySelectorAll(".ui-dialog ");
                                    let i;
                                    for (i=elements.length - 1;i<elements.length;i++) {
                                        elements[i].remove();
                                    }
                                }
                                else if (self.dataset.consola == 2) {
                                    const data = response.data.table;

                                    if (Array.isArray(data) && data.length > 0) {
                                        const keys = Object.keys(data[0]).filter(key => key !== "title");
                                    
                                        const columnWidths = new Array(keys.length).fill(0);

                                        document.querySelector("#imageRobot").style.display = "none";
                                        document.querySelector("#chatBubble").style.display = "none";

                                        
                                    
                                        // Calcular los anchos máximos de las celdas
                                        data.forEach((row) => {
                                            keys.forEach((key, colIndex) => {
                                                const cellValue = (row[key] || "").toString();
                                                columnWidths[colIndex] = Math.max(columnWidths[colIndex], cellValue.length);
                                            });
                                        });
                                    
                                        const totalTableWidth = columnWidths.reduce((sum, width) => sum + ((width * 8) + 30), 0) + 50;
                                    
                                        let table = `
                                            <div class="dialog-body">
                                                <div id="buttonExcel"></div>
                                                <div class="table-container">
                                                    <table class="table" style="width: ${totalTableWidth}px; max-width: 100%;">
                                                        <thead>
                                                            <tr>
                                        `;
                                        
                                        keys.forEach((key) => {
                                            table += `<th>${key}</th>`;
                                        });
                                    
                                        table += "</tr></thead><tbody>";
                                    
                                        data.forEach((row, index) => {
                                            const zebraClass = (index % 2 === 0) ? "bg-zebra" : "";
                                            table += `<tr class="${zebraClass}">`;
                                    
                                            keys.forEach((key) => {
                                                const cellValue = row[key] || "";
                                                table += `<td>${cellValue}</td>`;
                                            });
                                    
                                            table += "</tr>";
                                        });
                                    
                                        table += "</tbody></table></div></div>";
                                    
                                        new nataUIDialog({
                                            html: table,
                                            title: `${data[0].title || "Datos"} <span class="badge rounded-pill text-bg-danger">${data.length}</span>`,
                                            events: {
                                                render: function () { },
                                                close: function () { 
                                                    document.querySelector("#imageRobot").style.display = "block";
                                                },
                                            }
                                        });

                                        const excelButton = document.createElement("button");
                                        excelButton.innerText = "Descargar Excel";
                                        excelButton.className = "btn btn-outline-success";
                                        excelButton.addEventListener("click", () => {
                                            exportToExcel(data, data[0].title || "Datos");
                                        });
                                        document.querySelector("#buttonExcel").appendChild(excelButton);
                                    } else {
                                        self.render(response.data);
                                    }
                                    
                                           
                                    function exportToExcel(data, fileName) {
                                        const workbook = XLSX.utils.book_new();
                                    
                                        const worksheet = XLSX.utils.json_to_sheet(data);
                                    
                                        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
                                    
                                        XLSX.writeFile(workbook, `${fileName}.xlsx`);
                                    }
                                }
                                else if (self.dataset.consola == 3) {
                                    const elements = document.querySelectorAll(".ui-dialog ");
                                    let i;
                                    for (i=elements.length - 1;i<elements.length;i++) {
                                        elements[i].remove();
                                    }

                                    const factura = nata.sessionStorage.getItem("factura");
                                    app.monitor.glosa.soporte.plantillaMAOS.index(factura);
                                }
                                else if (self.dataset.consola == 4) {
                                    const elements = document.querySelectorAll(".ui-dialog ");
                                    let i;
                                    for (i=elements.length - 2;i<elements.length;i++) {
                                        elements[i].remove();
                                    }

                                    // const factura = nata.sessionStorage.getItem("factura");
                                    // app.monitor.soporte.subirSoportes(factura);
                                }
                                else{
                                    self.render(response.data);
                                }
                            });

                        }, 0.25 * 1000);
                    };
                    progressMove(callback);
                }, 0.5 * 1000); // 0.5s
            });

            // Read (file) As Data Url
            fileReader.readAsDataURL(file);
        }
        
        // Progress Counter Increase Function
        function progressMove(callback) {
            // Counter Start
            let counter = 0;

            // After 600ms
            setTimeout(() => {
                // Every 100ms
                let counterIncrease = setInterval(() => {
                    // If (counter) is equle 100
                    if (counter === 100) {
                        // Stop (Counter Increase)
                        clearInterval(counterIncrease);
                        if (typeof callback === "function") {
                            callback();
                        }
                    } else { // Else
                        // plus 10 on counter
                        counter = counter + 10;
                        // add (counter) vlaue inisde (uploadedFileCounter)
                        uploadedFileCounter.innerHTML = `${counter}%`;
                    }
                }, 100);
            }, 0.6 * 1000);
        }

        // Simple File Validate Function
        /*
        function fileValidate(fileType, fileSize) {
            // File Type Validation
            let isImage = fileTypes.filter((type) => fileType.indexOf(`image/${type}`) !== -1);

            // If The Uploaded File Type Is 'jpeg'
            if (isImage[0] === "jpeg") {
                // Add Inisde (uploadedFileIconText) The (jpg) Value
                uploadedFileIconText.innerHTML = "jpg";
            } else { // else
                // Add Inisde (uploadedFileIconText) The Uploaded File Type
                uploadedFileIconText.innerHTML = isImage[0];
            }

            // If The Uploaded File Is An Image
            if (isImage.length !== 0) {
                // Check, If File Size Is 2MB or Less
                if (fileSize <= 2000000) { // 2MB :)
                    return true;
                } else { // Else File Size
                    return alert("Please Your File Should be 2 Megabytes or Less");
                }
            } else { // Else File Type
                return alert("Please make sure to upload An Image File Type");
            }
        }

        // :)
        */
    }

    render (data) {
        console.trace("render");
        console.log(data);

        app.core.dialog.removeAll();

        if (data.length == 0) {
            swal("No se han recibido datos !!", "Revisa el parametro etl en el custom element \nCorre el etl en el servidor", "error");
            document.getElementById("loader").style.display = "none";
            return false;
        }

        const template = `
            <style>
                #console {
                    padding: 10px;
                    background: #0c0d0d;
                    color: #ccc;
                    font-size: 12px;
                    font-family: courier;
                    height: 100%;
                    width: 100%;
                }
            </style>
            <div id="console" class="console liquid scroll"></div>
        `;

        new nataUIDialog({
            height: session.height,
            html: template,
            width: session.width,
            title: "Consola",
            events: {
                render: function () {},
                close: function () {}
            }
        });
        // document.querySelector(".ui-dialog-body").style.padding = "0px";
        const elConsole = document.getElementById("console");
        let i;
        //console.log(data[0]);
        const dataConsole = data.load;
        const dataUpdate = data.update;
        const dataError = data.error;

        console.log(dataConsole);
        console.log(dataUpdate);
        console.log(dataError);

        const fxRender = function (data) {
            console.log(data);
            for (i = 0; i < data.length; ++i) {
                //console.log(dataConsole);
                elConsole.innerHTML += (data[i]) + "<br>";
            }
        };

        fxRender(dataConsole);
        fxRender(dataUpdate);
        fxRender(dataError);
        
        document.getElementById("loader").style.display = "none";
        
        app.core.robot.message("Esta es la información de la carga de tu archivo.");
        setTimeout(function () {
            document.querySelector("#chatBubble").remove();
        }, 1 * 1000);
        elConsole.style.display = "block";
    }

}

customElements.define("nata-ui-upload", nataUIUpload);
