<?php
require 'vendor/autoload.php';

use SparkPost\SparkPost;
use GuzzleHttp\Client;
use Http\Adapter\Guzzle6\Client as GuzzleAdapter;

$httpClient = new GuzzleAdapter(new Client());
$sparky = new SparkPost($httpClient, ['key'=>'c78d2fed5e21260e3007da448c7a5d0f14b03688']);
$sparky->setOptions(['async' => false]);
$email="sarra8161@gmail.com";
$results = $sparky->transmissions->post([
  'options' => [
    'sandbox' => false
  ],
  'content' => [
    'from' => 'newsletters@mail.vidaa.in',
    'subject' => 'Oh hey',
    'html' => '<html><body><p>Testing SparkPost - the most awesomest email service!</p><p>Please verify your email using following link <a href="http://localhost:8888/conf_email.html">link</a></p></body></html>'
  ],
  'recipients' => [
    ['address' => ['email'=>$email]]
  ]
]);
$name=md5("sarra8161@gmail.com");
$pass=md5("asd");
echo "\nI will print out before the promise is fulfilled";
echo "<br>" .$name;
echo "<br>" .$pass;
?>
