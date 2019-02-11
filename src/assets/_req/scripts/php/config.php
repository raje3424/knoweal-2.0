<?php


class config{

protected $response = array();

public function userAdaptor($operation, $value){
  //echo "\nOperation >> ".$operation." << value >> ".$value['email'];
  if($value == "" || $value == " " || $value == NULL){
    return $this->$operation();
  }else{
    return $this->$operation($value);
  }
}

public function setkey($value){
  $Razor_api_key = "rzp_live_HM9LnWIodBW1KJ";// live key
  //$Razor_api_key = "rzp_test_dUGKmqHB19UZUZ";//test key
  //$Razor_api_key = "adasdasdsa";//dumy key
  $response["response"] = "true";
  $response["errMessage"]="Got Razorpay key";
  $response['key'] = $Razor_api_key;
  return $response;
}

public function clearOldResponseData(){
  unset($response);
  $response = array();
}

}
error_reporting( E_ALL );
ini_set('display_errors', 1);

?>
