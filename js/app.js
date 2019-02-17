var carService = require('./carService.js');

// 1. Register the service worker script and log the response
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('../sw.js')
    .then(r => console.log("app.js: Service worker sw.js registered at: ", new Date().toLocaleTimeString()))
    .catch(console.error);
}

// exposes JSON objects globally to other js modules
window.pageEvents = {
    loadCarPage: function(carId) {
        carService.loadCarPage(carId);
    },
    loadMore: function() {
        carService.loadMoreRequest();
    }
}

carService.loadMoreRequest();