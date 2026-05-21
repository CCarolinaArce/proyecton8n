
export const enviarAWebhook = async (url, formData) => {
    try {
        const response = await fetch(url, {
            method: 'POST',
            body: formData 
        });

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        return response;
    } catch (error) {
        console.error("Error al conectar con n8n:", error);
        throw error;
    }
};