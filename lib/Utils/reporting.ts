import { proto } from '../../WAProto';
import { AnyWASocket } from '../Types';

export type ReportReason = 
    'SPAM' | 
    'ABUSE' | 
    'SCAM' | 
    'IMPERSONATION' | 
    'INAPPROPRIATE';

export type ReportResult = {
    success: boolean;
    reportCount: number;
    reportedUser: string;
    timestamp: number;
};

export type ReportOptions = {
    count?: number;
    context?: string;
    includeHistory?: boolean;
};

/**
 * Report a user or message to WhatsApp
 * @param userJid The JID of the user to report (e.g., '201234567890@s.whatsapp.net')
 * @param reason Reason for reporting
 * @param options Additional options
 */
export async function sendReport(
    this: AnyWASocket,
    userJid: string,
    reason: ReportReason,
    options: ReportOptions = {}
): Promise<ReportResult> {
    const { count = 1, context = '', includeHistory = false } = options;

    try {
        // Validate JID
        if (!userJid.endsWith('@s.whatsapp.net')) {
            throw new Error('Invalid JID format');
        }

        // Get recent messages
        const messages = await this.fetchMessages(userJid, {
            limit: includeHistory ? 20 : 1,
        });

        if (!messages?.length) {
            throw new Error('No messages found from this user');
        }

        // Prepare report
        const reportPayload: proto.Reporting.IConfig = {
            reportingToken: messages[0].key.id,
            messageKey: messages[0].key,
            reportDetails: {
                reason,
                context,
                reportCount: count,
                userJid,
            },
            reportable: {
                minVersion: 1,
                maxVersion: 2,
            },
        };

        // Send reports
        for (let i = 0; i < count; i++) {
            const reportProto = proto.Reporting.Config.fromObject(reportPayload);
            const binaryData = proto.Reporting.Config.encode(reportProto).finish();

            await this.sendMessage(
                'support@whatsapp.com', 
                { reportingMessage: binaryData },
                { protocolMessage: { reportingInfo: { status: 1 } } }
            );
        }

        return {
            success: true,
            reportCount: count,
            reportedUser: userJid,
            timestamp: Date.now(),
        };
    } catch (error) {
        console.error('Reporting failed:', error);
        return {
            success: false,
            reportCount: 0,
            reportedUser: userJid,
            timestamp: Date.now(),
        };
    }
}

// Extend the socket
declare module '../Types' {
    interface AnyWASocket {
        sendReport: typeof sendReport;
    }
}
