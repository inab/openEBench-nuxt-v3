import { mergeConfig } from '../../shared/mergeConfig';
import { readFile } from 'node:fs/promises';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

// Overridable with OEB_CONFIG_FILE; in the container this is the path to bind-mount
export const configFilePath = () => resolve(process.env.OEB_CONFIG_FILE || 'config/config.json');

const parse = (raw: string): Record<string, unknown> => {
	const parsed = JSON.parse(raw);
	if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
		throw new Error('config file must contain a JSON object');
	}
	return parsed;
};

export async function readConfigFile(): Promise<Record<string, unknown>> {
	try {
		return parse(await readFile(configFilePath(), 'utf8'));
	} catch (error) {
		console.warn(`[config] ${configFilePath()} not usable, using built-in defaults:`, error);
		return {};
	}
}

export function readConfigFileSync(): Record<string, unknown> {
	try {
		return parse(readFileSync(configFilePath(), 'utf8'));
	} catch (error) {
		console.warn(`[config] ${configFilePath()} not usable, using built-in defaults:`, error);
		return {};
	}
}

type PublicConfig = ReturnType<typeof useRuntimeConfig>['public'];
let cached: PublicConfig | undefined;

// Nitro's runtime config is frozen, so server code reads the merged copy from here instead
export function usePublicConfig(): PublicConfig {
	cached ??= mergeConfig(
		JSON.parse(JSON.stringify(useRuntimeConfig().public)),
		readConfigFileSync()
	) as PublicConfig;
	return cached;
}
