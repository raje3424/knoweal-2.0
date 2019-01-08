
<?php
// This file is used for encrption and description
class dataED
{
  public function userAdaptor($case,$val){
    switch($case){
      case 'encrpt':
      $data = $this->encrption($val);
      break;
      case 'decrpt':
      $data = $this->decyption($val);
      break;

    }
    return $data;
  }
  private function encrption($val){
    $data = base64_encode($val);
    return $data;
  }

  private function decyption($val){
    $decoded = "";
    $strlen = strlen($str);
    for( $i = 0; $i < strlen($encoded); $i++ ) {
      $b = ord($encoded[$i]);
      $a = $b ^ 123;  // <-- must be same number used to encode the character
      $decoded .= chr($a);
    }
    $data = $decoded;
    return $data;
  }
}
?>
