<?php

error_reporting( E_ALL );
ini_set('display_errors', 1);

interface dbx_connection
{
  const host = "localhost";
  const manus = "root";
  const nibai = "root";
  const dbnav = "cathod_db";

  function query_db($query, $args);
  function db_connection();
  function db_close();
}

// Prints: Interface constant
class connector implements dbx_connection{
  var $conn = null; // << the global connection object

  function __construct(){
    $this->conn = mysqli_connect(dbx_connection::host, dbx_connection::manus, dbx_connection::nibai, dbx_connection::dbnav);

   //   if(!$this->conn){
   //   echo "no c <br/> \n";
   // }
  }

  function db_connection(){
    $this->conn = mysqli_connect(dbx_connection::host, dbx_connection::manus, dbx_connection::nibai, dbx_connection::dbnav);
    if($this->conn)
    //  echo "yes dbconnected \n";
      return "true";
    else
      //echo "nop not connected<br/> \n";
      return "false";
  }

  function query_db($query, $args){
    $result = null;
    if($this->conn){
      if($args){
        if(is_array($args)){ // if it's an array
          foreach ($args as $index => $value) {
            $args[$index] = mysqli_real_escape_string($this->conn, $value);
          }
          $query = vsprintf( str_replace("?","'%s'",$query),$args);
          $result = mysqli_query($this->conn, $query);
        }else{ // if it's a single argument and not an array
          $query = vsprintf( str_replace("?","'%s'",$query),$args);
          $result = mysqli_query($this->conn, $query);
        }
      }else{
        $result = mysqli_query($this->conn, $query);
      }
    }else{
      echo "stil no";
    }
    return $result;
  }

  function db_close(){
    mysqli_close($this->conn);
  }

}

/*
$o = new connector();
$query = "SELECT * FROM feed_back WHERE name = ? and id = ?";
$re = $o->query_db($query, array('Rohit', '4'));
$i = 0;
while($row = mysqli_fetch_array($re)){
  echo " R >> ".$row['id'];
}
*/

?>
