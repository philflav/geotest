Meteor.methods({
    getGeoCode: function(search ,result) {
        var geo = new GeoCoder();
        result = geo.geocode(search);
        console.log(result);

        return result;
    }
});