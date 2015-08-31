Template.temp.events({
    'click': function () {

        console.log('Submit clicked');
        var city = 'nowhere';
        var latitude = 0.0;
        var longitude = 0.0;
        var search = {
            location: '8 Westmorland Road, DUrham'
        };

        console.log(search.location);

        city = Meteor.call('getGeoCode', search.location, function (err, data) {
            //just return the first address found and assume this is correct!
            city = data[0].city;
            latitude = data[0].latitude;
            longitude = data[0].longitude;
            Session.set('city', city);
            Session.set('latitude', latitude);
            Session.set('longitude', longitude);

        });
    }
});
Template.temp.helpers({

    city: function () {
        return Session.get("city")
    },
    latitude: function () {
        return Session.get("latitude")
    },
    longitude: function () {
        return Session.get("longitude")
    }
});