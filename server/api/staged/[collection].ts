// /server/api/staged/[collection].ts
import { defineEventHandler, readBody } from "h3";

export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig();

  const { collection } = event.context.params;
  const method = event.req.method;
  const body = await readBody(event);
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

      responseStatus = response.status;

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error en la respuesta de la API:", errorData);
        throw new Error(
          `Error en la respuesta de la API: ${response.statusText}. Detalles: ${errorData.error}`,
        );
      }

      const data = await response.json();
      console.log("Estado:", response.status);
      
      const status = data.Response.status;
      if (data[0] && data[0].errors) {
        console.log("Error:", data[0].errors);
        return {
          status: response.status,
          body: { error: data[0].errors },
        };
      }

      return {
        status: status,
        body: JSON.stringify({
          message: "Community added successfully",
          data: {
            id: body.id,
            ...body,
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
    console.log(error)
    console.log("responseStatus: " , responseStatus)
    console.error("Error en el middleware:", error.message);
    return {
      status: responseStatus || 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
});
