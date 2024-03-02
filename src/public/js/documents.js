document.addEventListener('DOMContentLoaded', function() {
    const uploadForm = document.getElementById('uploadForm');
    const alertContainer = document.getElementById('alertContainer');

    uploadForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        try {
            const formData = new FormData(uploadForm);
            const response = await fetch(uploadForm.action, {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (data.success) {
                showAlert('success', data.message);
            } else {
                showAlert('danger', 'Hubo un problema al actualizar los documentos.');
            }
        } catch (error) {
            console.error('Error al enviar el formulario:', error);
            showAlert('danger', 'Hubo un problema al enviar el formulario.');
        }
    });

    function showAlert(type, message) {
        const alertDiv = document.createElement('div');
        alertDiv.classList.add('alert', `alert-${type}`);
        alertDiv.textContent = message;

        alertContainer.innerHTML = '';
        alertContainer.appendChild(alertDiv);
    }
});