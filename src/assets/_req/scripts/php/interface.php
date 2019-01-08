<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token , Authorization");

include_once ("palika.php");
include_once ("basic.php");
include_once ("profile.php");

class r_interface{

  public function userAdaptor($v_class, $v_funct, $v_value){
    //echo " Class >> ".$v_class." function >>".$v_funct;
    $object = $this->objectCreator();
    if (isset($object[$v_class])) {

      echo json_encode($object[$v_class]->userAdaptor($v_funct, $v_value));
    }
  }


 private function objectCreator(){
   $objects = array(
     'profile' => new profile,
     'basic' => new basic,
     'palika' => new palika
   );
   return $objects;
 }

}
  
  $data = json_decode(file_get_contents("php://input"), true);
  $or = new r_interface;
  //print_r($data);

  //echo " Class >> ".$data['v_class']." function >>".$data['v_function']." value >> ".$data['value'];
  //print_r($data);
  $or->userAdaptor($data['v_class'], $data['v_function'], $data['value']);

  // error_reporting( E_ALL );
  // ini_set('display_errors', 1);

?>
