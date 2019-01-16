<?php

  include_once("php-jwt/src/BeforeValidException.php");
  include_once("php-jwt/src/ExpiredException.php");
  include_once("php-jwt/src/SignatureInvalidException.php");
  include_once("php-jwt/src/JWT.php");

  use \Firebase\JWT\JWT;

  class jwtGenerator{

    private $private_key = "abc";
    //private $public_key = base64_encode($private_key);

    function key(){
      echo base64_encode($private_key);
    }

    public function EncodeToken($data){
      //echo "In jwtTokenSetter";

      $token = array(
        // $iss => "http://example.org",
        // $aud => "http://example.com",
        // $iat => 1356999524,
        // $nbf => 1357000000,
        "iat" => strtotime(date("Y-m-d H:i:s",time())),
        "data" => $data
      );
      //echo "\nKey is : ".$this->key."\n";
      $jwt = \Firebase\JWT\JWT::encode($token, $this->private_key, $alg = 'HS256', $keyId = null, $head = null);

      //$jwt = JWT::encode($token, $this->key);
      // echo json_encode(
      //       array(
      //           "message" => "Successful login.",
      //           "jwt" => $jwt
      //       )
      //   );
      return $jwt;

    }

    public function IsTokenValid($jwt){
      // if jwt is not empty
      if($jwt){
         // if decode succeed, show user details
        try {
             // decode jwt
            $decoded = JWT::decode($jwt, $this->private_key, array('HS256'));
            //print_r($decoded);
            return true;
            // set user property values here
        }
        // catch failed decoding will be here
        // if decode fails, it means jwt is invalid
        catch (Exception $e){
             // set response code
          //echo "Token is invalid : ".$e->getMessage();
          //return true;
          return false;
            // show error message
            /*echo json_encode(array(
                "message" => "Access denied.",
                "error" => $e->getMessage()
            ));*/
        }
      }
    // error message if jwt is empty will be here
    }

    public function DecodeToken($token){
      // get posted data
    //  $data = json_decode(file_get_contents("php://input"));
    // get posted data
      //$data = json_decode(file_get_contents("php://input"));
      // get jwt
      //$jwt=isset($data->jwt) ? $data->jwt : "";
      //echo base64_encode($this->private_key);
      //echo urlsafeB64Encode($this->private_key);

      $jwt = isset($token) ? $token : "";
      if ($jwt) {
        try {
          //$decoded = \Firebase\JWT\JWT::decode($jwt,$this->private_key, array('HS256'));
          $decoded = JWT::decode($jwt, $this->private_key, array('HS256'));
          // $decoded = JWT::decode($jwt, $this->key, array('HS256'));
          //print_r($decoded);
        //   echo json_encode(array(
        //     "message" => "Access granted.",
        //     "data" => $decoded->data
        // ));
         return $decoded;
        }catch (Exception $e){
          echo "Decode Token is invalid : ".$e->getMessage();
          return array();
        }
      }else{
        echo "Token is empty";
        return array();
      }
      //return $decoded;
    }

    public function destroy(){

    }

    public function testing(){
      // Create token header as a JSON string
    $header = json_encode(['typ' => 'JWT', 'alg' => 'HS256']);

    // Create token payload as a JSON string
    $payload = json_encode(['user_id' => 123]);

    // Encode Header to Base64Url String
    $base64UrlHeader = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($header));

    // Encode Payload to Base64Url String
    $base64UrlPayload = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($payload));

    // Create Signature Hash
    $signature = hash_hmac('sha256', $base64UrlHeader . "." . $base64UrlPayload, 'abC123!', true);

    // Encode Signature to Base64Url String
    $base64UrlSignature = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($signature));

    // Create JWT
    $jwt = $base64UrlHeader . "." . $base64UrlPayload . "." . $base64UrlSignature;

    print_r($jwt);
    }

  }

?>
