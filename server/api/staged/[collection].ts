// /server/api/staged/[collection].ts
import { defineEventHandler, readBody } from 'h3';

export default defineEventHandler(async (event) => {
    const { collection } = event.context.params; // Obtener la colección de la ruta
    const method = event.req.method; // Obtener el método HTTP
    const body = await readBody(event); // Leer el cuerpo de la solicitud
    const token = event.req.headers['authorization']; // Extraer el token de autorización
    const community_id = body.community_id;

    console.log('Colección:', collection);
    console.log('ID de comunidad:', community_id);
    console.log('Método:', method);
    console.log('Cuerpo de la solicitud:', body);
    console.log('token:', token);

    if (!community_id && method === 'POST') {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: "Falta el parámetro 'community_id' en el cuerpo de la solicitud" }),
        };
    }

    try {
        if (method === 'POST') {
            console.log('Simulando respuesta para solicitud POST...');

            let url = `https://dev-openebench.bsc.es/api/scientific/staged/${collection}`;
            console.log('URL:', url);

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });

            // Registro de la respuesta para depuración
            console.log('Respuesta del backend:', response);

            // Devolución de la respuesta directamente al cliente
            return {
                statusCode: response.status,
                body: JSON.stringify(response),
            };
        } else {
            console.error('Error: Método no permitido');
            return {
                status: 405,
                body: JSON.stringify({ error: 'Método no permitido' }),
            };
        }
    } catch (error) {
        console.error('Error en el middleware:', error.message);
        return {
            status: 500,
            body: JSON.stringify({ error: error.message }),
        };
    }
});
