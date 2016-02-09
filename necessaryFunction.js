//for agreegate the requried field
var tableDisplay = require('./displayTable.js');
exports.trainDetail = function (train,sortOrder,fieldForGrouping,range,choiceTask) {
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
exports.hours = function (results) {
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
exports.minuteToHour = function (result) {
  for(i = 0 ; i < result.length ; i += 1) {
    m = result[i].operationalTask % 60;
    h = (result[i].operationalTask - m)/60;
    result[i].operationalTask = h.toString() + ':' + (m<10?'0':'') + m.toString();
  }
  return result;
}

//for sorting the object
exports.objectSort = function (property) {
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
