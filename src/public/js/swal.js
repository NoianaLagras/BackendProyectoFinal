document.addEventListener("DOMContentLoaded", function() {
    const btn = document.querySelector(".btn-success");
    const nombreUsuario = btn ? btn.textContent.trim().replace("👤", "") : "";
    const esAdmin = btn ? nombreUsuario.includes("Administrador") : false;
  
    let mensajeBienvenida = `Bienvenido, ${nombreUsuario}`;
    if (esAdmin) {
      mensajeBienvenida += " (Administrador)";
    } else {
      mensajeBienvenida += " (Usuario)";
    }
  
    Swal.fire({
      icon: "success",
      title: "¡Bienvenido!",
      text: mensajeBienvenida,
    });
  });