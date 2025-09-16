# Locsync

> Ultra-light localStorage synchronizer – declaratively push a set of key/value pairs and Locsync
> writes only what actually changed.

<p align="left">
  <a href="LICENSE"><img alt="License" src="https://img.shields.io/badge/license-MIT-blue.svg" /></a>
  <a href="https://www.npmjs.com/package/locsync"><img alt="npm version" src="https://img.shields.io/npm/v/locsync.svg" /></a>
  <img alt="types included" src="https://img.shields.io/badge/types-Included-informational" />
  <img alt="zero dependencies" src="https://img.shields.io/badge/deps-0-brightgreen" />
  <img alt="bundle size" src="https://img.shields.io/badge/bundle-%3C1KB%20gzip-green" />
</p>

Locsync gives you a single function to idempotently ensure a collection of values is present and
current in `localStorage` while skipping redundant writes. Great for persisting lightweight UI /
session state, feature flags, cached timestamps, and user preferences.

## Features

- **Write Avoidance** – Skips values that haven't changed (reduces churn & flash of stale state)
- **Declarative** – Call once per render / event loop; it's idempotent
- **Deterministic** – No timers, no async race conditions
- **TypeScript First** – Strongly typed schema
- **Zero Dependencies** – Tiny, auditable
- **UMD / ESM / CJS Builds** – Works everywhere you need it

## When To Use

Use Locsync when you want a simple, low-level primitive to mirror ephemeral runtime data into
`localStorage` without building a reactive layer. If you need diffs, events, or reactive replay,
pair it with your state management solution.

## Installation

### Using npm

```bash
npm install locsync
```

### Using pnpm

```bash
pnpm add locsync
```

### Using yarn

```bash
yarn add locsync
```

## Quick Start

### Basic Example

```javascript
import locsync from "locsync";

// Define your schema
const userSettings = {
	theme: "dark",
	language: "en",
	notifications: "enabled"
};

// Sync to localStorage
locsync(userSettings);
```

### In Browser (UMD)

```html
<!DOCTYPE html>
<html>
	<head>
		<title>My App</title>
	</head>
	<body>
		<script src="https://unpkg.com/locsync/dist/index.umd.js"></script>
		<script>
			// locsync is available globally
			locsync({
				userId: "12345",
				preferences: "compact"
			});
		</script>
	</body>
</html>
```

### TypeScript Usage

```typescript
import locsync from "locsync";
import type { Schema } from "locsync";

const schema: Schema = {
	apiKey: "your-api-key",
	cacheExpiry: "3600000"
};

locsync(schema);
```

## API

### `locsync(schema: Schema)`

Synchronizes the provided schema with localStorage.

- **Parameters:**
    - `schema` (Schema): An object where keys are localStorage keys and values are the data to store
- **Returns:** `void`

### Schema Type

```typescript
type Schema = Record<string, string>;
```

All values must be strings. If you need to store complex data, stringify it first:

```javascript
locsync({
	userData: JSON.stringify({ name: "John", age: 30 }),
	settings: JSON.stringify({ theme: "dark" })
});
```

## How It Works (Internals)

1. For each key in the schema, locsync checks if the value has changed since the last sync
2. If changed, it updates localStorage with the new value
3. It maintains a "previous value" cache to detect changes efficiently
4. Unchanged values are skipped to optimize performance

## Examples

### User Preferences

```javascript
const preferences = {
	"app-theme": "light",
	"sidebar-collapsed": "false",
	"language": "en-US"
};

locsync(preferences);
```

### Form Data Persistence

```javascript
const formData = {
	"form-step": "2",
	"user-email": "user@example.com",
	"draft-content": JSON.stringify(editorContent)
};

locsync(formData);
```

### Application State

```javascript
const appState = {
	"current-view": "dashboard",
	"last-login": new Date().toISOString(),
	"session-id": generateSessionId()
};

locsync(appState);
```

## Advanced Usage

### Serializing Complex Data

You can provide only string values. Serialize objects/arrays ahead of time:

```ts
locsync({
	filters: JSON.stringify(activeFilters),
	cache: JSON.stringify({ v: 2, expires: Date.now() + 60000 })
});
```

### Namespacing Keys

Keep keys scoped to your app / feature to avoid collisions:

```ts
const ns = (k: string) => `myapp:${k}`;
locsync({
	[ns("session")]: sessionId,
	[ns("draft:v1")]: draftContentHash
});
```

### Guarding for Non-Browser Environments

If you share code with SSR or Node contexts, wrap the call:

```ts
if (typeof window !== "undefined" && "localStorage" in window) {
	locsync(schema);
}
```

### Batching With Other Persistence

Call Locsync after you finalize derived values (e.g., in a React effect):

```tsx
useEffect(() => {
	locsync({ "ui:theme": theme, "ui:collapsed": String(isCollapsed) });
}, [theme, isCollapsed]);
```

### Avoiding Unbounded Growth

Locsync never deletes keys. If you version keys (e.g., `feature:x:v2`) remember to prune old ones
with a manual cleanup script if needed.

## Performance Notes

- Each call does: `Object.keys` + up to 2 `localStorage` ops per changed key
- Unchanged keys: 1 `getItem` + 0 writes
- Changed keys: 1 `getItem` + 2 writes (value + previous marker)
- Complexity: O(n) where n = number of keys provided

Tips:

- Group related keys and call Locsync once per UI cycle
- Avoid passing large serialized payloads repeatedly; hash them first if size matters

## Troubleshooting

| Symptom                       | Likely Cause                  | Fix                                             |
| ----------------------------- | ----------------------------- | ----------------------------------------------- |
| Values not updating           | Passing same string each call | This is expected – only changed values flush    |
| Quota exceeded                | Storing very large JSON blobs | Compress or prune; use IndexedDB for large data |
| Nothing happens SSR           | No `localStorage` on server   | Guard calls (see Non-Browser example)           |
| Key collision with other libs | Generic key names             | Prefix / namespace keys                         |

## FAQ

**Why store a previous copy (`prev-locsync-<key>`)?**  
To detect changes without reading and parsing your original serialized structures. It lets us skip
rewriting unchanged values.

**Can I store numbers / booleans?**  
Yes—convert them to strings first (JS does this implicitly in template literals):
`locsync({ count: String(count) });`

**Does it debounce / throttle?**  
No. Keep calls minimal yourself—idempotence makes extra calls inexpensive.

**Will it work in private mode?**  
Yes in most browsers, unless storage is disabled. Wrap in a `try/catch` for hardened scenarios.

**How do I remove keys?**  
Manually call `localStorage.removeItem(key)`; Locsync only syncs provided keys.

## Roadmap

- Optional diff / changed keys return value
- Pluggable storage adapter (sessionStorage, memory)
- Key expiration helper utilities
- Devtool / logging flag

Star the repo to follow progress or open an issue to upvote a feature.

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## Security

Locsync writes only the literal strings you provide. Do not store secrets, tokens, or PII in
`localStorage`—it is accessible to any script running on the page.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for version history.
