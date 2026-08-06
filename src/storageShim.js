// Minimal window.storage.get/set implementation backed by localStorage,
// standing in for the host environment's key/value API during local demos.
window.storage = {
  async get(key) {
    const value = localStorage.getItem(key);
    return value === null ? null : { value };
  },
  async set(key, value) {
    localStorage.setItem(key, value);
  },
};
