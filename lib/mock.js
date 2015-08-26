// Add navigator so when running in a node environment it exists.
if (!window.navigator) {
  window.navigator = {};
}

// Add location so when running in a node environment it exists.
if (!window.location) {
  window.location = {};
}

// Add document for node
if (!window.document) {
  window.document = {};
}
