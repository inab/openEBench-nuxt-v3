// /server/api/staged/[collection].ts
import { defineEventHandler, getRequestHeader, getRouterParams, readBody } from 'h3';

export default defineEventHandler(async (event) => {
	const runtimeConfig = useRuntimeConfig();

	const { collection } = getRouterParams(event);
	const method = event.req.method;
	let body = await readBody(event);
	const token = getRequestHeader(event, 'authorization') ?? '';
	const community_id = body.community_id;

	console.log('Colección:', collection);
	console.log('ID de comunidad:', community_id);
	console.log('Método:', method);
	console.log('Cuerpo de la solicitud:', body);
	console.log('token:', token);

	try {
		if (method === 'POST') {
			console.log('Simulando respuesta para solicitud POST...');

			const url = `${runtimeConfig.public.SCIENTIFIC_SERVICE_URL_API}staged/${collection}`;
			console.log('URL:', url);

			if (collection === 'Community') {
				body = [body];
			}

			const response = await fetch(url, {
				method: 'POST',
				headers: {
					Authorization: token,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(body),
			});

			console.log('Respuesta:', response);
			console.log(token);

			const data = await response.json();
			console.log('📦 JSON recibido:', JSON.stringify(data, null, 2));

			const status = response.status;

			console.log('data: ', data);

			if (status >= 200 && status < 300) {
				return {
					status: status,
					body: JSON.stringify({
						message: 'created successfully',
						data: {
							id: data._id,
							...data,
						},
					}),
				};
			} else {
				return {
					status: status,
					body: JSON.stringify({
						message: 'create error',
						data: {
							id: data._id,
							...data,
						},
					}),
				};
			}
		}
	} catch (error) {
		return {
			status: 500,
			body: JSON.stringify({ error: (error as Error).message }),
		};
	}
});
