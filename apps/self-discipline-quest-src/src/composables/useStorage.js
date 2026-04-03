function readLocalStorage(key, fallbackValue) {
	try {
		const raw = localStorage.getItem(key);
		return raw == null ? fallbackValue : JSON.parse(raw);
	} catch {
		return fallbackValue;
	}
}

function writeLocalStorage(key, value) {
	localStorage.setItem(key, JSON.stringify(value));
}

export function createLocalStorageState(key, fallbackValue) {
	let currentValue = readLocalStorage(key, fallbackValue);

	return {
		get value() {
			return currentValue;
		},
		set value(nextValue) {
			currentValue = nextValue;
			writeLocalStorage(key, currentValue);
		},
	};
}

export function useStorage(key, fallbackValue) {
	return createLocalStorageState(key, fallbackValue);
}
