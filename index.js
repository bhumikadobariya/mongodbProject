var url = 'mongodb://localhost:27020/train12';
var fs = require('fs');
var MongoClient = require('mongodb').MongoClient;
var tableDisplay = require('./displayTable.js');
var functions = require('./necessaryFunction.js');
var choiceTask = process.argv[2];
var range = process.argv[3];

range = (range === undefined) ? 10 : +(range);

//requried cases
MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var train = db.collection('train');

  switch(choiceTask) {
    case '1' :
        var trainDetailDistance = functions.trainDetail(train,-1,'distance',range,choiceTask);
      break;
    case '2' :
        var trainDetailDistance = functions.trainDetail(train,1,'distance',range,choiceTask);
      break;
    case '3' :
        var resultFinal = [],index = 0;
        train.find().sort({count : 1}).toArray(function(error,results) {
          results = functions.hours(results).sort(functions.objectSort('operationalTask'));
          resultsFinal = functions.minuteToHour(results);
          // console.log(resultsFinal);
          for ( i = resultsFinal.length - 1; i >= resultsFinal.length - range ; i -= 1) {
            resultFinal[index] = resultsFinal[i];
            index += 1;
          }
          tableDisplay.table_train(resultFinal,'Duration',choiceTask);
        });
      break;
    case '4' :
        var resultFinal = [];
        train.find().sort({count : 1}).toArray(function(error,results) {
          results = functions.hours(results).sort(functions.objectSort('operationalTask'));
          resultsFinal = functions.minuteToHour(results);
          // console.log(resultsFinal);
          for ( i = 0 ; i < range ; i += 1) {
            resultFinal[i] = resultsFinal[i];
          }
          tableDisplay.table_train(resultFinal,'Duration',choiceTask);
        });
      break;
    case '5' :
        var trainDetailStation = functions.trainDetail(train,-1,'station',range,choiceTask);
      break;
    case '6' :
        var trainDetailStation = functions.trainDetail(train,1,'station',range,choiceTask);
      break;
    case '7' :
        var trainDetailStation = functions.trainDetail(train,-1,'stationVisited',range,choiceTask);
      break;
    case '8' :
        var trainDetailStation = functions.trainDetail(train,1,'stationVisited',range,choiceTask);
      break;
    default:
      console.log('Enter your choise with number and order for sorting');
      console.log('1    : 10 longest routes in terms of distancetance');
      console.log('2    : 10 shortest routes in terms of distancetance');
      console.log('3    : 10 longest routes in terms of duration');
      console.log('4    : 10 shortest routes in terms of duration');
      console.log('5    : 10 longest routes in terms of number of stations');
      console.log('6    : 10 shortest routes in terms of number of stations');
      console.log('7    : 10 most visited stations');
      console.log('8    : 10 least visited stations');
  }
});

