<?php
// Your fixed key and IV
$hexKey = '0123456789abcdeffedcba98765432100123456789abcdeffedcba9876543210';
$hexIV = 'aabbccddeeff11223344556677889900';

// Convert hex to binary for use in openssl
$secret = hex2bin($hexKey);
$iv = hex2bin($hexIV);

// Check for input
if (isset($_REQUEST['submit']) && isset($_REQUEST['data']) && $_REQUEST['data'] != '') {
    $encryptionMethod = 'AES-256-CBC';
    $data = trim($_REQUEST['data']);
    
    // if ($_REQUEST['type'] == 'encrypt') {
    //     $encrypted = openssl_encrypt($data, $encryptionMethod, $secret, 0, $iv);
    //     echo "<div class='container'>
    //             <h2>Encryption Result</h2>
    //             <p><b>Encrypted Text:</b> $encrypted</p>
    //             <p><b>IV (Hex):</b> $hexIV</p>
    //           </div>";
    // } else { // decrypt
    //     $decrypted = openssl_decrypt($data, $encryptionMethod, $secret, 0, $iv);
    //     echo "<div class='container'>
    //             <h2>Decryption Result</h2>
    //             <p><b>Decrypted Text:</b> $decrypted</p>
    //           </div>";
    // }
    if ($_REQUEST['type'] == 'encrypt') {
        $rawEncrypted = openssl_encrypt($data, $encryptionMethod, $secret, OPENSSL_RAW_DATA, $iv);
        $encrypted = base64_encode($rawEncrypted);
        echo "<div class='container'>
                <h2>Encryption Result</h2>
                <p><b>Encrypted Text:</b> $encrypted</p>
                <p><b>IV (Hex):</b> $hexIV</p>
              </div>";
    } else { // decrypt
        $rawData = base64_decode($data);
        $decrypted = openssl_decrypt($rawData, $encryptionMethod, $secret, OPENSSL_RAW_DATA, $iv);
        echo "<div class='container'>
                <h2>Decryption Result</h2>
                <p><b>Decrypted Text:</b> $decrypted</p>
              </div>";
    }
    
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Encrypt/Decrypt - Fixed Key/IV</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 40px;
        }
        .container {
            padding: 20px;
            border: 1px solid #999;
            border-radius: 10px;
            background-color: #f5f5f5;
            max-width: 600px;
        }
        textarea {
            width: 100%;
            height: 120px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Encrypt / Decrypt with Fixed Key & IV</h1>
        <form action="crypto-enc-dec.php" method="post">
            <label>Text to Encrypt/Decrypt:</label><br>
            <textarea name="data" required></textarea><br><br>

            <label>Choose an action:</label><br>
            <input type="radio" name="type" value="encrypt" checked> Encrypt<br>
            <input type="radio" name="type" value="decrypt"> Decrypt<br><br>

            <input type="submit" name="submit" value="Submit">
        </form>
    </div>
</body>
</html>
