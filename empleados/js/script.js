w3IncludeHTML(); // Incluye los snippets que tenga referenciados cada html

$().ready(function(){

	// INICIALMENTE LOS FILL-IN DEBEN VENIR VACÍOS
	$("#mLogin").click(function(){
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
			console.log(respuesta);
			if (respuesta.resultado != "0") {
				alert(respuesta.texto);
				return false;
			}
			sessionStorage.setItem("sessionId",respuesta.sessionId);
			$("#mensajeEmpresa").html(respuesta.mensajeEmpresa);
			$("#mensajeEmpleado").html(respuesta.mensajeEmpleado);
			$("#mNombre").html(respuesta.nombre + '<span class="caret"></span>');
			$("#btnLoginCierra").click();
			$("#actual-0").click();
		}).error(function(e){
			alert("Servicio no disponible. Inténtelo más tarde\n(" + e.status + ": " + e.statusText + ")");
		});
	});

	$("#actual-0").click(function(){
		$("#actual").html(this.text + ' <span class="caret"></span>');
		leeRecibos(this.text);
	});
	$("#actual-1").click(function(){
		$("#actual").html(this.text + ' <span class="caret"></span>');
		leeRecibos(this.text);
	});
	$("#actual-2").click(function(){
		$("#actual").html(this.text + ' <span class="caret"></span>');
		leeRecibos(this.text);
	});
	$("#actual-3").click(function(){
		$("#actual").html(this.text + ' <span class="caret"></span>');
		leeRecibos(this.text);
	});
	$("#actual-4").click(function(){
		$("#actual").html(this.text + ' <span class="caret"></span>');
		leeRecibos(this.text);
	});

	function leeRecibos(ejercicio) {
		$(".contenido").html('<img src="../images/cargando.gif">');
		$.get("recibos.html","",function(recibosHtml){
			var datosJSON = {sessionId:sessionStorage.getItem("sessionId"),
							 ejercicio:ejercicio};
			$.get("recibos.json",datosJSON,function(respuesta){
				if (respuesta[0].resultado != "0") {
					alert(respuesta.texto);
					return false;
				}
				$(".contenido").html(recibosHtml);
				for (var i=1;i<respuesta.length;i++) {
					var renglon='<tr>'
					           +'<td>' + respuesta[i].nomina  + '</td>'
					           +'<td>' + respuesta[i].periodo + '</td>'
					           +'<td>' + respuesta[i].depto   + '</td>'
					           +'<td>' + respuesta[i].puesto  + '</td>'
					           +'<td><a class="enviar"  recibo="' + respuesta[i].recibo + '" href="#"><img src="../images/eMail.jpg" width="30" height="30"></a></td>' 
							   +'</tr>';
					$(".table").append(renglon);
				};
			}).error(function(e){
				alert("Servicio no disponible. Inténtelo más tarde\n(" + e.status + ": " + e.statusText + ")");			
			});
		}).error(function(e){
			alert("Snippet de recibos no disponible. Notifíquelo a Soporte\n(" + e.status + ": " + e.statusText + ")");						
		});
	}

	var ahorita = new Date();
	$("#actual").html(ahorita.getFullYear() + ' <span class="caret"></span>');
	$("#actual-0").html(ahorita.getFullYear() - 0);
	$("#actual-1").html(ahorita.getFullYear() - 1);
	$("#actual-2").html(ahorita.getFullYear() - 2);
	$("#actual-3").html(ahorita.getFullYear() - 3);
	$("#actual-4").html(ahorita.getFullYear() - 4);

	$("#mLogin").click();

});
