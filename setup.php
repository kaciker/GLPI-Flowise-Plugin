<?php

function plugin_init_flowisechat() {
    global $PLUGIN_HOOKS;
    // Inject your chatbot JS
    $PLUGIN_HOOKS['add_javascript']['flowisechat'] = 'js/flowisechat.js';
    // Declare that the plugin is CSRF compliant
    $PLUGIN_HOOKS['csrf_compliant']['flowisechat'] = true;
}

function plugin_version_flowisechat() {
    return [
        'name'           => 'Flowise Chat LLM',
        'version'        => '3.0.4',
        'author'         => 'kaciker',
        'license'        => 'GPLv3+',
        'homepage'       => 'https://github.com/kaciker/',
        'minGlpiVersion' => '10.0'
    ];
}

function plugin_flowisechat_check_prerequisites() {
    return true;
}

function plugin_flowisechat_check_config() {
    return true;
}

function plugin_flowisechat_install() {
    return true;
}

function plugin_flowisechat_uninstall() {
    return true;
}