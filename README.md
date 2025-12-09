# GLPI iA-sistant Plugin

The GLPI iA-sistant Plugin provides a floating chatbot assistant for GLPI, integrating with Flowise or Ollama to enhance user support and streamline IT service management.

## ✨ Key Features

* **Pre-ticket Resolution:** Helps users find answers to common questions before needing to open a ticket, reducing helpdesk workload.
* **Integrated Documentation (RAG):** Leverages Retrieval Augmented Generation (RAG) to consult integrated documentation, providing accurate and relevant responses.
* **Conversation Memory:** Maintains a conversation history with session memory, offering a more personalized and continuous user experience.
* **Customizable Aesthetics:** Features a corporate-branded floating button (e.g., Company logo on a red button) for a consistent user interface.
* **Automated Ticket Creation:** Future extension to automatically create tickets in GLPI during a conversation's second phase, streamlining the support workflow.

## 🚀 Plugin Structure

The plugin is designed to be installed within the GLPI plugin directory:

/var/www/html/glpi/plugins/flowisechat/

Here's a visual representation of the plugin's directory structure:

plugins
└── flowisechat
├── ajax
│   └── session.php
├── js
│   ├── flowisechat.js
│   └── img
│       └── logo-company-white.png
├── manifest.xml
├── README.md
└── setup.php

## 📂 File Descriptions

* **`manifest.xml`**: Contains the plugin's metadata, including its name, author, version, and minimum GLPI version compatibility.
* **`setup.php`**: Handles the plugin's initialization hooks and JavaScript file loading. It also declares CSRF compliance for security.
* **`ajax/session.php`**: This endpoint securely retrieves GLPI user session information, such as `userid`, `username`, `firstname`, and `lastname`. This data is then passed to Flowise to maintain conversation memory and provide context for the AI assistant.
* **`js/flowisechat.js`**: The core logic for the chatbot assistant. This file manages:
    * The floating button with your corporate logo.
    * The internal chat window interface.
    * Message sending functionality (via `ENTER` key or send button).
    * Connection with Flowise via its REST API.
    * Persistence of conversation memory per user using a `sessionId`.
* **`js/img/logo-logo-white.png`**: The image file for the white logo displayed on the assistant's button.

## ⚙️ Flowise Environment Configuration

To ensure proper communication between the GLPI plugin and your Flowise instance, follow these configuration steps:

1.  **Expose Flowise with CORS Enabled:**
    Ensure your Flowise instance is accessible and configured to allow cross-origin requests from your GLPI instance. Set the `CORS_ORIGINS` environment variable to your GLPI's IP address and the `PORT` to `3000` (or your chosen port):

    ```bash
    PORT=3000
    CORS_ORIGINS=http://<YOUR_GLPI_IP_ADDRESS>
    ```

2.  **Identify Your Chatflow ID:**
    Obtain the correct `chatflowId` from your specific chatflow within Flowise. This ID is crucial for the plugin to interact with the right AI conversational flow.

3.  **Configure Flowise Connection in `flowisechat.js`:**
    Edit the `js/flowisechat.js` file to include your Flowise instance's `baseUrl`, `flowId`, and `Authorization` token.

    ```javascript
    const baseUrl = 'http://<YOUR_FLOWISE_IP_ADDRESS>:3000'; // Replace with your Flowise IP and port
    const flowId = '<YOUR_CHATFLOW_ID>'; // Replace with your Flowise chatflow ID
    // ...
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer <YOUR_FLOWISE_API_KEY>' // Replace with your Flowise API Key
    },
    ```
    **Important:** The `Authorization` token is your Flowise API Key. You will need to generate this within your Flowise instance for secure communication. The `baseUrl` should point to your Flowise server's IP address and port.

## 🛠️ Installation Steps

1.  **Clone or Copy the Plugin:**
    Place the `flowisechat` plugin directory into your GLPI plugins folder:

    ```bash
    /var/www/html/glpi/plugins/flowisechat
    ```

2.  **Set File Permissions:**
    Ensure the web server user (`www-data` is common for Apache/Nginx on Linux) has appropriate permissions to the plugin directory:

    ```bash
    chown -R www-data:www-data /var/www/html/glpi/plugins/flowisechat
    ```

3.  **Clear GLPI Cache:**
    Remove any cached files to ensure GLPI loads the new plugin correctly:

    ```bash
    rm -rf /var/www/html/glpi/files/_cache/*
    ```

4.  **Restart GLPI (if containerized):**
    If your GLPI instance is running in a Docker container, restart it to apply changes:

    ```bash
    docker restart glpi
    ```
    If not containerized, ensure your web server (Apache, Nginx) is reloaded or restarted.

5.  **Activate Plugin in GLPI:**
    Navigate to GLPI's interface: `Setup > Plugins` and activate the "Flowise Chat LLM" plugin.

## 🖥️ Usage

Once installed and activated, a red "iA-sistant" button, branded with the Hutchinson logo, will appear in the bottom-right corner of your GLPI interface.

* Click the button to expand the chat window.
* Type your queries into the input field.
* Send your message by pressing `ENTER` or clicking the "Send" button.
* The assistant will provide responses generated by your configured Large Language Model (LLM) via Flowise or Ollama.

## 🪐 Future Extensions

We are continuously working on enhancing the plugin's capabilities. Planned future extensions include:

* **Automated Ticket Creation:** Intelligently create GLPI tickets automatically based on conversation content.
* **Conversation Logs:** Store chat conversations within GLPI for review and analysis.
* **Urgency Classification:** Automatically classify ticket urgency based on user inquiries.
* **Admin Panel for Metrics:** A dedicated administration panel for session management and usage metrics.

## 🤝 Contribution

We welcome Pull Requests and suggestions to improve the plugin and extend its functionalities, including advanced RAG implementations, intent classification, and deeper integration with the GLPI API for intelligent ticket generation.

## 🛡️ License

This plugin is released under the **GPLv3+ license**, promoting its use and improvement for internal corporate IT processes.
