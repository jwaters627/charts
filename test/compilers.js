function noop() { return null; }

require.extensions['.scss'] = noop;
require.extensions['.jpg'] = noop;
require.extensions['.png'] = noop;