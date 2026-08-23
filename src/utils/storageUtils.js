/**
 * storageUtils.js – localStorage helper functions for UniversityVerse
 * All app keys are prefixed with 'uv_' for namespacing.
 */

const UV_PREFIX = 'uv_';

/**
 * getItem(key, defaultValue) → parsed JSON value or defaultValue
 */
export function getItem(key, defaultValue = null) {
  try {
    const item = localStorage.getItem(key);
    if (item === null) return defaultValue;
    return JSON.parse(item);
  } catch (error) {
    console.warn(`storageUtils.getItem: Error reading "${key}":`, error);
    return defaultValue;
  }
}

/**
 * setItem(key, value) → stores JSON-stringified value in localStorage
 */
export function setItem(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.warn(`storageUtils.setItem: Error writing "${key}":`, error);
    return false;
  }
}

/**
 * removeItem(key) → removes the given key from localStorage
 */
export function removeItem(key) {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.warn(`storageUtils.removeItem: Error removing "${key}":`, error);
    return false;
  }
}

/**
 * clearAll() → removes only keys that start with 'uv_'
 */
export function clearAll() {
  try {
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(UV_PREFIX)) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((k) => localStorage.removeItem(k));
    return keysToRemove.length;
  } catch (error) {
    console.warn('storageUtils.clearAll: Error clearing uv_ keys:', error);
    return 0;
  }
}

/**
 * getStorageSize() → total size of all localStorage data in KB
 */
export function getStorageSize() {
  try {
    let totalBytes = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      const value = localStorage.getItem(key);
      totalBytes += (key ? key.length : 0) + (value ? value.length : 0);
    }
    // Each character in localStorage is stored as UTF-16 (2 bytes)
    return parseFloat(((totalBytes * 2) / 1024).toFixed(2));
  } catch (error) {
    console.warn('storageUtils.getStorageSize: Error computing size:', error);
    return 0;
  }
}

/**
 * getUVStorageSize() → size of only 'uv_' prefixed keys in KB
 */
export function getUVStorageSize() {
  try {
    let totalBytes = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(UV_PREFIX)) {
        const value = localStorage.getItem(key);
        totalBytes += key.length + (value ? value.length : 0);
      }
    }
    return parseFloat(((totalBytes * 2) / 1024).toFixed(2));
  } catch {
    return 0;
  }
}
