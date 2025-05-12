/* globals session, $, tippy, nata */

class nataUIKpiCumplimiento extends HTMLElement {
    constructor() {
        // Always call super first in constructor
        super();

        const self = this;

        //let titulo = this.getAttribute("data-titulo");

        //#region parameters

        let size = this.getAttribute("size");
        if (size == null) size = "large";

        let year = new Date().getFullYear();
        let month = new Date().getMonth() + 1;
        //console.log(month);

        let layout = this.getAttribute("layout");
        if (layout == null) layout = "card";

        let titulo = "SET TITLE ...";
        if (typeof titulo !== "undefined") {
            titulo = this.dataset.titulo;
        }
        self.title = titulo;

        let meta = parseFloat(this.getAttribute("data-meta"));
        let venta = parseFloat(this.getAttribute("data-venta"));
        let ventaAnterior = parseFloat(this.getAttribute("data-venta-anterior"));

        let stroke =nata.ui.widget.color.strokeGet(venta / meta);
        let color = nata.ui.widget.color.fillGet(venta / meta);
        //let colorTitulo =nata.ui.widget.color.claseGetColor(venta / meta);

        //console.log(" *** ----- KPI CUMPLIMIENTO ----- *** :" + venta);

        let ventaProyectada = venta;
        //console.log(venta);
        //console.log(ventaProyectada);

        let bgColor =nata.ui.widget.color.claseGet(venta / meta);
        let bgColorProyectado =nata.ui.widget.color.claseGet(ventaProyectada / meta);
        //let bgTitulo =nata.ui.widget.color.claseGetOpacity(venta / meta);

        let bgColorVentaAnteriorVSVentaProyectada = "";

        let decimalesPorcentaje = 2;
        let iconCrecimientoVentaAnteriorVsVentaProyectada = "",
            iconCrecimientoVentaProyectadaVsMeta = "";

        //console.log(ventaAnteriorVSVentaProyectada);
        if (ventaAnterior > ventaProyectada) {
            iconCrecimientoVentaAnteriorVsVentaProyectada = `
				<svg class="icon" viewBox="0 0 24 24">					
					<path fill="#fff" d="M10,4.2l4,0l0,9l3.5-3.5l2.4,2.4L12,20l-7.9-7.9l2.4-2.4l3.5,3.5L10,4.2z"/>
				</svg>
			`;
        }
        else {
            iconCrecimientoVentaAnteriorVsVentaProyectada = `
				<svg class="icon" viewBox="0 0 24 24">
					<path fill="#fff" d="M14,20l-4,0l0-9l-3.5,3.5l-2.4-2.4L12,4.2l7.9,7.9l-2.4,2.4L14,11L14,20z"/>
				</svg>
			`;
        }

        //#region formula vaa vs vp
        let ventaAnteriorVSVentaProyectada;
        //console.log("*****", ventaProyectada, ventaAnterior);
        if (ventaAnterior == 0) {
            ventaAnteriorVSVentaProyectada = "NA";
            bgColorVentaAnteriorVSVentaProyectada = "badge-primary";
        }
        else {

            if (ventaAnterior > ventaProyectada) {
                ventaAnteriorVSVentaProyectada = Math.abs( 1 - ( parseFloat(ventaProyectada) / parseFloat(ventaAnterior) ) );
            }
            else {
                ventaAnteriorVSVentaProyectada = parseFloat(ventaProyectada) / parseFloat(ventaAnterior);
            }
            ventaAnteriorVSVentaProyectada = (ventaAnteriorVSVentaProyectada) * 100;

            /*
			ventaAnteriorVSVentaProyectada = Math.abs(parseFloat(ventaProyectada) / parseFloat(ventaAnterior));
			ventaAnteriorVSVentaProyectada = ventaAnteriorVSVentaProyectada * 100;
			ventaAnteriorVSVentaProyectada = iconCrecimientoVentaAnteriorVsVentaProyectada + " " + dashboard.fx.formatNumber(ventaAnteriorVSVentaProyectada, decimalesPorcentaje) + "%";
			*/
        }
        //#endregion

        // formula venta vs vp

        //#region calcular venta proyectada vs meta
        let ventaProyectadaVsMeta;
        if (meta > ventaProyectada) {
            ventaProyectadaVsMeta = Math.abs( 1 - ( parseFloat(ventaProyectada) / parseFloat(meta) ) );
        }
        else {
            ventaProyectadaVsMeta = ( parseFloat(ventaProyectada) / parseFloat(meta) );
        }
        ventaProyectadaVsMeta = ventaProyectadaVsMeta * 100;
        //#endregion end calcular venta proyectada vs meta 

        //#region 
        let bgColorVentaProyectadaVsMeta,
            porcentajeProyectada;

        if (meta == 0) {
            bgColorVentaProyectadaVsMeta = "badge-primary";
            iconCrecimientoVentaProyectadaVsMeta = "";
            porcentajeProyectada = "NA";
        }
        else {
            bgColorVentaProyectadaVsMeta = "";
            porcentajeProyectada = ventaProyectadaVsMeta;
            if (meta > ventaProyectada) {
                iconCrecimientoVentaProyectadaVsMeta = `
					<svg class="icon" viewBox="0 0 24 24">					
						<path fill="#fff" d="M10,4.2l4,0l0,9l3.5-3.5l2.4,2.4L12,20l-7.9-7.9l2.4-2.4l3.5,3.5L10,4.2z"/>
					</svg>
				`;
            }
            else {
                iconCrecimientoVentaProyectadaVsMeta = `
					<svg class="icon" viewBox="0 0 24 24">
						<path fill="#fff" d="M14,20l-4,0l0-9l-3.5,3.5l-2.4-2.4L12,4.2l7.9,7.9l-2.4,2.4L14,11L14,20z"/>
					</svg>
				`;
            }
        }
        //#endregion

        let tipo = this.getAttribute("data-tipo").toString().toLowerCase();
        let prefijo = "", sufijo = "", decimales = 0;
        if (tipo == "valores") {
            prefijo = "$";
            sufijo = "M";
            decimales = 3;
        } else {
            decimales = 0;
        }

        const template = document.createElement("template");

        /* #region  colapsar template */
        var hostWidth = ( session.width <= 575 ? "var(--widget-width-mobile)" : "var(--widget-width)" );
        if (layout == "row") {
            if (tipo == "unidades")
                hostWidth = "var(--widget-kpi-cumplimiento-width-table)";
            else
                hostWidth = "var(--widget-kpi-cumplimiento-width-table-pesos)";
        }

        //#endregion parameters

        var html = `
			<style>
				:host([size = "small"]) {
					box-shadow: ${"var(--box-shadow)"};
					display: inline-block;
					border-radius: 5px;
					margin: ${(session.width <= 575 ? "18px 15px 0 15px" : (layout == "row" ? "2px 0 0 5px" : "2px 10px"))};
					padding: ${(session.width <= 575 ? "10px" : "5px")};
					position: relative;
					width: ${hostWidth};
				}

				:host([layout = "card"]) {
					box-shadow: ${(layout == "row" ? "none" : "var(--box-shadow)")};
					display: inline-block;
					border-radius: 5px;
					margin: ${( session.width <= 575 ? "18px 15px 0 15px" : "var(--widget-margin-card)" )};
					padding: ${( session.width <= 575 ? "10px" : "5px" )};
					position: relative;
					width: ${hostWidth};
					background: transparent;
				}

				:host([layout = "row"]) {
					box-shadow: none!important;
					border-radius: 0!important;
					border: none!important;
					display: inline-block;
					border-radius: 0 5px;
					margin: 0;
					background: transparent;
					padding: 3px 10px;
				}

				@media (max-width: 991px) {
					:host([layout = "card"]) {
						width: 320px;
						margin: 5px 15px 5px;
						padding: 5px;
					}

					:host([layout = "row"]) {
						width: 320px;
						margin: 5px 15px 5px;
						padding: 5px;
					}
				}

				.stroke-rojo {
					stroke: var(--color-rojo);
				}

				.stroke-naranja {
					stroke: var(--color-naranja);
				}

				.stroke-amarillo {
					stroke: var(--color-amarillo);
				}

				.stroke-verde {
					stroke: var(--color-verde);
				}

				.stroke-verde-oscuro {
					stroke: var(--color-verde-oscuro);
				}

				.fill-rojo {
					fill:var(--color-rojo);
				}

				.fill-naranja {
					fill:var(--color-naranja);
				}

				.fill-amarillo {
					fill:var(--color-amarillo);
				}

				.fill-verde-claro {
					fill:var(--color-verde);
				}

				.fill-verde-oscuro {
					fill:var(--color-verde-oscuro);
				}

				path.circle-bg {
					fill: none;
					stroke-width: 2;
					stroke: #ddd;
				}

				path.circle {
					fill: none;
					stroke-width: 4;
					stroke-linecap: round;
					animation: progress 4s ease-out forwards;
				}

				text {
					font-size: 7px;
					font-weight: bolder;
					font-family: sans-serif;
					font-size: 0.4em;
					text-anchor: middle;
				}

				@keyframes progress {
					0% {
					  stroke-dasharray: 0 100;
					}
				}

				.float-left {
					float:left;
				}

				.text-right {
					text-align: right;
				}


				.w-34 {
					width:34%;
				}

				.w-33 {
					width:33%;
				}

				.w-100 {
					width:100%;
				}

				label {
					font-size: var(--widget-label-font-size);
					font-weight:bold;
				}

				.badge {
					display: inline-block;
					min-width: 10px;
					padding: var(--widget-badge-padding);
					font-size: var(${(layout == "row" ? "--widget-badge-font-size" : "--widget-badge-font-size")});
					font-weight: 700;
					line-height: 1;
					color: #fff;
					text-align: center;
					white-space: nowrap;
					vertical-align: middle;
					border-radius: 10px;
				}

				.badge-primary {
					background-color: var(--color-blue)!important;
				}

				.label-rojo {
					background-color:var(--color-rojo)!important;
				}
				
				.label-naranja {
					background-color:var(--color-naranja)!important;
				}
				
				.label-amarillo {
					background-color:var(--color-amarillo)!important;
				}
				
				.label-verde-claro {
					background-color:var(--color-verde)!important;
				}
				
				.label-verde-oscuro {
					background-color:var(--color-verde-oscuro)!important;
				}

				.label-color-rojo {
					color:var(--color-rojo)!important;
				}
				
				.label-color-naranja {
					color:var(--color-naranja)!important;
				}
				
				.label-color-amarillo {
					color:var(--color-amarillo)!important;
				}
				
				.label-color-verde {
					color:var(--color-verde)!important;
				}
				
				.label-color-verde-oscuro {
					color:var(--color-verde-oscuro)!important;
				}

				.title {
					border: solid 1px #fff;
					padding: 10px;
					border-radius: 5px 5px 0 0;
					font-weight: bolder;
				}

				.body {
					padding:0 5px 0 2px;
					overflow:hidden;
				}

				.label-rojo-opacity {
					background-color:var(--color-rojo-opacity)!important;
				}
				
				.label-naranja-opacity {
					background-color:var(--color-naranja-opacity)!important;
				}
				
				.label-amarillo-opacity {
					background-color:var(--color-amarillo-opacity)!important;
				}
				
				.label-verde-claro-opacity {
					background-color:var(--color-verde-opacity)!important;
				}
				
				.label-verde-oscuro-opacity {
					background-color:var(--color-verde-oscuro-opacity)!important;
				}

				svg {
					margin-left: 5px;
				}

				svg.icon {
					width:12px;
					height:12px;
				}

				.svg-icon-card {
					width: 24px;
					height: 24px;
					margin: 2px;
					position: absolute;
					top: 3px;
					left: 3px;
				}

				.svg-icon-help {
					width: 24px;
					height: 24px;
					margin: 2px;
					position: absolute;
					bottom: 3px;
					left:3px;
					cursor: pointer
				}

				span.badge {
					margin: 1.5px;
				}

				.mt-20px {
					margin-top: 20px;
				}

				.mt-10px {
					margin-top: 10px;
				}

				.mt-15px {
					margin-top: 15px;
				}

				.line-height-13px {
					line-height: 13px;
				}

				.ui-widget-subtitle {
					font-weight: bold;
					font-size: 12px;
					white-space: nowrap;
				}

				.ps-5 {
					padding-left: 3rem !important;
				}

				.ui-widget-label {
					font-weight: bold;
					font-size: 11px;
					text-align: center;
					vertical-align: top;
					line-height: 10px;
				}

				.ui-widget-value {
					text-align: right;
					line-height: 10px;
				}

				table {
					border-spacing: 0;
				}

				.align-bottom {
					vertical-align: bottom !important;
				}

				.ui-container-progress-bar {
					height: 15px;
				}

				.ui-container-progress-bar svg {
					background: var(--color-background-path-chart);
    				border-radius: 5px;
				}

				.ui-progress-bar {
					height: 10px;
					display: inline-block;
				}

				.ui-progress-bar .bar-line {
					fill: none;
					stroke-width: 3;
					stroke-linecap: round;
					stroke-miterlimit: 10;
					stroke-dasharray: 2300;
					stroke-dashoffset: 2300;
					animation: dash 60s linear forwards;
				}

				@keyframes dash{to{stroke-dashoffset:0}}

				.w-75 {
					width: 75%;
				}

				.w-25 {
					width: 25%;
				}

				.table-layout-fixed {
					table-layout: fixed;
				}

				.align-right {
					text-align: right;
				}

				.badge-compliance {
					font-size: 15px;
				}

				.badge {
					display: inline-block;
					min-width: 10px;
					padding: var(--widget-badge-padding);
					font-size: var(--widget-badge-font-size);
					font-weight: normal;
					line-height: 1;
					color: #fff;
					text-align: center;
					white-space: nowrap;
					vertical-align: middle;
					background-color: #777;
					border-radius: 10px;
				}

				.bg-secondary {
					background-color: var(--color-dark);
				}

				.min-width-150px {
					min-width: 150px;
				}

				.ms-5 {
					margin-left: 3rem !important;
				}

				.text-end {
					text-align: right;
				}

				.v-align-middle {
					vertical-align: middle;
				}

				.v-align-bottom {
					vertical-align: bottom;
				}

				.text-center {
					text-align: center;
				}

				svg {
					display: inline-block;
				}

				.w-35 {
					width: 35%;
				}
				
			</style>
        `;

        if (typeof self.dataset.labelShort !== "undefined") {
            html += "<span class='badge bg-secondary d-inline-block badge-rentabilidad ms-5'>" + self.dataset.labelShort + "</span>";
        }

        let svgImage = "";
        if (meta > 0) {
            svgImage = `
				<svg viewBox="0 0 36 36" style="height: 65px; width: 65px; margin-top: 5px;">
					<path class="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"></path>
					<path class="circle ${stroke}" stroke-dasharray="${((venta / meta) * 100)}, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
					<text x="18" y="20.35" class="percentage ${color}">${((venta / meta) * 100).toFixed(2)}%</text>
				</svg>
			`;
        }

        html += `
			<div class="body">
				<table class="w-100">
					<tr>
						<td class="text-center w-30 v-align-middle">
							${svgImage}
						</td>
						<!--
						<td class="text-end w-35">
							<label>Meta:<br></label> 
							<span class="badge badge-primary">${prefijo} ${meta} ${sufijo}</span><br>
							${(year == session.year && month == session.month) ? "<label>VAA:</label><br>" : ""}
							${(year == session.year && month == session.month) ? `
								<span class="badge badge-primary">${prefijo} ${ventaAnterior} ${sufijo}</span>
							` : ""}<br>
							<span class="badge ${nata.ui.widget.color.claseGet()}">
								123456
							</span>
						</td>
						<td class="text-end w-35">
							<label>Venta:</label><br>
							<span class="badge ${bgColor}">${prefijo} {venta} ${sufijo}</span><br>
							${(year == session.year && month == session.month) ? "<label>PRY:</label><br>" : ""}
							${(year == session.year && month == session.month) ? `
								<span class="badge ${bgColorProyectado}">${prefijo} ${ventaProyectada} ${sufijo}</span>
							` : ""}<br>
							<span class="badge ${bgColorVentaProyectadaVsMeta}">
								${iconCrecimientoVentaProyectadaVsMeta} 
								${porcentajeProyectada}
							</span>
						</td>
						!-->
					</tr>
				</table>

			</div>

		`;
        /* #endregion */

		

        template.innerHTML = html;
        const this_ = this;

        this._shadowRoot = this.attachShadow({ "mode": "open" });
        this._shadowRoot.appendChild(template.content.cloneNode(true));

        // console.log(this_._shadowRoot.getElementById("uiProgressBar"));
        const elProgressBar = this_._shadowRoot.getElementById("uiProgressBar");
        const width = $(elProgressBar).width();
        const elLine = this_._shadowRoot.getElementById("lineProgressBar");
        if (venta > 0) {
            $(elLine)
                .attr("x2", (width - 8) * ((venta / meta)).toFixed(2))
                .removeClass(stroke)
                .addClass(stroke);
        }
    }

    connectedCallback() {
        const self = this;
        const elements = this._shadowRoot.querySelectorAll(".svg-icon-help");
        //console.log(elements);
        var i, content;
        for (i=0; i<elements.length; ++i) {
            if (typeof self.dataset.label != "undefined") {
                content = self.dataset.label;
            }
            else {
                content = self.dataset.titulo + ": " + self.dataset.tipo;
            }
            tippy(elements[i], {
                content: content,
                allowHTML: true	
            });
        }
    }

}

// Define the new element
customElements.define("nata-ui-kpi-cumplimiento", nataUIKpiCumplimiento);