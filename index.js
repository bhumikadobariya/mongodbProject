var url = 'mongodb://localhost:27020/train12';
var fs = require('fs');
var MongoClient = require('mongodb').MongoClient;
var tableDisplay = require('./displayTable.js');
var choiceTask = process.argv[2];
var range = process.argv[3];

range = (range === undefined) ? 10 : +(range);

//for agreegate the requried field
var trainDetail = function (train,sortOrder,fieldForGrouping) {
  if (fieldForGrouping === 'distance') {
    var groupTrain = train.aggregate([{
      $group : {
        _id: '$trainNo',
        operationalTask: { $max: '$distance' },
        'trainName': { '$last': '$trainName' },
        'stationName': { '$last': '$stationName' },
        'sourceStation': {'$last' : '$sourceStation'},
        'destinationStation': {'$last' : '$destinationStation'},
      }
    }]).sort({ operationalTask : sortOrder }).limit(range).toArray(function(error,results) {
        tableDisplay.table_train(results,'Distance',choiceTask);
      });
  } else if (fieldForGrouping === 'station' || fieldForGrouping === 'stationVisited') {
      if (fieldForGrouping === 'station') {
        field = '$trainNo';
      } else {
        field = '$stationName';
      }
    var groupTrain = train.aggregate([{
      $group : {
        _id: field,
        operationalTask: { $sum: 1 },
        'trainName': { '$last': '$trainName' },
        'stationName': { '$last': '$stationName' },
        'sourceStation': {'$last' : '$sourceStation'},
        'destinationStation': {'$last' : '$destinationStation'},
      }
    }]).sort({ operationalTask : sortOrder }).limit(range).toArray(function(error,results) {
          tableDisplay.table_train(results,'No.OfStation',choiceTask);
      });
  }
  return groupTrain;
}

//for getting the final total minute per station from data
var hours = function (results) {
  for(i = 0; i < results.length; i += 1 ) {
    // console.log(result)
    a = results[i].arrivalTime.slice(1,9);
    b = a.split(':');
    results[i].minutes = (+b[0]) * 60  + (+b[1])+ (+b[2]);
  }
  results.push(0);
  var totalMinute = 0;
  var per_station_diff = [];
  var j = 0;
  var k = 0;
  var uniqueTrainCounter = [];
  var    length = results.length;
  for (i = 0 ; i < length-1; i += 1) {
    if ((results[i].trainNo === results[i + 1].trainNo) && (results[i].minutes > results[i + 1].minutes)) {
      per_station_diff [j] = ((24 * 60) - results[i].minutes) + ( 0 + results[i + 1].minutes);
      j += 1;
    }
    else if ((results[i].trainNo === results[i + 1].trainNo) && (results[i].minutes < results[i + 1].minutes)) {
      per_station_diff[j] = results[i + 1].minutes - results[i].minutes;
      // console.log(per_station_diff[j]);
      j += 1;
    }
    else if (results[i].trainNo !== results[i+1].trainNo) {
      for (j = 0 ; j < per_station_diff.length ; j += 1) {
        totalMinute = totalMinute + (per_station_diff[j]);
      }
      uniqueTrainCounter[k] = {
        operationalTask: totalMinute,
        _id : results[i].trainNo,
        trainName : results[i].trainName,
        stationName : results[i].stationName,
        sourceStation : results[i].sourceStation,
        destinationStation : results[i].destinationStation
      };
      k += 1;
      j = 0;
      totalMinute = 0;
      for (j = 0 ; j < per_station_diff.length ; j += 1) {
        per_station_diff[j] = 0;
      }
    }
  }
  return uniqueTrainCounter;
}

//for convering the minute into hour
var m,h;
var minuteToHour = function (result) {
  for(i = 0 ; i < result.length ; i += 1) {
    m = result[i].operationalTask % 60;
    h = (result[i].operationalTask - m)/60;
    result[i].operationalTask = h.toString() + ':' + (m<10?'0':'') + m.toString();
  }
  return result;
}

//for sorting the object
var objectSort = function (property) {
  var sortOrder = 1;
  if(property[0] === '-') {
    sortOrder = -1;
    property = property.substr(1);
  }
  return function (a,b) {
    var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
    return result * sortOrder;
  }
}

//requried cases
MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var train = db.collection('train');

  switch(choiceTask) {
    case '1' :
        var trainDetailDistance = trainDetail(train,-1,'distance');
      break;
    case '2' :
        var trainDetailDistance = trainDetail(train,1,'distance');
      break;
    case '3' :
        var resultFinal = [],index = 0;
        train.find().sort({count : 1}).toArray(function(error,results) {
          results = hours(results).sort(objectSort('operationalTask'));
          resultsFinal = minuteToHour(results);
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
          results = hours(results).sort(objectSort('operationalTask'));
          resultsFinal = minuteToHour(results);
          // console.log(resultsFinal);
          for ( i = 0 ; i < range ; i += 1) {
            resultFinal[i] = resultsFinal[i];
          }
          tableDisplay.table_train(resultFinal,'Duration',choiceTask);
        });
      break;
    case '5' :
        var trainDetailStation = trainDetail(train,-1,'station');
      break;
    case '6' :
        var trainDetailStation = trainDetail(train,1,'station');
      break;
    case '7' :
        var trainDetailStation = trainDetail(train,-1,'stationVisited');
      break;
    case '8' :
        var trainDetailStation = trainDetail(train,1,'stationVisited');
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

