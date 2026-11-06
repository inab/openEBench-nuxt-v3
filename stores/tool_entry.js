import { defineStore } from 'pinia';

//
function availabilityItems(payload) {
	const items =
		payload?.data || payload?.results || payload?.items || payload?.availability || payload;

	return Array.isArray(items) ? items : [];
}

const LEGACY_GALAXY_FREIBURG_HOST = 'galaxy.bi.uni-freiburg.de';

function fixGalaxyFreiburgUrl(url) {
	let parsed;
	try {
		parsed = new URL(url);
	} catch {
		return url;
	}

	if (parsed.hostname.toLowerCase() !== LEGACY_GALAXY_FREIBURG_HOST) return url;

	const toolId = parsed.searchParams.get('tool_id');
	if (!toolId) return 'https://usegalaxy.eu/';

	const segments = toolId.split('/').filter(Boolean);
	const reposIndex = segments.indexOf('repos');
	const shortId =
		reposIndex !== -1 && segments.length > reposIndex + 3 ? segments[reposIndex + 3] : toolId;

	return `https://usegalaxy.eu/root?tool_id=${encodeURIComponent(shortId)}`;
}

function normalizeTool(tool) {
	if (!tool || !Array.isArray(tool.webpage)) return tool;
	return {
		...tool,
		webpage: tool.webpage.map((webpage) =>
			webpage?.term ? { ...webpage, term: fixGalaxyFreiburgUrl(webpage.term) } : webpage
		),
	};
}

