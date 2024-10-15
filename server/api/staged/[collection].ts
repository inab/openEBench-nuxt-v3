// /server/api/staged/[collection].ts
import { defineEventHandler, readBody } from "h3";

export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig();

  const { collection } = event.context.params; // Obtener la colección de la ruta
  const method = event.req.method; // Obtener el método HTTP
  const body = await readBody(event); // Leer el cuerpo de la solicitud
  const token = event.req.headers["authorization"]; // Extraer el token de autorización
  const community_id = body.community_id;

  console.log("Colección:", collection);
  console.log("ID de comunidad:", community_id);
  console.log("Método:", method);
  console.log("Cuerpo de la solicitud:", body);
  console.log("token:", token);

  try {
    if (method === "POST") {
      console.log("Simulando respuesta para solicitud POST...");

      const url = `${runtimeConfig.public.SCIENTIFIC_SERVICE_URL_API}/staged/${collection}`;
      console.log("URL:", url);

      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      console.log("Respuesta:", response);
      console.log(token);

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error en la respuesta de la API:", errorData);
        throw new Error(
          `Error en la respuesta de la API: ${response.statusText}. Detalles: ${errorData.error}`,
        );
      }

      const data = await response.json();
      console.log("Respuesta:", data);
      console.log("Estado:", response.status);
      if (data[0] && data[0].errors) {
        console.log("Error:", data[0].errors);
        return {
          status: response.status,
          body: { error: data[0].errors },
        };
      }

      return {
        status: 200,
        body: JSON.stringify({
          message: "Community added successfully",
          data: {
            id: body.id, // ID proporcionado
            ...body, // Incluye el cuerpo que se envió
          },
        }),
      };
    } else {
      console.error("Error: Método no permitido");
      return {
        status: 405,
        body: JSON.stringify({ error: "Método no permitido" }),
      };
    }
  } catch (error) {
    console.error("Error en el middleware:", error.message);
    return {
      status: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
});
