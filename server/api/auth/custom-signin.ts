import { H3Event } from 'h3';
import { sendRedirect } from 'h3';

export default defineEventHandler(async (event: H3Event) => {
  const state = generateRandomState();
  const codeChallenge = await generateCodeChallenge();

  const params = new URLSearchParams({
    protocol: 'oauth2',
    response_type: 'code',
    access_type: '', // Si no tienes este valor, déjalo vacío.
    client_id: 'oeb-frontend',
    redirect_uri: 'https://openebench.bsc.es/login',
    scope: 'openid',
    state,
    code_challenge_method: 'S256',
    codeChallenge,
    response_mode: 'fragment'
  });

  const authUrl = `https://inb.bsc.es/auth/realms/openebench/protocol/openid-connect/auth?${params.toString()}`;

  // Redirige al usuario a la URL generada
  return sendRedirect(event, authUrl);
});

// Función para generar un valor de estado aleatorio
function generateRandomState() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// Función para generar el code_challenge
async function generateCodeChallenge() {
  // Implementa la lógica de generación de code_challenge según necesites.
  // Esto podría requerir la utilización de una función hash como SHA-256.
  return 'TMEQMp8fAEtUtHpQQzEJLVN6baChwwZLDm47NssuYEw'; // Ejemplo
}