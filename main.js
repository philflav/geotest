Markers = new Mongo.Collection('markers');

if (Meteor.isClient) {
    Meteor.startup(function () {
        GoogleMaps.load();
    });

    Template.map.helpers({
        mapOptions: function () {
            if (GoogleMaps.loaded()) {
                return {
                    center: new google.maps.LatLng(52.0, -1.0),
                    zoom: 8
                };
            }
        },
        location: function () {
            return Session.get('location');
        }
    });
    Template.map.onCreated(function () {
        GoogleMaps.ready('map', function (map) {
            google.maps.event.addListener(map.instance, 'click', function (event) {
                Markers.insert({lat: event.latLng.lat(), lng: event.latLng.lng()});
            });


            var markers = {};

            Markers.find().observe({
                added: function (document) {
                    // Create a marker for this document
                    var marker = new google.maps.Marker({
                        draggable: true,
                        animation: google.maps.Animation.DROP,
                        position: new google.maps.LatLng(document.lat, document.lng),
                        map: map.instance,
                        // We store the document _id on the marker in order
                        // to update the document within the 'dragend' event below.
                        id: document._id

                    });

                    // This listener lets us drag markers on the map and update their corresponding document.
                    google.maps.event.addListener(marker, 'dragend', function (event) {
                        Markers.update(marker.id, {$set: {lat: event.latLng.lat(), lng: event.latLng.lng()}});
                    });
                    //This listener lets us delete a marker using right click
                    google.maps.event.addListener(marker, 'rightclick', function (event) {
                        Markers.remove(marker.id);
                    });

                    // Store this marker instance within the markers object.
                    markers[document._id] = marker;
                },
                changed: function (newDocument, oldDocument) {
                    var marker=markers[newDocument._id].setPosition({lat: newDocument.lat, lng: newDocument.lng});
                    var infowindow = new google.maps.InfoWindow;
                    var geocoder = new google.maps.Geocoder;
                    var latlng = {lat: newDocument.lat, lng: newDocument.lng};
                    geocoder.geocode({'location': latlng}, function(results, status) {
                    if (status === google.maps.GeocoderStatus.OK) {
                        if (results[1]) {
                          Session.set("location",(results[1].formatted_address));
                          } else {
                          Session.set("location","no location found");
                        }
                    } else {
                        window.alert('Geocoder failed due to: ' + status);
                    }
                });
                },
                removed: function (oldDocument) {
                    // Remove the marker from the map
                    markers[oldDocument._id].setMap(null);

                    // Clear the event listener
                    google.maps.event.clearInstanceListeners(
                        markers[oldDocument._id]);

                    // Remove the reference to this marker instance
                    delete markers[oldDocument._id];
                }
            });
        });
    });
}