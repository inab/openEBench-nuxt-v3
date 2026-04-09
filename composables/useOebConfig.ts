import { ref } from 'vue';

export type OebConfig = Record<string, string>;

const _defaults: Record<string, string> = {
  ENVIRONMENT: 'dev-openebench',
  APP_BASE_URL: 'https://openebench.bsc.es',
  OEB_LEGACY_ANGULAR_URI: 'https://legacy.openebench.bsc.es/',
  VRE_URI: 'https://openebench.bsc.es/vre/home/',
  OBSERVATORY_URI: 'https://observatory.openebench.bsc.es',
  SCIENTIFIC_SERVICE_URL: 'https://openebench.bsc.es/api/scientific',
  SCIENTIFIC_SERVICE_URL_API: 'https://openebench.bsc.es/api/scientific',
  BENCH_EVENT_API_URL: 'https://openebench.bsc.es/rest/bench_event_api',
  OBSERVATORY_API_URL: 'https://observatory.openebench.bsc.es/api',
  GITHUBAPP_API_URL: 'https://observatory.openebench.bsc.es/githubapp/api',
  KEYCLOAK_HOST: 'https://inb.bsc.es',
  KEYCLOAK_REALM: 'openebench',
  KEYCLOAK_CLIENT_ID: 'oeb-frontend',
  AUTH_ORIGIN: 'https://inb.bsc.es',
  REST_API_URL: 'https://openebench.bsc.es/monitor/rest/',
};

// starts with defaults so it's never empty
const _config = ref<OebConfig>({ ..._defaults });

export async function loadOebConfig(): Promise<void> {
  console.log('[oebConfig] starting fetch...');
  try {
    const res = await fetch('/config.json');
    if (!res.ok) {
      console.warn(`config.json not found (${res.status}), using defaults`);
      return;
    }
    const overrides: OebConfig = await res.json();
    console.log('[oebConfig] overrides received:', overrides);
    _config.value = { ..._defaults, ...overrides };
    console.log('[oebConfig] final config:', _config.value);
  } catch (e) {
    console.warn('[oebConfig] fetch failed, using defaults:', e);
  }
}

export function useOebConfig() {
  return _config;
}
