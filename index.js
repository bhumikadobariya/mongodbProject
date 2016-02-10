var url = 'mongodb://localhost:27021/train12';
var fs = require('fs');
var MongoClient = require('mongodb').MongoClient;
var tableDisplay = require('./displayTable.js');
var functionsTrain = require('./necessaryFunction.js');
var choiceTask = process.argv[2];
var range = process.argv[3];

range = (range === undefined) ? 10 : +(range);

//requried cases
MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var train = db.collection('train');

  switch(choiceTask) {

    case '1' :

        var trainDetailDistance = functionsTrain.trainDetail(train,-1,'distance',range,choiceTask);

      break;

    case '2' :

        var trainDetailDistance = functionsTrain.trainDetail(train,1,'distance',range,choiceTask);

      break;

    case '3' :

        var index = 0;

        train
          .find()
          .sort({count : 1})
          .toArray(function(error,results) {

            results = functionsTrain.hours(results).sort(functionsTrain.objectSort('operationalTask'));

            resultsFinal = functionsTrain.minuteToHour(results);

            resultsFinal = resultsFinal.slice(resultsFinal.length - range ,resultsFinal.length);
            resultsFinal.reverse();

            tableDisplay.table_train(resultsFinal,'Duration',choiceTask);
        });

      break;

    case '4' :

        train
          .find()
          .sort({count : 1})
          .toArray(function(error,results) {

            results = functionsTrain.hours(results).sort(functionsTrain.objectSort('operationalTask'));

            resultsFinal = functionsTrain.minuteToHour(results);

            resultsFinal = resultsFinal.slice(0 ,range);

            tableDisplay.table_train(resultsFinal,'Duration',choiceTask);
        });
      break;
    case '5' :
        var trainDetailStation = functionsTrain.trainDetail(train,-1,'station',range,choiceTask);
      break;
    case '6' :
        var trainDetailStation = functionsTrain.trainDetail(train,1,'station',range,choiceTask);
      break;
    case '7' :
        var trainDetailStation = functionsTrain.trainDetail(train,-1,'stationVisited',range,choiceTask);
      break;
    case '8' :
        var trainDetailStation = functionsTrain.trainDetail(train,1,'stationVisited',range,choiceTask);
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

