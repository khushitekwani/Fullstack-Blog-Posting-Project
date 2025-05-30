<?php
// Encryption and Decryption using AES-256-CBC in PHP

// Define your encryption key and initialization vector (IV)
$key = 'xza548sa3vcr641b5ng5nhy9mlo64r6k'; // Must be 32 bytes for AES-256
$iv = '5ng5nhy9mlo64r6k'; // Must be 16 bytes for AES-256-CBC

// Example plaintext data
$plaintext = `{
    "title": "Fullstack task",
    "content": "This is first task of full stack",
    "status": "completed"
}`;

// Encryption function
function encrypt($data, $key, $iv) {
    // Encrypt the data using AES-256-CBC
    $encrypted = openssl_encrypt($data, 'aes-256-cbc', $key, 0, $iv);
    return $encrypted;
}

// Decryption function
function decrypt($data, $key, $iv) {
    // Decrypt the data using AES-256-CBC
    $decrypted = openssl_decrypt($data, 'aes-256-cbc', $key, 0, $iv);
    return $decrypted;
}

// Encrypt the plaintext
$encryptedData = encrypt($plaintext, $key, $iv);
echo "Encrypted Text: " . $encryptedData . "\n";

// Decrypt the encrypted text
$decryptedData = decrypt($encryptedData, $key, $iv);
echo "Decrypted Text: " . $decryptedData . "\n";

?>
