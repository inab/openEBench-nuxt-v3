// /server/api/staged/[collection].ts
import { defineEventHandler, readBody } from "h3";

export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig();

  const { collection } = event.context.params;
  const method = event.req.method;
  let body = await readBody(event);
  const token = event.req.headers["authorization"];
  const community_id = body.community_id;

  console.log("Colección:", collection);
  console.log("ID de comunidad:", community_id);
  console.log("Método:", method);
  console.log("Cuerpo de la solicitud:", body);
  console.log("token:", token);

  let responseStatus = 0;

  try {
    if (method === "POST") {
      console.log("Simulando respuesta para solicitud POST...");

      const url = `${runtimeConfig.public.SCIENTIFIC_SERVICE_URL_API}staged/${collection}`;
      console.log("URL:", url);

      if (collection === "Community") {
        body = [body];
      }

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

      const data = await response.json();
      console.log("📦 JSON recibido:", JSON.stringify(data, null, 2));

      const status = response.status;

      console.log("data: " , data);

      if (!data || !data._id) {
        console.error("❌ Respuesta inesperada de la API:", data);
        throw new Error(`Error en la respuesta de la API: ${response.statusText}`);
      }

      return {
        status: status,
        body: JSON.stringify({
          message: "Community updated successfully",
          data: {
            id: data._id,
            ...data,
          },
        }),
      };
    }
  } catch (error) {
    return {
      status: response.status,
      body: JSON.stringify({ error: error.message }),
    };
  }
});
