<?php
/** FlowiseChat – Endpoint de sesión (plugins/flowisechat/ajax/session.php) */
include_once '../../../inc/includes.php';
Session::checkLoginUser();

header('Content-Type: application/json; charset=utf-8');

$user = new User();
if ($user->getFromDB($_SESSION['glpiID'])) {
    echo json_encode([
        'userid'        => $_SESSION['glpiID'],
        'username'  => $user->fields['name'],        // login
        'firstname' => $user->fields['firstname'],   // nombre
        'lastname'  => $user->fields['realname'],    // apellido
        'csrf'      => $_SESSION['glpicsrf_token'] ?? null,
        'sid'       => session_id()
    ]);
} else {
    http_response_code(403);
    echo json_encode(['error' => 'Usuario no encontrado']);
}

