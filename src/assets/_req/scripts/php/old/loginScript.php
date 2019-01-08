<?PHP

/**
*
* << LOGIN SCRIPT >>
*
**/

$options = json_decode(file_get_contents("php://input"));

include("serverConnector.php");
include("sessionConn.php");

$user_email = $options->unm;
$user_emailid = md5($user_email);
$key = $options->pass;
$keys = md5($key);
$keys = substr( $keys , 0 , 16 );

$query = "SELECT pass FROM user_instance WHERE email = '$user_emailid'";
$dbCon = new serverConn;
$result = $dbCon->query_db($query);
$dbCon->closer();
$row = mysql_fetch_array($result);

if($row){
  if($row['pass'] == $keys){
    $oSession = new sessionConn;
    $oSession -> session_email_setter($user_email);
    echo "true";
  }else{
    echo "pfalse";
  }
}else{
  echo "efalse";
}

?>
