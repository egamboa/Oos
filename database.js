var mongodb = require('mongodb');
 var db = new mongodb.Db('nodejitsu_estebang_nodejitsudb6357688524',
   new mongodb.Server('ds039257.mongolab.com', 39257, {})
 );
 db.open(function (err, db_p) {
   if (err) { throw err; }
   db.authenticate('nodejitsu_estebang', '9vg14d9v4834d053fvl6a9kas7', function (err, replies) {
     // You are now connected and authenticated.
   });
 });