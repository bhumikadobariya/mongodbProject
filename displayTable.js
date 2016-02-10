var Table = require('cli-table');
exports.table_train = function (docs,prop,choice) {
  if ( choice === '1' || choice === '2' || choice === '3' || choice === '4' || choice === '5' || choice === '6') {
    var table = new Table({
      head: ['Train_no',
            'Train_name',
            'Station Name',
            prop,
            'Source Station Name',
            'Destination Station Name',
            ]
    // , colWidths: [10, 18, 10, 18, 8 , 12]
      , colWidths: [9, 16, 16, 8, 14, 8]
      // ,colWidths: [10, 20, 18, 12, 20, 10]
    });
    if (choice === '1' || choice === '3' || choice === '5') {
      docs.forEach(function(doc) {
        table.push([
          +(doc._id.slice(1,6)),
          doc.trainName,
          doc.stationName,
          doc.operationalTask,
          doc.stationName,
          doc.destinationStation
        ]);
      });
    } else if (choice === '2' || choice === '4' || choice === '6') {
      docs.forEach(function(doc) {
        table.push([
          +(doc._id.slice(1,6)),
          doc.trainName,
          doc.stationName,
          doc.operationalTask,
          doc.stationName,
          doc.destinationStation
        ]);
      });
    }
  } else {
      var table = new Table({
        head: ['Station Name',
              prop
              ]
        , colWidths: [20, 20]
      });
      if( choice === '7') {
        docs.forEach(function(doc) {
          table.push([
            doc.stationName,
            doc.operationalTask,
          ]);
        });
      } else {
        docs.forEach(function(doc) {
          table.push([
            doc.stationName,
            doc.operationalTask,
          ]);
        });
      }
    }
  console.log(table.toString());
}
