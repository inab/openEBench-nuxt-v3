import { defineEventHandler, readBody } from "h3";

export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig();

  console.log(event.context.query);
  const { collection, id } = event.context.params;
  //const community_id = event.context.query.community_id;
  const method = event.req.method; // Obtener el método HTTP
  const body = await readBody(event);
  const token = event.req.headers["authorization"];

  console.log("Colección:", collection);
  console.log("ID de comunidad:", id);
  console.log("Método:", method);
  console.log("Cuerpo de la solicitud:", body);

  let responseStatus = 0;

  try {
    switch (method) {
      case "PUT":
      case "PATCH":
        console.log(`-*-${method}`);
        console.log(body);
        if (!body._id) {
          console.error("Error: ID faltante en el cuerpo para POST");
          return {
            status: 400,
            body: JSON.stringify({
              error: "ID faltante en el cuerpo para POST",
            }),
          };
        }

        const response = await fetch(
          `${runtimeConfig.public.SCIENTIFIC_SERVICE_URL_API}staged/${collection}/${id}`,
          {
            method,
            headers: {
              Authorization: token,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
          },
        );

        console.log("----token----:" , token)
        console.log("-*-Respuesta:", response);

        const data = await response.json();
        responseStatus = response.status;

        if (responseStatus >= 200 && responseStatus < 300) {
          return {
            status: responseStatus,
            body: JSON.stringify({
              message: "updated successfully.",
              data: {
                id: body._id,
              },
            }),
          };
        } else {
          return {
            status: responseStatus,
            body: JSON.stringify({
              message: data.statusText
                ? data.statusText
                : "could not be updated.",
              data: {
                id: body._id,
              },
            }),
          };
        }
    }
  } catch (error) {
    console.log("An error ocurred: ", error);
    return {
      status: responseStatus && responseStatus != 0 ? responseStatus : 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
});
