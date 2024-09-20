import { defineEventHandler, readBody } from 'h3';

export default defineEventHandler(async (event) => {

    const { collection } = event.context.params;
    const community_id = event.context.query.community_id;
    const method = event.req.method; // Obtener el método HTTP
    const body = await readBody(event);
    const token = event.req.headers['authorization'];

    console.log('Colección:', collection);
    console.log('ID de comunidad:', community_id);
    console.log('Método:', method);
    console.log('Cuerpo de la solicitud:', body);

    try {
        let response;

        switch (method) {
            case 'POST':

                console.log('POST');
                // Validar que se proporciona un ID en el cuerpo
                if (!body.id) {
                    console.error('Error: ID faltante en el cuerpo para POST');
                    return {
                        status: 400,
                        body: JSON.stringify({ error: 'ID faltante en el cuerpo para POST' }),
                    };
                }

                console.log('Simulando respuesta para solicitud POST...');
                // Simulando una respuesta JSON para POST
                return {
                    status: 201,
                    body: JSON.stringify({
                        message: 'Recurso creado exitosamente',
                        data: {
                            id: body.id, // ID proporcionado
                            ...body, // Incluye el cuerpo que se envió
                        },
                    }),
                };

            case 'PUT':
                // Lógica para manejar PUT
                // if (!id) {
                //     return {
                //         status: 400,
                //         body: JSON.stringify({ error: 'Falta id para PUT' }),
                //     };
                // }
                // response = await fetch(`https://dev-openebench.bsc.es/api/scientific/staged/${collection}/${id}`, {
                //     method: 'PUT',
                //     headers: {
                //         'Authorization': token,
                //         'Content-Type': 'application/json',
                //     },
                //     body: JSON.stringify(body),
                // });
                break;

            case 'PATCH':
                // Lógica para manejar PATCH
                // if (!id) {
                //     return {
                //         status: 400,
                //         body: JSON.stringify({ error: 'Falta id para PATCH' }),
                //     };
                // }
                // response = await fetch(`https://dev-openebench.bsc.es/api/scientific/staged/${collection}/${id}`, {
                //     method: 'PATCH',
                //     headers: {
                //         'Authorization': token,
                //         'Content-Type': 'application/json',
                //     },
                //     body: JSON.stringify(body),
                // });
                break;

            case 'DELETE':
                // Lógica para manejar DELETE
                // if (!id) {
                //     return {
                //         status: 400,
                //         body: JSON.stringify({ error: 'Falta id para DELETE' }),
                //     };
                // }
                // response = await fetch(`https://dev-openebench.bsc.es/api/scientific/staged/${collection}/${id}`, {
                //     method: 'DELETE',
                //     headers: {
                //         'Authorization': token,
                //         'Content-Type': 'application/json',
                //     },
                // });
                break;

            default:
                return {
                    status: 405,
                    body: JSON.stringify({ error: 'Método no permitido' }),
                };
        }

        if (!response.ok) {
            throw new Error('Error en la respuesta de la API externa');
        }

        const data = await response.json();

        return {
            status: response.status,
            body: JSON.stringify(data),
        };
    } catch (error) {
        return {
            status: 500,
            body: JSON.stringify({ error: error.message }),
        };
    }
});