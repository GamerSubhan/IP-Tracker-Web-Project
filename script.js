var map = L.map('map').setView([51.505, -0.09], 13);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

var customizedIcon = L.icon({
    iconUrl: 'images/icon-location.svg',

    iconSize:     [46, 56],
    iconAnchor:   [22, 94],
    popupAnchor:  [-3, -76] 
});

navigator.geolocation.watchPosition(success, error);

let marker, circle;

const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');

searchButton.addEventListener('click', () => {
    if(searchInput.value.trim() !== '') {
        const apiKey = 'at_CCBUsfeqmfSjkOmeUypHB1WyTALRv';
        const ipOrDomain = searchInput.value;
        fetch(`https://geo.ipify.org/api/v2/country,city?apiKey=${apiKey}&ipAddress=${ipOrDomain}`)
        .then(res => res.json())
        .then(data => {
            UpdateContent(data);

            const latitude = data.location.lat;
            const longtitude = data.location.lng;

            if(marker)
            {
                map.removeLayer(marker);
                map.removeLayer(circle);
            }

            marker = L.marker([latitude, longtitude], {icon: customizedIcon}).addTo(map);
            circle = L.circle([latitude, longtitude], {radius: 60}).addTo(map);

            map.fitBounds(circle.getBounds());
        })
    }
});


function success(data) {
    const longtitude =  data.coords.longitude;
    const latitude = data.coords.latitude;
    const accuaracy = data.coords.accuracy;

    if(marker)
    {
        map.removeLayer(marker);
        map.removeLayer(circle);
    }

    marker = L.marker([latitude, longtitude], {icon: customizedIcon}).addTo(map);
    circle = L.circle([latitude, longtitude], {radius: accuaracy}).addTo(map);

    console.log(circle);

    map.fitBounds(circle.getBounds());
}


function error(data) {
    if(data.code === 1)
    {
        window.alert("Please allow geolocation access");
    }
    else
    {
        window.alert("Cannot get current location");
    }
}

const apiKey = 'at_CCBUsfeqmfSjkOmeUypHB1WyTALRv';

fetch(`https://geo.ipify.org/api/v2/country,city?apiKey=${apiKey}`)
.then(res => res.json())
.then(data => {
    UpdateContent(data);
});

function UpdateContent(data) {
    const ipAddress = document.getElementById('ip');
    const location = document.getElementById('location');
    const timezone = document.getElementById('timezone');
    const isp = document.getElementById('isp');

    ipAddress.textContent = data.ip;
    location.textContent = data.location.city + ',' + data.location.country;
    timezone.textContent = data.location.timezone;
    isp.textContent = data.isp;

    console.log(data);
}
