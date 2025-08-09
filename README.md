Baileys-Vortex - WhatsApp Bot Framework
Baileys-Vortex is a powerful and lightweight JavaScript framework built on top of Baileys, designed to create advanced WhatsApp bots. It provides a streamlined interface for interacting with WhatsApp's Web API, enabling developers to automate messaging, manage contacts, and handle newsletters (WhatsApp Channels) with ease. Baileys-Vortex extends Baileys with additional features like enhanced contact management, newsletter support, and custom bot functionalities.
⚠️ Important: Baileys-Vortex is an unofficial API and not affiliated with WhatsApp or Meta. Using unofficial APIs may violate WhatsApp's Terms of Service and could result in account bans. Use responsibly and at your own risk.
Table of Contents

Features
Installation
Usage
Examples
Contributing
License
Disclaimer

Features
Baileys-Vortex offers a rich set of features to supercharge your WhatsApp bot development:

Messaging: Send and receive text, media (images, videos, documents), and location messages.
Contact Management:
Retrieve and update contact details (e.g., name, profile picture, status).
Support for WhatsApp-exclusive contact storage (IPLS).
Block/unblock contacts.
Manage business profiles for business accounts.
Add contacts to groups.


Newsletter (Channel) Management:
Create and manage WhatsApp Newsletters.
Handle subscribers, reactions, and comments (if supported).
Update newsletter metadata (e.g., name, description, picture).
Track subscriber counts and verification status.


Group Management: Create, update, and manage WhatsApp groups, including participant management.
Presence & Status: Monitor contact presence (online, typing, last seen) and status updates.
Event-Driven Architecture: Listen for real-time events like messages, group updates, and presence changes.
Lightweight & Modular: Built with no external dependencies (except optional media handling libraries).
JavaScript-Friendly: Written in pure JavaScript for maximum compatibility.

Installation
Prerequisites

Node.js v16 or higher.
npm or yarn for package management.
A WhatsApp account with a registered phone number.

Clone the Repository
git clone https://github.com/flex-dev5/Baileys-Vortex.git
cd Baileys-Vortex

Install Dependencies
npm install

Or with Yarn:
yarn install

Optional Dependencies
For media handling (e.g., uploading/downloading images):
npm install sharp

Usage
Basic Setup
To initialize a Baileys-Vortex bot and connect to WhatsApp:
const { makeWASocket, useMultiFileAuthState } = require('./index');
const { DisconnectReason } = require('@whiskeysockets/baileys');

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info');
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

Authentication

Run the script to generate a QR code in the terminal.
Scan the QR code using the WhatsApp app (Settings > Linked Devices > Link a Device).
Credentials are saved in the auth_info folder for future sessions.

Examples
Sending a Message
async function sendMessage(sock, jid, text) {
    await sock.sendMessage(jid, { text });
}

const jid = '123456789@s.whatsapp.net';
sendMessage(sock, jid, 'Hello from Baileys-Vortex!');

Managing Contacts
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

Managing Newsletters
async function createNewsletter(sock, name, description) {
    const newsletter = await sock.createNewsletter({ name, description });
    console.log('Newsletter created:', newsletter);
}

async function addReaction(sock, newsletterId, messageId, reaction) {
    await sock.addNewsletterReaction(newsletterId, messageId, { code: reaction });
}

Contributing
We welcome contributions to Baileys-Vortex! To contribute:

Fork the Repository:git clone https://github.com/flex-dev5/Baileys-Vortex.git


Create a Branch:git checkout -b feature/your-feature


Make Changes: Add features, fix bugs, or improve documentation.
Run Tests (if available):npm test


Submit a Pull Request: Push your changes and create a PR with a clear description.

Contribution Guidelines

Ensure compatibility with WhatsApp's WebSocket protocol.
Follow the existing code style (JavaScript, no TypeScript required).
Add tests for new features if possible.
Document your changes clearly in the PR.
Test thoroughly to avoid issues with WhatsApp servers.

License
Baileys-Vortex is licensed under the MIT License. See the LICENSE file for details.
Disclaimer
Baileys-Vortex is an unofficial API and not endorsed by WhatsApp or Meta. Using it may violate WhatsApp's Terms of Service, potentially leading to temporary or permanent account bans. Use at your own discretion.
For official WhatsApp integration, refer to the WhatsApp Business API.

Built with 💻 by flex-dev5Happy Botting with Baileys-Vortex! 🚀
