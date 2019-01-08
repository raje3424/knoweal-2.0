<?PHP

include("serverConnector.php");

$email = $_POST['email'];
$name = $_POST['name'];
$feed = $_POST['feed'];

$query = "INSERT INTO feedback (email, name, feed)";
$query = $query . "VALUES('".$email."',";
$query = $query . "'".$name."',";
$query = $query . "'".$feed."');";
$dbCon = new serverConn;
$dbCon->connect();
$result = $dbCon->query_db($query);
$dbCon->closer();
echo $result;

?>
