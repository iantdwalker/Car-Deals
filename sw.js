const version = 1;

// 2. Install the service worker and cache offline resources (before fetch events are intercepted)
self.addEventListener('install', function(event) {
    console.log("**SW** Service worker sw.js installed at: ", new Date().toLocaleTimeString());
    event.waitUntil(
        caches.open('PWA demo cache v' + version)
        .then(function (cache) {
            return cache.addAll(['/img/offline.svg',
            'css/offline.css',
            './offline.html']);
        })
    );    
});

// 3. Activate the service worker
self.addEventListener('activate', function(event) {
    console.log("**SW** Service worker sw.js activated at: ", new Date().toLocaleTimeString());    
});

// 4. Intercepting fetch events to implement a 'cache first strategy'
self.addEventListener('fetch', function(event) {
    console.log('**SW** Fetch event intercepted for: ' + event.request.url);
    event.respondWith(
        caches.match(event.request)
        .then(function (response) {
            if (response) {
                console.log('   >>>> Response found in the cache!');
                return response;
            }

            if (!navigator.onLine) {
                console.log('   >>>> client is currently offline!');
                return caches.match(new Request('./offline.html'));
            }

            console.log('   >>>> Currently online: fetching and updating cache from the server!');
            return fetchAndUpdateCache(event.request);
        })
    );
});

function fetchAndUpdateCache(request) {
    return fetch(request)
    .then(function (response) {
        if (response) {
            return caches.open('PWA demo cache v' + version)
            .then(function (cache) {
                return cache.put(request, response.clone())
                .then(function () {
                    return response;
                });
            });
        }
    });
}