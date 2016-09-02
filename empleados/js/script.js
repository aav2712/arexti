w3IncludeHTML(); // Incluye los snippets que tenga referenciados cada html

$().ready(function(){

	// INICIALMENTE LOS FILL-IN DEBEN VENIR VACÍOS
	$("#mLogin").click(function(){
		$("#mLogin").html('Inicie sesión');
		$("#cveEmpresa" ).val("");
		$("#cveEmpleado").val("");
		$("#contrasena" ).val("");
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
			$("#mLogin").html('');
			$("#mensajeEmpresa").html(respuesta.mensajeEmpresa);
			$("#mensajeEmpleado").html(respuesta.mensajeEmpleado);
			$("#mNombre").html(respuesta.nombre + '<span class="caret"></span>');
			$("#btnLoginCierra").click();
			$("#actual-0").click();
			$("#actual").focus().select();
		}).error(function(e){
			alert("Servicio no disponible. Inténtelo más tarde\n(" + e.status + ": " + e.statusText + ")");
		});
	});

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
		$("#actual").html($("#actual-0").html() + ' <span class="caret"></span>');
		leeRecibos($("#actual-4").html());
	});

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

	var ahorita = new Date();
	var ejercicio = ahorita.getFullYear();
	$("#actual").html(ejercicio + ' <span class="caret"></span>');
	$("#actual-0").html(ejercicio - 0);
	$("#actual-1").html(ejercicio - 1);
	$("#actual-2").html(ejercicio - 2);
	$("#actual-3").html(ejercicio - 3);
	$("#actual-4").html(ejercicio - 4);

	$("#mLogin").click();

});

function leeRecibos(ejercicio) {
	$(".contenido").html('<img src="../images/cargando.gif">');
	$.get("recibos.html","",function(recibosHtml){
		var datosJSON = {sessionId:sessionStorage.getItem("sessionId"),
						 ejercicio:ejercicio};
		$.get("recibos.json",datosJSON,function(respuesta){
			if (respuesta[0].resultado != "0") {
				alert(respuesta[0].texto);
				return false;
			}
			$(".contenido").html(recibosHtml);
			for (var i=1;i<respuesta.length;i++) {
				var renglon='<tr onclick="enviar(' + "'" + respuesta[i].recibo + "'" + ')">'
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
};

function enviar(cual) {
	var datosJSON = {sessionId:sessionStorage.getItem("sessionId"),
					 recibo:cual};
	$.get("enviar.json",datosJSON,function(respuesta){
		if (respuesta.resultado != "0") {
			alert(respuesta.texto);
			return false;
		};
		alert("Recibo enviado a su correo.");
		leeRecibos($("#actual").text());
	}).error(function(e){
		alert("Servicio no disponible. Inténtelo más tarde\n(" + e.status + ": " + e.statusText + ")");			
	});
};

