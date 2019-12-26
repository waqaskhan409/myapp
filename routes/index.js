var express = require('express');
var router = express.Router();
var mysql = require("mysql");
const multer = require("multer");

var fs = require("fs");
var upload = multer()


var connection = mysql.createConnection({
  host: "192.168.64.2",
  user: "root",
  password: "root",
  database: "DistrictsProjects"
});

/* GET home page. */
router.get('/', function (req, res, next) {
  // console.log("alskjaslkdjaslkdj");
  res.send("Hello, world!")
});

var singleFile = upload.fields([{
  name: "image"
}])
router.post('/api/create_projects_data', singleFile, function (req, res, next) {
  var lat, lng, districts, projects_id, image, project_id_psdp;
  projects_id = req.body.projects_id;
  districts = req.body.district;
  lat = req.body.lat;
  lng = req.body.lng;
  project_id_psdp = req.body.project_id_psdp;
  // image = req.files['image'][0];
  // console.log(image);

  image = saveFile(req.files['image'][0]);
  var success = {
    success: "Succesfully posted"
  }


  connection.query(`INSERT INTO projects VALUES ("${projects_id}" , "${districts}", "${project_id_psdp}",  ${lat} , ${lng}, "${image}", current_timestamp())`, function (error, results, fields) {
    if (error) throw error;
    res.send(success);
  })

});

router.get('/api/get_projects_data', function (req, res, next) {
  connection.query("SELECT * FROM `projects` ORDER BY `projects`.`created_at` DESC", function (error, results, fields) {
    if (error) throw error;
    res.send(results);
  })
});


function saveFile(file) {
  var fileName = file["fieldname"] + "-" + Date.now();
  var extension = file["mimetype"].split("/");
  fs.appendFile(__dirname + "/../public/images/" + fileName + "." + extension[1], file["buffer"], function (err) {
    if (err) throw err;
    console.log(__dirname + "/../uploads/" + fileName + "." + extension[1]);
  });


  return fileName + "." + extension[1];
}


module.exports = router;