import { Schema } from "./types";

/**
 * Synchronize a set of key/value string pairs into localStorage, writing only when the value changed
 * since the previous invocation for that key. A shadow key (`prev-locsync-<key>`) is maintained to
 * cheaply detect changes and avoid unnecessary writes.
 *
 * Notes:
 * - Values must be strings. Convert complex data with JSON.stringify beforehand.
 * - Function is idempotent for unchanged values.
 * - Does not remove keys that are absent from subsequent calls.
 *
 * @example
 * main({ theme: 'dark', language: 'en-US' });
 *
 * @param schema Record of storage key -> string value to persist
 */
function main(schema: Schema) {
	const schemaKeys = Object.keys(schema);

	schemaKeys.forEach((s) => {
		const prevKey = `prev-locsync-${s}`;
		const val = schema[s];
		const prev = localStorage.getItem(prevKey);
		if (prev != val) {
			localStorage.setItem(s, val);
			localStorage.setItem(prevKey, val);
		}
	});
}

export default main;
