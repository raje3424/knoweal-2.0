<?php
use SparkPostSparkPost;
use GuzzleHttpClient;
use HttpAdapterGuzzle6Client as GuzzleAdapter;

$httpClient = new GuzzleAdapter(new Client());
$sparky = new SparkPost($httpClient, ['key' => 'c78d2fed5e21260e3007da448c7a5d0f14b03688']);

$sparky->setOptions(['async' => false]);
$results = $sparky->transmissions->post([
  'options' => [
    'sandbox' => true
  ],
  'content' => [
    'from' => 'testing@sparkpostbox.com',
    'subject' => 'Oh hey',
    'html' => '<html><body><p>Testing SparkPost - the most awesomest email service!</p></body></html>'
  ],
  'recipients' => [
    ['address' => ['email'=>'sarra8161@gmail.com']]
  ]
]);
?>
