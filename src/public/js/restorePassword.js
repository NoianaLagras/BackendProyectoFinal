function showAlert(message, className) {
  const alertDiv = document.createElement('div');
  alertDiv.className = `alert ${className} mt-3`;
  alertDiv.setAttribute('role', 'alert');
  alertDiv.appendChild(document.createTextNode(message));

  const container = document.querySelector('.sesionesChild');

  container.insertBefore(alertDiv, container.firstChild);

  setTimeout(() => {
      alertDiv.remove();
  }, 10000);
}

document.getElementById('restorePasswordForm').addEventListener('submit', function (event) {
  event.preventDefault();

  const newPassword = document.getElementById('newPassword').value;
  const confirmPassword = document.getElementById('confirmPassword').value;
  const token = window.location.pathname.split('/').pop();
  console.log('Token enviado en la solicitud:', token);

  if (newPassword !== confirmPassword) {
      showAlert('Las contraseñas no coinciden.', 'alert-danger');
      return;
  }

  console.log('Token enviado en la solicitud:', token);

  fetch(`http://localhost:8080/api/sessions/restorePassword/${token}`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          newPassword,
      }),
  })
  .then(response => {
      if (!response.ok) {
          throw new Error('Error al restablecer la contraseña');
      }
      return response.json();
  })
  .then(data => {
      if (data.error) {
          if (data.error === 'No puedes restablecer la contraseña con la misma contraseña actual') {
              showAlert(data.error, 'alert-warning');
          } else {
              showAlert(data.error, 'alert-danger');
          }
      } else if (data.success) {
          showAlert(data.success, 'alert-success');
          window.location.href = '/login';
      } else {
          showAlert('Error desconocido durante el restablecimiento de la contraseña.', 'alert-danger');
      }
  })
  .catch(error => {
      console.error('Error durante el restablecimiento de la contraseña:', error);
      showAlert('Error durante el restablecimiento de la contraseña. Por favor, inténtalo de nuevo más tarde.', 'alert-danger');
  });
});
