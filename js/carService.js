define(['./template.js', './clientStorage.js'], function (template, clientStorage) {
    var apiUrlPath = 'https://bstavroulakis.com/pluralsight/courses/progressive-web-apps/service/';
    var apiUrlLatest = apiUrlPath + 'latest-deals.php';
    var apiUrlCar = apiUrlPath + 'car.php?carId=';
        
    /* Fetches the car JSON from the server and caches the data
    within the local cache before calling loadMoreCars() */
    function loadMoreRequest() {
        fetch(apiUrlLatest + '?carId=' + clientStorage.getLastCarId())
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            clientStorage.addCars(data.cars)
            .then(function() {
                loadMoreCars();
            });
        })
    }

    /* Attempts to get cars from the local cache
    and appends the html data to the page */
    function loadMoreCars() {
        clientStorage.getCars()
        .then(function(cars) {
            template.appendCars(cars);
        });
    }

    /*the fetch returns a promise that when resolved returns the response.
     Then we return the text from the response (html string for the popup window)
      that is added to the end of the existing doc html*/
    function loadCarPage(carId) {
        fetch(apiUrlCar + carId)
        .then(function(response) {
            return response.text();
        })
        .then(function(data) {
            document.body.insertAdjacentHTML('beforeend', data);
        })
        .catch(function() {
            alert("Oops, can't retrieve page");
        });
    }
    
    function preCacheDetailsPage(car) {
        if ('serviceWorker' in navigator) {
            var carDetailsUrl = apiUrlCar + car.value.details_id;
            window.caches.open('carDealsCachePagesV1')
            .then(function(cache) {
                cache.match(carDetailsUrl)
                .then(function(response) {
                    if(!response) {
                        cache.add(new Request(carDetailsUrl));
                    } 
                })
            });
        }
    }

    return {
        loadMoreRequest: loadMoreRequest,
        loadCarPage: loadCarPage
    }
});