// Served dynamically (not from public/) so a bind-mounted file is always returned as-is
export default defineEventHandler(async (event) => {
	setHeader(event, 'Cache-Control', 'no-store');
	return await readConfigFile();
});
