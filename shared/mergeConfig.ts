type Dict = Record<string, unknown>;

const isDict = (value: unknown): value is Dict =>
	!!value && typeof value === 'object' && !Array.isArray(value);

// Deep-merges `source` into `target` in place, keeping object references stable
export function mergeConfig(target: Dict, source: Dict): Dict {
	for (const [key, value] of Object.entries(source)) {
		if (key === '__proto__' || key === 'constructor' || key === 'prototype') continue;
		if (isDict(value) && isDict(target[key])) {
			mergeConfig(target[key], value);
		} else {
			target[key] = value;
		}
	}
	return target;
}
