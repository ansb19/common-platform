export interface SendEmailParams {
    to: string[];

    subject: string;

    html?: string;
    text?: string;

    template?: string;

    context?: Record<
        string,
        string | number | boolean | null | undefined
    >;

    from?: string;
    fromName?: string;

    cc?: string[];
    bcc?: string[];

    replyTo?: string[];

    attachments?: {
        filename: string;
        path: string;
    }[];
}