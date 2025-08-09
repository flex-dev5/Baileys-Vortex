// src/Utils/reporting.ts
import { proto } from '../../WAProto';
import { AnyWASocket } from '../Types';

export enum ReportReason {
    SPAM = 'SPAM',
    ABUSE = 'ABUSE', 
    SCAM = 'SCAM',
    IMPERSONATION = 'IMPERSONATION',
    INAPPROPRIATE = 'INAPPROPRIATE'
}

export interface ReportResult {
    success: boolean;
    reportCount: number;
    reportedUser: string;
    timestamp: number;
}

export interface ReportOptions {
    count?: number;
    context?: string;
    includeHistory?: boolean;
}

export async function sendReport(
    this: AnyWASocket,
    userJid: string,
    reason: ReportReason,
    options: ReportOptions = {}
): Promise<ReportResult> {
    // ... باقي الكود كما هو ...
}

// Extension يجب أن يكون في ملف منفصل مثل src/Types/socket.extensions.d.ts
declare module '../Types' {
    interface AnyWASocket {
        sendReport: (
            userJid: string, 
            reason: ReportReason, 
            options?: ReportOptions
        ) => Promise<ReportResult>;
    }
}
