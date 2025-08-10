# Baileys-Vortex - WhatsApp Bot Framework

![Baileys-Vortex Logo](https://files.catbox.moe/w4z3h6.png) <!-- Replace with actual logo if available -->

**Baileys-Vortex** is a powerful, lightweight, and flexible JavaScript framework built on top of [Baileys](https://github.com/WhiskeySockets/Baileys), designed to simplify the creation of advanced WhatsApp bots. It offers a streamlined interface for interacting with WhatsApp's Web API, enabling developers to automate messaging, manage contacts, and handle WhatsApp Newsletters (Channels) with ease.

⚠️ **Important**: Baileys-Vortex is an **unofficial API** and is not affiliated with WhatsApp or Meta. Using unofficial APIs may violate WhatsApp's Terms of Service, which could result in temporary or permanent account bans. Use responsibly and at your own risk.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Examples](#examples)
- [Contributing](#contributing)
- [License](#license)
- [Disclaimer](#disclaimer)

## Features

Baileys-Vortex empowers developers with a robust set of tools to build feature-rich WhatsApp bots:

- **Messaging**:
  - Send and receive text, media (images, videos, documents), and location messages.
- **Contact Management**:
  - Retrieve and update contact details (e.g., name, profile picture, status).
  - Support for WhatsApp-exclusive contact storage (IPLS).
  - Block/unblock contacts.
  - Manage business profiles for business accounts.
  - Add contacts to groups.
- **Newsletter (Channel) Management**:
  - Create and manage WhatsApp Newsletters.
  - Handle subscribers, reactions, and comments (if supported).
  - Update newsletter metadata (e.g., name, description, picture).
  - Track subscriber counts and verification status.
- **Group Management**:
  - Create, update, and manage WhatsApp groups, including participant management.
- **Presence & Status**:
  - Monitor contact presence (online, typing, last seen) and status updates.
- **Event-Driven Architecture**:
  - Listen for real-time events like messages, group updates, and presence changes.
- **Lightweight & Modular**:
  - Built with minimal dependencies (except optional media handling libraries).
- **JavaScript-Friendly**:
  - Written in pure JavaScript for maximum compatibility.

## Installation

### Prerequisites

- **Node.js**: Version 16 or higher.
- **npm** or **yarn**: For package management.
- **WhatsApp Account**: A registered phone number linked to WhatsApp.

### Steps

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/flex-dev5/Baileys-Vortex.git
   cd Baileys-Vortex
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```
   Or with Yarn:
   ```bash
   yarn install
   ```

3. **Optional Dependencies** (for media handling, e.g., images/videos):
   ```bash
   npm install sharp
   ```

## Usage

### Basic Setup

To initialize a Baileys-Vortex bot and connect to WhatsApp, use the following code:

```javascript
const { makeWASocket, useMultiFileAuthState } = require('./index');
const { DisconnectReason } = require('@whiskeysockets/baileys');

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('./auth_info');
    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: true
    });

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'close') {
            if (lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut) {
                startBot();
            } else {
                console.log('Logged out. Please re-authenticate.');
            }
        } else if (connection === 'open') {
            console.log('Bot connected to WhatsApp!');
        }
    });

    sock.ev.on('creds.update', saveCreds);
}

startBot();
```

### Authentication

1. Run the script to generate a QR code in the terminal.
2. Scan the QR code using the WhatsApp app (Settings > Linked Devices > Link a Device).
3. Credentials are automatically saved in the `./auth_info/` folder for future sessions.

> **Note**: The `auth_info` folder contains session files (`creds.json`, `baileys_store.json`, etc.) critical for maintaining the session. Do not delete this folder unless you want to re-authenticate.

## Examples

### Sending a Message

```javascript
async function sendMessage(sock, jid, text) {
    await sock.sendMessage(jid, { text });
}

const jid = '123456789@s.whatsapp.net';
sendMessage(sock, jid, 'Hello from Baileys-Vortex!');
```

### Managing Contacts

```javascript
async function getContact(sock, jid) {
    const contact = await sock.getContact(jid);
    console.log('Contact:', contact);
}

async function updateContact(sock, jid, action) {
    await sock.updateContact(jid, {
        firstName: 'Ahmed',
        fullName: 'Ahmed Mohamed',
        saveToWhatsApp: true,
        blockAction: 'BLOCK',
        addToGroup: 'group123@g.us'
    });
}
```

### Managing Newsletters

```javascript
async function createNewsletter(sock, name, description) {
    const newsletter = await sock.createNewsletter({ name, description });
    console.log('Newsletter created:', newsletter);
}

async function addReaction(sock, newsletterId, messageId, reaction) {
    await sock.addNewsletterReaction(newsletterId, messageId, { code: reaction });
}
```

## Contributing

We welcome contributions to make Baileys-Vortex even better! To contribute:

1. **Fork the Repository**:
   ```bash
   git clone https://github.com/flex-dev5/Baileys-Vortex.git
   ```

2. **Create a Branch**:
   ```bash
   git checkout -b feature/your-feature
   ```

3. **Make Changes**: Add features, fix bugs, or improve documentation.

4. **Run Tests** (if available):
   ```bash
   npm test
   ```

5. **Submit a Pull Request**: Push your changes and create a PR with a clear description.

### Contribution Guidelines

- Ensure compatibility with WhatsApp's WebSocket protocol.
- Follow the existing JavaScript code style (no TypeScript required).
- Add tests for new features if possible.
- Document your changes clearly in the pull request.
- Test thoroughly to avoid issues with WhatsApp servers.

## License

Distributed under the [MIT License](LICENSE). See the `LICENSE` file for details.

## Disclaimer

Baileys-Vortex is an **unofficial API** and is not endorsed by WhatsApp or Meta. Using it may violate WhatsApp's Terms of Service, which could lead to temporary or permanent account bans. Use at your own discretion. For official WhatsApp integration, refer to the [WhatsApp Business API](https://developers.facebook.com/docs/whatsapp).

---

Built with 💻 by [flex-dev5](https://github.com/flex-dev5).  
Happy Botting with Baileys-Vortex! 🚀
