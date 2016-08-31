w3IncludeHTML(); // Incluye los snippets que tenga referenciados cada html

$().ready(function(){

	$("#mLogin").click(function(){
		$("#cveEmpresa").val("");
		$("#cveEmpleado").val("");
		$("#contrasena").val("");
		sessionStorage.removeItem("sessionId");
		$("#mNombre").html('[Inicie sesión]<span class="caret"></span>');
	});

	$("#btnLogin").click(function(){
		var datosJSON = {
			cveEmpresa:$("#cveEmpresa").val(),
			cveEmpleado:$("#cveEmpleado").val(),
			contrasena:$("#contrasena").val()
		};

		$.post("login.json",datosJSON,function(respuesta){
			if (respuesta.resultado != "0") {
				alert(respuesta.texto);
				return false;
			}
			sessionStorage.setItem("sessionId",respuesta.sessionId);
			$("#btnLoginCierra").click();
			$("#mNombre").html(respuesta.nombre + '<span class="caret"></span>');
			var ahorita = new Date();
			$("#ejercicio").val(ahorita.getFullYear());
		}
		).error(function(e){
			alert("Servicio no disponible. Inténtelo más tarde\n(" + e.status + ": " + e.statusText + ")");
		});
	});

	$("#mLogin").click();

});
