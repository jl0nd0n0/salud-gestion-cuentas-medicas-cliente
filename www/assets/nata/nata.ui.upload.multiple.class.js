/* globals  */

// eslint-disable-next-line no-unused-vars
class nataUIUploadMultiple extends HTMLElement {
    constructor() {
        // Siempre llamar primero a super en el constructor
        super();
        const self = this;

        const htmlStyle = `
            <style>

                .container-upload {
                    background-color: #f5f5f5;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                }

                #dropArea {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    min-height: 150px;
                    border: 2px dashed #ddd;
                    border-radius: 5px;
                    padding: 20px;
                    box-sizing: border-box;
                    text-align: center;
                    cursor: pointer;
                    background-color: #fff;
                    transition: border-color 0.3s ease;
                    width: 300px;
                    margin: auto;
                }

                #dropArea.highlight {
                    border-color: #007bff;
                }

                .fileList {
                    list-style: none;
                    min-width: 275px;
                    padding: 0;
                    margin-top: 20px;
                }

                .fileName {
                    font-size: 13px;
                    font-weight: bold;
                    margin-bottom: 5px;
                    color: #333;
                }

                .progress {
                    width: 100%;
                    background-color: #f0f0f0;
                    border: 1px solid #ccc;
                    height: 20px;
                    position: relative;
                    margin-top: 5px;
                    border-radius: 5px;
                    overflow: hidden;
                }

                .bar {
                    width: 0%;
                    height: 100%;
                    background-color: #007bff;
                    position: absolute;
                    top: 0;
                    left: 0;
                    transition: width 0.3s ease;
                    border-radius: 5px;
                }

                .error {
                    color: red;
                    font-size: 12px;
                    font-weight: bold;
                }
            </style>
        `;

        const template = `
            ${htmlStyle}
            <div class="container-upload">
                <div id="dropArea">
                    <p class="mb-0">Drag & Drop files here or click to select files</p>
                </div>
                <ul id="fileList" class="fileList d-none list-group"></ul>
            </div>
        `;
        self.innerHTML = template;
    }

    connectedCallback() {

        const self = this;
        document.querySelector(".ui-dialog .ui-dialog-body").style.padding = "0px";
        console.log(self.dataset.url);
        if (typeof self.dataset.url == "undefined") {
            console.error("No se ha enviado el data-url");
            return self;
        }
        self.url = self.dataset.url;

        function handleDragOver(event) {
            event.preventDefault();
            event.dataTransfer.dropEffect = "copy";
            document.getElementById("dropArea").classList.add("highlight");
        }

        function handleDrop(event) {
            event.preventDefault();
            document.getElementById("dropArea").classList.remove("highlight");
            document.getElementById("dropArea").classList.add("d-none");
            document.getElementById("fileList").classList.remove("d-none");
            var files = event.dataTransfer.files;
            handleFiles(files);
        }

        function handleFiles(files) {
            var fileList = document.getElementById("fileList");
            let file, listItem, fileName, pos, id;
            for (var i = 0; i < files.length; i++) {
                file = files[i];
                console.log(file);
                listItem = document.createElement("li");
                listItem.setAttribute("id", "list_" + file.name.replace(".", "_"));
                listItem.classList.add("fileItem");
                listItem.classList.add("list-group-item");
                fileName = document.createElement("p");
                fileName.classList.add("fileName");
                fileName.classList.add("mb-1");
                fileName.textContent = file.name;
                listItem.appendChild(fileName);
                var progressBar = document.createElement("div");
                progressBar.classList.add("progress");
                var bar = document.createElement("div");
                bar.classList.add("bar");
                progressBar.appendChild(bar);
                listItem.appendChild(progressBar);
                fileList.appendChild(listItem);
                uploadFile(file, bar);
            }
        }

        function uploadFile(file, progressBar) {
            var xhr = new XMLHttpRequest();
            xhr.open("POST", self.url, true);
            xhr.upload.onprogress = function (event) {
                if (event.lengthComputable) {
                    var percentComplete = (event.loaded / event.total) * 100;
                    progressBar.style.width = percentComplete + "%";
                }
            };
            xhr.onload = function () {
                if (xhr.status === 200) {
                    // File uploaded successfully
                } else {
                    // Error occurred during upload
                    console.log(file);
                    const element = document.querySelector("#list_" + file.name.replace(".", "_"));
                    console.log("#list_" + file.name.replace(".", "_"));
                    console.log(element);
                    element.classList.add("error");
                    console.log(xhr);
                    element.innerHTML = "Error Upload: " + xhr.status + " " + xhr.statusText;
                }
            };
            xhr.onerror = function () {
                // Error occurred during upload
            };
            var formData = new FormData();
            formData.append("file", file);
            xhr.send(formData);
        }

        const dropArea = document.querySelector("#dropArea");
        dropArea.ondragover = handleDragOver;
        dropArea.ondrop = handleDrop;
    }
}

customElements.define("nata-ui-upload-multiple", nataUIUploadMultiple);
