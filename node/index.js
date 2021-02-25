var mysql = require('mysql');
var mqtt = require('mqtt');


//CREDENCIALES MYSQL
var con = mysql.createConnection({
  host: "localhost",
  user: "admin_basegaten",
  password: "39496625leo",
  database: "admin_basegaten"
});

//CREDENCIALES MQTT
var options = {
  port: 1883,
  host: 'gatewaymultip.ml',
  clientId: 'acces_control_server_' + Math.round(Math.random() * (0- 10000) * -1) ,
  username: 'web_client',
  password: '741852963',
  keepalive: 60,
  reconnectPeriod: 1000,
  protocolId: 'MQIsdp',
  protocolVersion: 3,
  clean: true,
  encoding: 'utf8'
};




//const https = require('https');
//const fs = require('fs');

// serve the API with signed certificate on 443 (SSL/HTTPS) port
//const httpsServer = https.createServer({
  //key: fs.readFileSync('/etc/letsencrypt/live/my_api_url/privkey.pem'),
  //cert: fs.readFileSync('/etc/letsencrypt/live/my_api_url/fullchain.pem'),
//}, app);

//httpsServer.listen(443, () => {
    //console.log('HTTPS Server running on port 443');
//});
var client = mqtt.connect("mqtt://gatewaymultip.ml", options);

//SE REALIZA LA CONEXION
client.on('connect', function () {
  console.log("Conexión  MQTT Exitosa!");
  client.subscribe('+/#', function (err) {
    console.log("Subscripción exitosa!")
  });
})

  //CUANDO SE RECIBE MENSAJE
  client.on('message', function (topic, message) {
  console.log("Mensaje recibido desde -> " + topic + " Mensaje -> " + message.toString());
  var topic_splitted = topic.split("/");
  var serial_number = topic_splitted[0];
  var query = topic_splitted[1];
  console.log(query)

  if(query=="insert_msjsent_query"){
    var data_msj = message.toString();
    //hacemos la consulta
    var query = "SELECT * FROM devices WHERE devices_serie = '" + serial_number + "'";
    con.query(query, function (err, result, fields) {
      if (err) throw err;
      if(result.length==1){
      var query = "INSERT INTO `admin_basegaten`.`msj_enviados` (`msj_data`, `msj_users_id`, `msj_devices_id`) VALUES ('" + data_msj + "', " + result[0].devices_user_id + ", " + result[0].devices_id + ");";
      con.query(query, function (err, result, fields) {
        console.log(result);
        if (err) throw err;
        console.log("Ingreso registrado en 'msj' ");
      });
    }


    });

  }

  if(query=="insert_msjtaken_query"){
    var data_msj = message.toString();
    //hacemos la consulta
    var query = "SELECT * FROM devices WHERE devices_serie = '" + serial_number + "'";
    con.query(query, function (err, result, fields) {
      if (err) throw err;
      if(result.length==1){
      var query = "INSERT INTO `admin_basegaten`.`msj_recibidos` (`msj_data`, `msj_users_id`, `msj_devices_id`) VALUES ('" + data_msj + "', " + result[0].devices_user_id + ", " + result[0].devices_id + ");";
      con.query(query, function (err, result, fields) {
        console.log(result);
        if (err) throw err;
        console.log("Ingreso registrado en 'msj' ");
      });
    }


    });

  }

});




//nos conectamos
con.connect(function(err){
  if (err) throw err;

  //una vez conectados, podemos hacer consultas.
  console.log("Conexión a MYSQL exitosa!!!")

  //hacemos la consulta
  var query = "SELECT * FROM devices WHERE 1";
  con.query(query, function (err, result, fields) {
    if (err) throw err;
    if(result.length>0){
      console.log(result);
    }
  });

});



//para mantener la sesión con mysql abierta
setInterval(function () {
  var query ='SELECT 1 + 1 as result';

  con.query(query, function (err, result, fields) {
    if (err) throw err;
  });

}, 5000);
