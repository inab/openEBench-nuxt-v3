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

const _config = ref<OebConfig>({ ..._defaults });

export async function loadOebConfig(): Promise<void> {
  console.group('[oebConfig] loading configuration...');
  try {
    const res = await fetch('/config.json');

    if (!res.ok) {
      console.warn(`⚠️  config.json not found (${res.status}) — using hardcoded defaults`);
      console.table(_defaults);
      console.groupEnd();
      return;
    }

    const overrides: OebConfig = await res.json();

    // show developers exactly what got overridden vs what fell back to default
    const overriddenKeys = Object.keys(overrides);
    const defaultedKeys = Object.keys(_defaults).filter(k => !overriddenKeys.includes(k));

    console.log('✅ config.json loaded successfully');
    console.log('📝 overridden keys:', overriddenKeys);
    if (defaultedKeys.length) {
      console.log('↩️  keys falling back to defaults:', defaultedKeys);
    }

    _config.value = { ..._defaults, ...overrides };
    console.log('🔧 final config:', _config.value);

  } catch (e) {
    console.warn('❌ config.json fetch failed — using hardcoded defaults:', e);
    console.table(_defaults);
  }
  console.groupEnd();
}

export function useOebConfig() {
  return _config;
}