
async function submitForm() {
    const formData = new FormData(document.getElementById('productForm'));

    try {
        const response = await fetch('/products/multer', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al crear el producto');
        }

        const result = await response.json();
        alert(result.message);
    } catch (error) {
        console.error('Error al enviar el formulario:', error);
        alert('error en solicitud'+error)
    }
}
