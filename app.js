
// 1. Importamos la función de conexión
import { enviarAWebhook } from './webhook.js';

const N8N_WEBHOOK_URL = 'http://localhost:5678/webhook-test/recepcion-justificadores'; 

// 3. Seleccionamos los elementos del HTML
const form = document.getElementById('inasistenciaForm');
const submitBtn = document.getElementById('submitBtn');
const statusMessage = document.getElementById('statusMessage');
const inputs = form.querySelectorAll('input:not([type="file"]), select');

// --- LÓGICA DE LOCALSTORAGE (Borrador) ---
// Cargar datos guardados al entrar a la página
inputs.forEach(input => {
    const savedValue = localStorage.getItem(`draft_${input.name}`);
    if (savedValue) input.value = savedValue;
});

// Guardar datos mientras el usuario escribe
inputs.forEach(input => {
    input.addEventListener('input', (e) => {
        localStorage.setItem(`draft_${e.target.name}`, e.target.value);
    });
});

// --- LÓGICA DE ENVÍO A N8N ---
form.addEventListener('submit', async (event) => {
    event.preventDefault();

    if(N8N_WEBHOOK_URL === 'AQUI_TU_URL_DE_N8N') {
        statusMessage.textContent = 'Error: Configura la URL del Webhook en app.js';
        statusMessage.className = 'status error';
        return;
    }

    // FormData empaqueta automáticamente todos los campos (nombre, correo, archivo)
    const formData = new FormData(form);

    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando...';
    statusMessage.textContent = '';

    try {
        // Ejecutamos la función importada
        await enviarAWebhook(N8N_WEBHOOK_URL, formData);
        
        statusMessage.textContent = '¡Solicitud enviada con éxito!';
        statusMessage.className = 'status success';
        form.reset();
        
        // Limpiamos el borrador
        inputs.forEach(input => localStorage.removeItem(`draft_${input.name}`));
        
    } catch (error) {
        statusMessage.textContent = 'Hubo un error al enviar. Verifica tu conexión a n8n.';
        statusMessage.className = 'status error';
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Enviar Justificación';
    }
});