export const useToolEntryStore = defineStore('tool_entry', {
	state: () => ({
		tool: {},
		loading: true,
		edamDialog: false,
		webAvailabilityRequestKey: '',
		webAvailabilityUrl: '',
		webAvailability: {
			week: [],
			month: [],
			sixMonths: [],
		},
		webAvailabilityLoading: false,
		webAvailabilityError: null,
		webAvailabilityNoData: false,
		citations: {},
		loadingCitations: {},
		similarTools: [],
		loadingSimilar: false,
	}),

	getters: {
		Tool: (state) => state.tool,
		Loading: (state) => state.loading,
		EdamDialog: (state) => state.edamDialog,
		WebAvailabilityRequestKey: (state) => state.webAvailabilityRequestKey,
		WebAvailabilityUrl: (state) => state.webAvailabilityUrl,
		WebAvailability: (state) => state.webAvailability,
		WebAvailabilityLoading: (state) => state.webAvailabilityLoading,
		WebAvailabilityError: (state) => state.webAvailabilityError,
		WebAvailabilityNoData: (state) => state.webAvailabilityNoData,
		Citations: (state) => state.citations,
		LoadingCitations: (state) => state.loadingCitations,
		SimilarTools: (state) => state.similarTools,
		LoadingSimilar: (state) => state.loadingSimilar,
	},

	actions: {
		async retrieveTool(payload) {
			const { $observatory } = useNuxtApp();

			// Loading
			this.loading = true;
			this.resetWebAvailability();
			this.updateSimilarTools([]);

			try {
				// Prefer fetching by id if available, fall back to name
				const query = payload.id
					? `api/tools?id=${encodeURIComponent(payload.id)}&documentation_status=true`
					: `api/tools?name=${encodeURIComponent(payload.name)}&documentation_status=true`;

				const data = await $observatory(query, { method: 'GET' });

				// Treat an empty array / missing payload / object lacking a label
				// (the field the entry page relies on) as "tool not found".
				const tool = Array.isArray(data) ? data[0] : data;

				if (!tool || !tool.label) {
					this.updateTool({});
					return false;
				}
				this.updateTool(normalizeTool(tool));
				return true;
			} catch (error) {
				this.updateTool({});
				if (error?.response?.status === 404) {
					return false;
				}
				throw error;
			} finally {
				this.loading = false;
			}
		},

		async resolveToolId({ name, source = 'biotools' }) {
			const { $observatory } = useNuxtApp();

			try {
				const response = await $observatory(
					`api/tool/id?name=${encodeURIComponent(name)}&source=${encodeURIComponent(source)}`,
					{
						method: 'GET',
					}
				);
				return response?.id || response?.data?.id || null;
			} catch {
				return null;
			}
		},

		async retrieveSimilarTools(toolId) {
			const { $observatory } = useNuxtApp();

			if (!toolId) {
				this.updateSimilarTools([]);
				return;
			}
			this.loadingSimilar = true;

			try {
				const response = await $observatory(`/similarity?tool_id=${encodeURIComponent(toolId)}`, {
					method: 'GET',
				});
				const similar = response?.similar || response?.data?.similar || [];
				this.updateSimilarTools(Array.isArray(similar) ? similar : []);
			} catch {
				this.updateSimilarTools([]);
			} finally {
				this.loadingSimilar = false;
			}
		},

		async retrieveWebAvailability(webpages) {
			const { $observatory } = useNuxtApp();

			const webpageList = (Array.isArray(webpages) ? webpages : [webpages]).filter(Boolean);

			if (!webpageList.length) {
				this.resetWebAvailability();
				return;
			}

			const requestKey = webpageList.join('|');
			const ranges = [
				{ key: 'week', endpoint: '/api/web-availability/week' },
				{ key: 'month', endpoint: '/api/web-availability/month' },
				{ key: 'sixMonths', endpoint: '/api/web-availability/6months' },
			];

			this.resetWebAvailability();
			this.updateWebAvailabilityRequestKey(requestKey);
			this.webAvailabilityLoading = true;

			try {
				// Nivel externo: una entrada por webpage
				const resultsByWebpage = await Promise.all(
					webpageList.map(async (webpage) => {
						// Nivel interno: una entrada por rango (week/month/sixMonths)
						const results = await Promise.all(
							ranges.map(async ({ key, endpoint }) => {
								try {
									const response = await $observatory(endpoint, {
										method: 'POST',
										body: { url: webpage },
									});
									const data = availabilityItems(response);
									return { key, data, error: null };
								} catch (error) {
									const is404 = error?.response?.status === 404;
									// 404 = no está monitorizada = sin datos, no es un error real
									return { key, data: [], error: is404 ? null : error };
								}
							})
						);
						return { webpage, results };
					})
				);

				// Petición obsoleta (el usuario cambió de tool mientras esperábamos)
				if (this.webAvailabilityRequestKey !== requestKey) {
					return;
				}

				// Buscamos la primera webpage que sí tenga datos en algún rango
				const selected = resultsByWebpage.find(({ results }) => {
					return results.some(({ data }) => availabilityItems(data).length > 0);
				});

				if (selected) {
					this.updateWebAvailabilityUrl(selected.webpage);
					selected.results.forEach(({ key, data }) => {
						this.updateWebAvailabilityRange({ key, data });
					});
					return;
				}

				const allFailed = resultsByWebpage.every(({ results }) => {
					return results.every(({ error }) => error);
				});

				this.webAvailabilityNoData = true;

				if (allFailed) {
					this.webAvailabilityError = new Error('Unable to retrieve uptime data');
				}
			} catch (error) {
				this.webAvailabilityError = error;
			} finally {
				if (this.webAvailabilityRequestKey === requestKey) {
					this.webAvailabilityLoading = false;
				}
			}
		},

		// Returns the latest weekly uptime status for each webpage.
		async retrieveWebAvailabilityStatuses(webpages) {
			const { $observatory } = useNuxtApp();
			const webpageList = (Array.isArray(webpages) ? webpages : [webpages]).filter(Boolean);
			
			const entries =	await Promise.all(
				webpageList.map(async (webpage) => {
					try {
						const response = await $observatory('/api/web-availability/week', {
							method: 'POST',
							body: { url: webpage },
						});
						const items = availabilityItems(response);

						if (!items.length) return [webpage, 'NODATA'];

						const datedItems = items
							.map((item) => ({ item, date: Date.parse(item?.date) }))
							.filter(({ date }) => !Number.isNaN(date))
							.sort((first, second) => first.date - second.date);
						const latestItem = datedItems[datedItems.length - 1]?.item || items[0];

						if (latestItem?.code == null) return [webpage, 'NODATA'];

						const code = Number(latestItem?.code);
						return [webpage, code >= 200 && code < 400 ? 'UP' : 'DOWN'];
					} catch (error) {
						return [webpage, error?.response?.status === 404 ? 'NODATA' : 'ERROR'];
					}
				})
			)
			return Object.fromEntries(entries);
		},

		async fetchCitations({ doi, pmid, title } = {}) {
			const { $observatory } = useNuxtApp();

			const key = doi || pmid || title;
			if (!key) return;
			if (key in this.citations) return;

			this.updateLoadingCitations({ doi: key, value: true });

			const attempts = [
				doi ? { doi } : null,
				pmid ? { pmid } : null,
				title ? { title } : null,
			].filter(Boolean);

			let data = null;
			for (const body of attempts) {
				try {
					const response = await $observatory('/api/publication/citations', {
						method: 'POST',
						body: body,
					});
					data = response;
					break; // éxito, no seguir intentando
				} catch {
					// este identificador falló, probar el siguiente
				}
			}

			this.updateCitations({ doi: key, data });
			this.updateLoadingCitations({ doi: key, value: false });
		},

		// Reset
		resetWebAvailability() {
			this.webAvailabilityRequestKey = '';
			this.webAvailabilityUrl = '';
			this.webAvailability = {
				week: [],
				month: [],
				sixMonths: [],
			};
			this.webAvailabilityLoading = false;
			this.webAvailabilityError = null;
			this.webAvailabilityNoData = false;
		},
		updateSimilarTools(payload) {
			this.similarTools = payload;
		},
		updateTool(payload) {
			this.tool = payload;
		},
		updateWebAvailabilityRequestKey(payload) {
			this.webAvailabilityRequestKey = payload;
		},
		updateWebAvailabilityUrl(payload) {
			this.webAvailabilityUrl = payload;
		},
		updateWebAvailabilityRange({ key, data }) {
			this.webAvailability[key] = data;
		},
		updateLoadingCitations({ doi, value }) {
			this.loadingCitations = { ...this.loadingCitations, [doi]: value };
		},
		updateCitations({ doi, data }) {
			this.citations = { ...this.citations, [doi]: data };
		},
	},
});
