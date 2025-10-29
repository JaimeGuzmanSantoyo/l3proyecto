<?php
// =============================
// 1) Verificación del Webhook
// =============================
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['hub_verify_token'])) {
    if ($_GET['hub_verify_token'] === "PEPEKUN2025") {
        echo $_GET['hub_challenge']; 
        exit;
    } else {
        http_response_code(403);
        exit;
    }
}

// =============================
// 2) Configuración API WhatsApp
// =============================
$token           = "EAAbRiZAl0u6wBPuY16EAupEZCh0xXSEOLZBUEQs5vjLZAZAVJApM3b1dZBHpd2algWKT3KjePDLtYZB04i5I9x845SZC3FImGJeKV8G4M2e5JC3mXHG3yv3zsZB6yoVqOm5nifMZBLNTIVLsXpioGoyf7bPqGcGYUEckunTHaNhoUtkeHa55yEFGzTksLKi2ipE90WNgopjpMeCeyum3iZCXpbeCPk1JvJAZBBbCN1codaeZCTbBgCAZDZD";      // El de Meta
$phone_number_id = "737679582769736";      // ID de tu número de prueba
$graph_version   = "v23.0";                  

// =============================
// 3) Conexión a la base de datos
// =============================
$host = "127.0.0.1:3307";
$user = "root";
$pass = "";
$db   = "chatbot_rh";

$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    die("Error en la conexión: " . $conn->connect_error);
}

// =============================
// 4) Si la consulta viene del FORM WEB (POST normal)
// =============================
if (isset($_POST['pregunta'])) {
    $pregunta = strtolower(trim($_POST['pregunta']));
    $respuesta = "Lo siento, no tengo información sobre eso.";

    $sql = "SELECT respuesta FROM faq WHERE LOWER(pregunta) LIKE '%$pregunta%'";
    $result = $conn->query($sql);
    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $respuesta = $row['respuesta'];
    }

    echo $respuesta; // <-- para tu index.html
    $conn->close();
    exit;
}

// =============================
// 5) Si la consulta viene de WhatsApp (POST JSON)
// =============================
$raw = file_get_contents("php://input");
$data = json_decode($raw, true);

if (isset($data['entry'][0]['changes'][0]['value']['messages'][0])) {
    $msg  = $data['entry'][0]['changes'][0]['value']['messages'][0];
    $from = $msg['from'];                        // número del usuario
    $text = strtolower(trim($msg['text']['body'])); // texto que envió

    // Buscar en la base de datos
    $respuesta = "Lo siento, no tengo información sobre eso.";
    $sql = "SELECT respuesta FROM faq WHERE LOWER(pregunta) LIKE '%$text%'";
    $result = $conn->query($sql);
    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $respuesta = $row['respuesta'];
    }

    // =============================
    // 6) Construir el PAYLOAD y responder por la API
    // =============================
    $url = "https://graph.facebook.com/{$graph_version}/{$phone_number_id}/messages";

    $payload = [
        "messaging_product" => "whatsapp",
        "to"   => $from,
        "type" => "text",
        "text" => ["body" => $respuesta]
    ];

    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        "Authorization: Bearer {$token}",
        "Content-Type: application/json"
    ]);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload, JSON_UNESCAPED_UNICODE));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

    $apiResponse = curl_exec($ch);
    curl_close($ch);
    error_log("API Response: " . $apiResponse);

    // Importante: responder 200 a Meta
    http_response_code(200);
    echo "EVENT_RECEIVED";
    $conn->close();
    exit;
}

// Si no es un mensaje válido
http_response_code(200);
echo "EVENT_RECEIVED";
$conn->close();
?>
