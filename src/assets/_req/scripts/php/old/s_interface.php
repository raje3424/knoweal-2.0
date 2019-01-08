<?PHP
/*
**
** Interface file for store >>
**
*/

include("serverConnector.php");
include("sessionConn.php");
include("infoGetter.php");
include("infoSetter.php");

$operation = $_GET['opt'];
if($operation == ""){
  $kalu = $_POST['opt'];
  $operation = $kalu;
}
$os = new sessionConn;

switch ($operation) {

  case "getAllPacksToDisplay":

    $oInfoG = new infoGetter;
    $query =  $oInfoG->userAdaptor("getAllPacksToDisplay", "none");
    $oScon = new serverConn;
    $oScon->connect();
    $result = $oScon->query_db($query);
    $oScon->closer();
    $data = array();
    while($row = mysql_fetch_array($result)){
      array_push($data, array(
        "id"=>$row['package_id'],
        "title"=>$row['package_name'],
        "creation_d"=>$row['package_creation_date'],
        "user_id"=>$row['package_author'],
        "first_name"=>$row['first_name'],
        "last_name"=>$row['last_name'],
        "version"=>$row['package_version'],
        "description"=>$row['description'],
        "price"=>$row['price']
      ));
    }
    $jdata = json_encode($data);
    echo $jdata;
    break;
    echo $query;
    break;

  case "checkIfPurchased":
    // check if the given pack is already purchased >>
    break;

  case "purchasePack":
    // purchase the given package >>
    break;

  case "checkAndPurchase":
    $data = array(  'user_id' => $_SESSION['id'],
                    'package_id' => $_POST['pack_id']
                  );

    $oInfoG = new infoGetter;
    $query = $oInfoG->userAdaptor("getIfPurchased", $data);
    $oScon = new serverConn;
    $oScon->connect();
    $result = $oScon->query_db($query);
    $oScon->closer();
    $row = mysql_fetch_array($result);
    if($row > 0){
      echo "false";
    }else{
      $oInfoS = new infoSetter;
      $query = $oInfoS->userAdaptor("buyPackage", $data);
      $oScon->connect();
      $result = $oScon->query_db($query);
      $oScon->closer();
      echo $result;
    }

    break;

  case "searchPackage":
  $oInfoG = new infoGetter;
  $text = $_POST['searchPack'];
  $query =  $oInfoG->userAdaptor("getSearchPackage",$text);
  $oScon = new serverConn;
  $oScon->connect();
  $result = $oScon->query_db($query);
  //echo "data is :: ".$query;
  $oScon->closer();
  $data = array();
  while($row = mysql_fetch_array($result)){
    array_push($data, array(
      "id"=>$row['package_id'],
      "title"=>$row['package_name'],
      "creation_d"=>$row['package_creation_date'],
      "user_id"=>$row['package_author'],
      "first_name"=>$row['first_name'],
      "last_name"=>$row['last_name'],
      "version"=>$row['package_version'],
      "description"=>$row['description'],
      "price"=>$row['price']
    ));
  }
  $jdata = json_encode($data);
  echo $jdata;
  break;
  echo $query;
  break;

  default:
    echo "error";
}

?>
