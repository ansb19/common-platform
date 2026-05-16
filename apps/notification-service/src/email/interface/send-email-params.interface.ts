export interface SendEmailParams {
    to: string[];
    subject: string;

    html?: string;
    template?: string;

    context?: Record<string, string | number | boolean | null | undefined>;

    fromName?: string;

    bcc?: string[];

    attachments?: {
        filename: string;
        path: string;
    }[];
}