export interface SmsSendResult {
    successCount: number;
    failedCount: number;
    providerMessageId?: string;
    raw?: unknown;
}