<?php
use Razorpay\Api\Api;

$api = new Api($api_key, $api_secret);

// Orders
$order  = $api->order->create(array('receipt' => '123', 'amount' => 100, 'currency' => 'INR')); // Creates order
$order  = $api->order->fetch($orderId); // Returns a particular order
$orders = $api->order->all($options); // Returns array of order objects
$payments = $api->order->fetch($orderId)->payments(); // Returns array of payment objects against an order

// Payments
$payments = $api->payment->all($options); // Returns array of payment objects
$payment  = $api->payment->fetch($id); // Returns a particular payment
$payment  = $api->payment->fetch($id)->capture(array('amount'=>$amount)); // Captures a payment

// To get the payment details
echo $payment->amount;
echo $payment->currency;
// And so on for other attributes

// Refunds
$refund = $api->refund->create(array('payment_id' => $id)); // Creates refund for a payment
$refund = $api->refund->create(array('payment_id' => $id, 'amount'=>$refundAmount)); // Creates partial refund for a payment
$refund = $api->refund->fetch($refundId); // Returns a particular refund

// Cards
$card = $api->card->fetch($cardId); // Returns a particular card

// Customers
$customer = $api->customer->create(array('name' => 'Razorpay User', 'email' => 'customer@razorpay.com')); // Creates customer
$customer = $api->customer->fetch($customerId); // Returns a particular customer
$customer = $api->customer->edit(array('name' => 'Razorpay User', 'email' => 'customer@razorpay.com')); // Edits customer

// Tokens
$token  = $api->customer->token()->fetch($tokenId); // Returns a particular token
$tokens = $api->customer->token()->all($options); // Returns array of token objects
$api->customer->token()->delete($tokenId); // Deletes a token


// Transfers
$transfer  = $api->payment->fetch($paymentId)->transfer(array('transfers' => [ ['account' => $accountId, 'amount' => 100, 'currency' => 'INR']])); // Create transfer
$transfers = $api->transfer->all(); // Fetch all transfers
$transfers = $api->payment->fetch($paymentId)->transfers(); // Fetch all transfers created on a payment
$transfer  = $api->transfer->fetch($transferId)->edit($options); // Edit a transfer
$reversal  = $api->transfer->fetch($transferId)->reverse(); // Reverse a transfer

// Payment Links
$links = $api->invoice->all();
$link  = $api->invoice->fetch('inv_00000000000001');
$link  = $api->invoice->create(arary('type' => 'link', 'amount' => 500, 'description' => 'For XYZ purpose', 'customer' => array('email' => 'test@test.test')));
$link->cancel();
$link->notifyBy('sms');

// Invoices
$invoices = $api->invoice->all();
$invoice  = $api->invoice->fetch('inv_00000000000001');
$invoice  = $api->invoice->create($params); // Ref: razorpay.com/docs/invoices for request params example
$invoice  = $invoice->edit($params);
$invoice->issue();
$invoice->notifyBy('email');
$invoice->cancel();
$invoice->delete();

// Virtual Accounts
$virtualAccount  = $api->virtualAccount->create(array('receiver_types' => array('bank_account'), 'description' => 'First Virtual Account', 'notes' => array('receiver_key' => 'receiver_value')));
$virtualAccounts = $api->virtualAccount->all();
$virtualAccount  = $api->virtualAccount->fetch('va_4xbQrmEoA5WJ0G');
$virtualAccount  = $virtualAccount->close();
$payments        = $virtualAccount->payments();
$bankTransfer    = $api->payment->fetch('pay_8JpVEWsoNPKdQh')->bankTransfer();

// Bharat QR
$bharatQR = $api->virtualAccount->create(array('receivers' => array('types' => array('qr_code')), 'description' => 'First QR code', 'amount_expected' => 100, 'notes' => array('receiver_key' => 'receiver_value'))); // Create Static QR
$bharatQR = $api->virtualAccount->create(array('receivers' => array('types' => array('qr_code')), 'description' => 'First QR code', 'notes' => array('receiver_key' => 'receiver_value'))); // Create Dynamic QR

// Subscriptions
$plan          = $api->plan->create(array('period' => 'weekly', 'interval' => 1, 'item' => array('name' => 'Test Weekly 1 plan', 'description' => 'Description for the weekly 1 plan', 'amount' => 600, 'currency' => 'INR')));
$plan          = $api->plan->fetch('plan_7wAosPWtrkhqZw');
$plans         = $api->plan->all();
$subscription  = $api->subscription->create(array('plan_id' => 'plan_7wAosPWtrkhqZw', 'customer_notify' => 1, 'total_count' => 6, 'start_at' => 1495995837, 'addons' => array(array('item' => array('name' => 'Delivery charges', 'amount' => 30000, 'currency' => 'INR')))));
$subscription  = $api->subscription->fetch('sub_82uBGfpFK47AlA');
$subscriptions = $api->subscription->all();
$subscription  = $api->subscription->fetch('sub_82uBGfpFK47AlA')->cancel($options); //$options = ['cancel_at_cycle_end' => 1];
$addon         = $api->subscription->fetch('sub_82uBGfpFK47AlA')->createAddon(array('item' => array('name' => 'Extra Chair', 'amount' => 30000, 'currency' => 'INR'), 'quantity' => 2));
$addon         = $api->addon->fetch('ao_8nDvQYYGQI5o4H');
$addon         = $api->addon->fetch('ao_8nDvQYYGQI5o4H')->delete();

// Settlements
$settlement    = $api->settlement->fetch('setl_7IZKKI4Pnt2kEe');
$settlements   = $api->settlement->all();
$reports       = $api->settlement->reports(array('year' => 2018, 'month' => 2));

// Include Requests only if not already defined
if (class_exists('Requests') === false)
{
    require_once __DIR__.'/libs/Requests-1.7.0/library/Requests.php';
}

try
{
    Requests::register_autoloader();

    if (version_compare(Requests::VERSION, '1.6.0') === -1)
    {
        throw new Exception('Requests class found but did not match');
    }
}
catch (\Exception $e)
{
    throw new Exception('Requests class found but did not match');
}

spl_autoload_register(function ($class)
{
    // project-specific namespace prefix
    $prefix = 'Razorpay\Api';

    // base directory for the namespace prefix
    $base_dir = __DIR__ . '/src/';

    // does the class use the namespace prefix?
    $len = strlen($prefix);

    if (strncmp($prefix, $class, $len) !== 0)
    {
        // no, move to the next registered autoloader
        return;
    }

    // get the relative class name
    $relative_class = substr($class, $len);

    //
    // replace the namespace prefix with the base directory,
    // replace namespace separators with directory separators
    // in the relative class name, append with .php
    //
    $file = $base_dir . str_replace('\\', '/', $relative_class) . '.php';

    // if the file exists, require it
    if (file_exists($file))
    {
        require $file;
    }
});
