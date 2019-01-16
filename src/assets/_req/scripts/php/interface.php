<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token , Authorization");

include_once ("palika.php");
include_once ("basic.php");
include_once ("profile.php");
include_once ("jwtGenerator.php");

class r_interface{

  public function userAdaptor($v_class, $v_funct, $v_value){

    $headers = apache_request_headers();
    //print_r($headers);
    //echo " Class >> ".$v_class." function >>".$v_funct;
    $object = $this->objectCreator();

    if (isset($object['jwt'])) {
      // $object['jwt']->testing();
      if (isset($v_value['token'])) {
          //print_r($v_value);
        if ($object['jwt']->DecodeToken($v_value['token'])) {
          if (isset($object[$v_class])) {
            echo json_encode($object[$v_class]->userAdaptor($v_funct, $v_value));
          }
        }else{
          //toke is invalid.
          echo json_encode(array('response' =>'false','errMessage'=>'Token is invalid'));
        }
      }elseif ($v_funct == 'login'|| $v_funct == 'signup') {
        if (isset($object[$v_class])) {
          echo json_encode($object[$v_class]->userAdaptor($v_funct, $v_value));
        }
      }
    }

  }


 private function objectCreator(){
   $objects = array(
     'profile' => new profile,
     'basic' => new basic,
     'palika' => new palika,
     'jwt' => new jwtGenerator
   );
   return $objects;
 }

}

  $data = json_decode(file_get_contents("php://input"), true);
  $or = new r_interface;

  //print_r($data['value']);

  //echo " Class >> ".$data['v_class']." function >>".$data['v_function']." value >> ".$data['value'];
  //print_r($data);
  $or->userAdaptor($data['v_class'], $data['v_function'], $data['value']);

  error_reporting( E_ALL );
  ini_set('display_errors', 1);

?>
