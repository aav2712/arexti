w3IncludeHTML(); // Incluye los snippets que tenga referenciados cada html

/*
 * ASIGNA FUNCIONES A ELEMENTOS
 */
$().ready(function(){

	/*
	 * INICIAR SESIÓN
	 */
	 
	// AL INICIAR SESIÓN LOS FILL-IN DEBEN VENIR VACÍOS
	$("#mLogin").click(function(){
		$("#mLogin").html('Inicie sesión');
		$("#cveEmpresa" ).val("");
		$("#cveEmpleado").val("");
		$("#contrasena" ).val("");
		$("#empresa").html("¡Soluciones transaccionales para la nube que sí funcionan!");
		$("#empleado").html('Software Arex<small><sup><span class="glyphicon glyphicon-copyright-mark"></span></sup></small>');
		sessionStorage.removeItem("sessionId");
		$("#mNombre").html('[Inicie sesión]<span class="caret"></span>');
	});

	// CUANDO CLICK EN EL BOTÓN ENTRAR, AUTENTICA AL USUARIO
	$("#btnLogin").click(function(){
		var datosJSON = {cveEmpresa:$("#cveEmpresa").val(),
						 cveEmpleado:$("#cveEmpleado").val(),
						 contrasena:$("#contrasena").val()};
		$.get("login.json",datosJSON,function(respuesta){
			if (respuesta.resultado != "0") {
				alert(respuesta.texto);
				return false;
			}
			sessionStorage.setItem("sessionId",respuesta.sessionId);
			if (respuesta.empresa != "") {$("#empresa").html(respuesta.empresa)};
			if (respuesta.nombre != "") {$("#empleado").html(respuesta.nombre)};
			$("#mLogin").html('');
			$("#mensajeEmpresa").html(respuesta.mensajeEmpresa);
			$("#mensajeEmpleado").html(respuesta.mensajeEmpleado);
			$("#btnLoginCierra").click();
			$("#actual-0").click();
		}).error(function(e){
			alert("Servicio no disponible. Inténtelo más tarde\n(" + e.status + ": " + e.statusText + ")");
		});
	});

	/*
	 * CUANDO CLICK EN CADA AÑO, LEE LOS RECIBOS DE DICHO AÑO
	 */
	$("#actual-0").click(function(){
		$("#actual").html($("#actual-0").html() + ' <span class="caret"></span>');
		leeRecibos($("#actual-0").html());
	});
	$("#actual-1").click(function(){
		$("#actual").html($("#actual-1").html() + ' <span class="caret"></span>');
		leeRecibos($("#actual-1").html());
	});
	$("#actual-2").click(function(){
		$("#actual").html($("#actual-2").html() + ' <span class="caret"></span>');
		leeRecibos($("#actual-2").html());
	});
	$("#actual-3").click(function(){
		$("#actual").html($("#actual-3").html() + ' <span class="caret"></span>');
		leeRecibos($("#actual-3").html());
	});
	$("#actual-4").click(function(){
		$("#actual").html($("#actual-4").html() + ' <span class="caret"></span>');
		leeRecibos($("#actual-4").html());
	});

	/*
	 * MODIFICAR eMail
	 */
	// AL INVOCAR VENTANA EMERGENTE, CONSULTA eMail DEL EMPLEADO
	$("#mMail").click(function(){
		var datosJSON={sessionId:sessionStorage.getItem("sessionId")};
		$.get("eMail.json",datosJSON,function(respuesta){
			if (respuesta.resultado != "0") {
				alert(respuesta.texto);
				return false;
			}
			$("#eMail").val(respuesta.eMail);
		}).error(function(e){
			alert("Servicio no disponible. Inténtelo más tarde\n(" + e.status + ": " + e.statusText + ")");			
		});
	});
	// ACTUALIZA eMail
	$("#btnMail").click(function(){
		var datosJSON={sessionId:sessionStorage.getItem("sessionId"),
					   eMail:$("#eMail").val()};
		$.get("eMailActualiza.json",datosJSON,function(respuesta){
			if (respuesta.resultado != "0") {
				alert(respuesta.texto);
				return false;
			};
			$("#btnMailCierra").click();
			alert("¡eMail actualizado exitosamente!");
		}).error(function(e){
			alert("Servicio no disponible. Inténtelo más tarde\n(" + e.status + ": " + e.statusText + ")");			
		});
	});

	/*
	 * MODIFICAR CONTRASEÑA
	 */
	$("#btnContrasena").click(function(){
		var datosJSON={sessionId:sessionStorage.getItem("sessionId"),
					   anterior:$("#contrasenaAnterior").val(),
					   nueva:$("#nuevaContrasena").val(),
					   nueva:$("#repitaContrasena").val()};
		$.get("contrasenaActualiza.json",datosJSON,function(respuesta){
			if (respuesta.resultado != "0") {
				alert(respuesta.texto);
				return false;
			};
			$("#btnContrasenaCierra").click();
			alert("¡Contraseña actualizada exitosamente!");
		}).error(function(e){
			alert("Servicio no disponible. Inténtelo más tarde\n(" + e.status + ": " + e.statusText + ")");			
		});
	});

	/*
	 * VALORES INICIARLES PARA LOS AÑOS DISPONIBLES
	 */
	var ahorita = new Date();
	var ejercicio = ahorita.getFullYear();
	$("#actual").html(ejercicio + ' <span class="caret"></span>');
	$("#actual-0").html(ejercicio - 0);
	$("#actual-1").html(ejercicio - 1);
	$("#actual-2").html(ejercicio - 2);
	$("#actual-3").html(ejercicio - 3);
	$("#actual-4").html(ejercicio - 4);

	/*
	 * INVOCA LA VENTANA DE INICIAR SESIÓN
	 */
	$("#mLogin").click();
});

