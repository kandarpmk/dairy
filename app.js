const express = require('express');
const cors = require('cors');
const Dairy = require('./models');

// express app configuration
app = express();
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

// constants
const port = 3000
const MAXDISTANCE = 5

// utility functions
const validateLatLong = (latlong) => {
    const [ lat, long ] = latlong
    const isLatitude = lat => isFinite(num) && Math.abs(num) <= 90;
    const isLongitude = long => isFinite(num) && Math.abs(num) <= 180;
    return isLatitude && isLongitude
}
const createPoint = (latlong) => {
    [lat, long] = latlong.split(',');
    return { type: 'Point', coordinates: [Number(lat), Number(long)] }
}


// routes

// 1. route to add a dairy 
app.post('/dairy', function(request, response){
    const data = request.body;
    console.log('Req: ',data);
    if (!data.loc.includes(',') || !validateLatLong(data.loc.split(',')))
        response.status(400).send('Invalid lat long provided.');
    if (!data.name || !data.openTime || !data.closeTime)
        response.status(400).send('Invalid request params provided.');

    const dairy = {
        name: data.name,
        openTime: data.openTime,
        closeTime: data.closeTime,
        loc: createPoint(data.loc)
    };
    const _dairy = new Dairy(dairy);
    _dairy.save()
    .then(()=>response.status(201).send('Added '+data.name))
    .catch((err)=>{
        console.log(err);
        response
        .status(500)
        .send('Unable to save the Dairy. Please try again')
    });
});

// 2. route to fetch dairies based on a given lat long position
// query param "loc"
// to try on localhost: http://127.0.0.1:3000/dairy?loc=32.3,45.7
app.get('/dairy', function(request, response){
    const loc = request.query.loc;
    if (!loc.includes(',') || !validateLatLong(loc.split(','))){
        response.status(400).send('Invalid lat long provided');
    }
    const points = createPoint(loc);
    Dairy.find({
        loc: {
            $near: points,
            $maxDistance: MAXDISTANCE
        }
    }).exec((err,dairies) => {
        if(err){
            console.log(err);
            response.status(500).send('Unable to get the data');
        }
        if(null !== dairies){
            const flatDairies = dairies.map(function(diary) {
                return diary.toObject();
              })
              return response.status(200).send(JSON.stringify(flatDairies));
        }
        else{
            return response.status(200).send(JSON.stringify([{}]));
        }
    });
});

app.listen(port,()=>{console.log("Listening at: "+port)});