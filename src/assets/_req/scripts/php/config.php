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
  $Razor_api_key = "hgvhgvhgvhgvhgvhvg";
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