/*
 * LEE RECIBOS DEL EJERCICIO ESPECIFICADO
 */
function leeRecibos(ejercicio) {
	// ANIMACIÓN DE CARGANDO...
	$(".contenido").html('<img src="../images/cargando.gif">');
	// LEE HTML CON EL FORMATO DE LOS RECIBOS
	$.get("recibos.html","",function(recibosHtml){
		// LEE RECIBOS DEL EMPELADO EN EL EJERCICIO ESPECIFICADO
		var datosJSON = {sessionId:sessionStorage.getItem("sessionId"),
						 ejercicio:ejercicio};
		$.get("recibos.json",datosJSON,function(respuesta){
			// LLAMADA HTTP EXITOSA, PERO HUBO ALGÚN PROBLEMA
			if (respuesta[0].resultado != "0") {
				alert(respuesta[0].texto);
				return false;
			}
			// INSERTA HTML DE ENCABEZADOS
			$(".contenido").html(recibosHtml);
			// INSERTA RENGLÓN POR CADA RECIBO DISPONIBLE
			for (var i=1;i<respuesta.length;i++) {
				var renglon='<tr style="cursor:pointer" onclick="enviar(' + "'" + respuesta[i].recibo + "'" + ')">'
				           +'<td>' + respuesta[i].nomina    + '</td>'
				           +'<td>' + respuesta[i].periodo   + '</td>'
				           +'<td>' + respuesta[i].depto     + '</td>'
				           +'<td>' + respuesta[i].puesto    + '</td>'
				           +'<td>' + respuesta[i].descargas + '</td>'
				           +'<td><img src="../images/eMail.jpg" width="30" height="30"></td>' 
						   +'</tr>';
				$(".table").append(renglon);
			};
		}).error(function(e){
			alert("Servicio no disponible. Inténtelo más tarde\n(" + e.status + ": " + e.statusText + ")");			
		});
	}).error(function(e){
		alert("Snippet de recibos no disponible. Notifíquelo a Soporte\n(" + e.status + ": " + e.statusText + ")");						
	});
	// FOCUS EN EL SELECTOR DE AÑO
	$("#actual").focus();	
};

/*
 * ENVÍA RECIBO ESPECIFICADO POR CORREO
 */
function enviar(cual) {
	var datosJSON = {sessionId:sessionStorage.getItem("sessionId"),
					 recibo:cual};
	$.get("enviar.json",datosJSON,function(respuesta){
		// LLAMADA HTTP EXITOSA, PERO HUBO ALGÚN PROBLEMA
		if (respuesta.resultado != "0") {
			alert(respuesta.texto);
			return false;
		};
		alert("Recibo enviado a su correo.");
		// ACTUALIZA DESPLIEGUE DE LOS RECIBOS PORQUE SE INCREMENTA EL NÚMERO DE DESCARGAS
		leeRecibos($("#actual").text());
	}).error(function(e){
		alert("Servicio no disponible. Inténtelo más tarde\n(" + e.status + ": " + e.statusText + ")");			
	});
};