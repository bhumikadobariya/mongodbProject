var url = 'mongodb://localhost:27017/train12'
var fs = require('fs');
var MongoClient = require('mongodb').MongoClient

MongoClient.connect(url, function(err, db) {
  if (err) throw err
  db.createCollection('train', function(err, collection){
    fs.readFile('train.csv', 'utf8', function (err, data) {
    var array2=[];
    var lines = data.split('\n');

      for (var j = 0; j < lines.length; j++) {
        var x=lines[j];

        array2[j] = x.split(",");
        db.collection('train').insert({
          "trainNo": array2[j][0],
          "trainName":array2[j][1],
          "islno":array2[j][2] ,
          "stationCode": array2[j][3],
          "stationName": array2[j][4],
          "arrivalTime":array2[j][5],
          "departureTime": array2[j][6],
          "distance": Number(array2[j][7]),
          "sourceCode": array2[j][8],
          "sourceStation":array2[j][9] ,
          "destinationCode": array2[j][10],
          "destinationStation":array2[j][11] ,
          'count' : j,
        })
      }
    })
  })
})


