#!/bin/sh
# Inicia el servidor Node.js en segundo plano
node /app/server/index.mjs &

# Inicia Nginx
nginx -g "daemon off;"