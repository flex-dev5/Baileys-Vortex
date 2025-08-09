import { Boom } from '@hapi/boom'
import { SocketConfig } from '../Types'
import { BinaryNode } from '../WABinary'
import { WebSocketClient } from './Client'
import { proto } from '../../WAProto'
import { S_WHATSAPP_NET } from '../Defaults'

/**
 * Connects to WA servers and performs:
 * - simple queries (no retry mechanism, wait for connection establishment)
 * - listen to messages and emit events
 * - query phone connection
 */
export declare const makeSocket: (config: SocketConfig) => {
    type: "md"
    ws: WebSocketClient
    ev: import("../Types").BaileysEventEmitter & {
        process(handler: (events: Partial<import("../Types").BaileysEventMap>) => void | Promise<void>): () => void
        buffer(): void
        createBufferedFunction<A extends any[], T>(work: (...args: A) => Promise<T>): (...args: A) => Promise<T>
        flush(force?: boolean | undefined): boolean
        isBuffering(): boolean
    }
    authState: {
        creds: import("../Types").AuthenticationCreds
        keys: import("../Types").SignalKeyStoreWithTransaction
    }
    signalRepository: import("../Types").SignalRepository
    readonly user: import("../Types").Contact | undefined
    generateMessageTag: () => string
    query: (node: BinaryNode, timeoutMs?: number) => Promise<BinaryNode>
    waitForMessage: <T_1>(msgId: string, timeoutMs?: number | undefined) => Promise<T_1>
    waitForSocketOpen: () => Promise<void>
    sendRawMessage: (data: Uint8Array | Buffer) => Promise<void>
    sendNode: (frame: BinaryNode) => Promise<void>
    logout: (msg?: string) => Promise<void>
    end: (error: Error | undefined) => void
    onUnexpectedError: (err: Error | Boom, msg: string) => void
    uploadPreKeys: (count?: number) => Promise<void>
    uploadPreKeysToServerIfRequired: () => Promise<void>
    requestPairingCode: (phoneNumber: string, code?: string) => Promise<string>
    /** Waits for the connection to WA to reach a state */
    waitForConnectionUpdate: (check: (u: Partial<import("../Types").ConnectionState>) => boolean | undefined, timeoutMs?: number | undefined) => Promise<void>
    sendWAMBuffer: (wamBuffer: Buffer) => Promise<BinaryNode>
    /**
     * Report a user or message to WhatsApp
     * @param userJid The JID of the user to report (e.g. '1234567890@s.whatsapp.net')
     * @param reasonCode The reason code for reporting (0-4)
     * @param reportCount Number of times to report (default: 1)
     */
    sendReport: (userJid: string, reasonCode: number, reportCount?: number) => Promise<{
        success: boolean
        reportedUser: string
        reportCount: number
        timestamp: number
    }>
}

export type Socket = ReturnType<typeof makeSocket>
