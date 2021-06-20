## Readme.md


Make sure mongodb is installed and the service is running on the machine
If not please follow the steps given at:
https://docs.mongodb.com/manual/installation/

### Create the DB
```
mongo
use Dairy;
```

### To run the server: 
```
npm install
node app.js
```

### To add a dairy
Send a post request on 
```
{hostname}/dairy
```
with following params
```
name
openTime
closeTime
loc (comma separated lattitude and longitude as string. 
     Ensure there is no space)
```

### To get dairies near a given location
Send a get request with query param _loc_ to /dairy
eg: 
```
{hostname}/dairy?q=32.7,45.6
```
