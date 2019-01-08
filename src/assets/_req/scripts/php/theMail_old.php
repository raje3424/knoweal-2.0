<?php
// require 'PHPMailer-master/PHPMailerAutoload.php';
//
// $mail = new PHPMailer;

//$mail->SMTPDebug = 3;                               // Enable verbose debug output

$mail->isSMTP();                                      // Set mailer to use SMTP
$mail->Host = 'smtp.mandrillapp.com;smtp2.example.com';  // Specify main and backup SMTP servers
$mail->SMTPAuth = true;                               // Enable SMTP authentication
$mail->Username = 'rdmuniversal@live.com';                 // SMTP username
$mail->Password = 'kAxY8DLEVLM5DFEz_fuEPw';                // SMTP password
$mail->SMTPSecure = 'openssl';                            // Enable TLS encryption, `ssl` also accepted
$mail->Port = 587;                                    // TCP port to connect to

$mail->From = 'activate@knoweal.com';
$mail->FromName = 'Knoweal Team';
$mail->addAddress($email);  // Add a recipient
//$mail->addReplyTo('info@example.com', 'Information');
//$mail->addCC('rohitmahindrakar@icloud.com');
//$mail->addBCC('bcc@example.com');

//$mail->addAttachment('/var/tmp/file.tar.gz');         // Add attachments
//$mail->addAttachment('/tmp/image.jpg', 'new.jpg');    // Optional name
$mail->isHTML(true);                                  // Set email format to HTML

$mail->Subject = 'Verify your Knoweal Account';
$mail->Body    = $emailBody;
$mail->AltBody = 'There seems some problem in your email client please try again...';

if(!$mail->send()) {
    echo 'Message could not be sent.';
    echo 'Mailer Error: ' . $mail->ErrorInfo;
} else {
    echo 'Message has been sent';
}
