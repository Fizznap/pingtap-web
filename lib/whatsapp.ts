import axios from 'axios';

const WHATSAPP_API_URL = `https://graph.facebook.com/v17.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`;
const WHATSAPP_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;

interface WhatsAppMessage {
    to: string; // The user's phone number
    templateName?: string;
    languageCode?: string;
    text?: string;
}

/**
 * Sends a WhatsApp message using the WhatsApp Business API.
 * Supports both Template messages (for initiating conversations) and Text messages (for replies).
 */
export async function sendWhatsAppMessage({ to, templateName, languageCode = 'en_US', text }: WhatsAppMessage) {
    if (!WHATSAPP_TOKEN) {
        console.warn('WhatsApp Token not configured. Message skipped.');
        return null;
    }

    try {
        const payload: any = {
            messaging_product: 'whatsapp',
            to: to,
        };

        if (templateName) {
            payload.type = 'template';
            payload.template = {
                name: templateName,
                language: {
                    code: languageCode
                }
            };
        } else if (text) {
            payload.type = 'text';
            payload.text = {
                body: text
            };
        } else {
            throw new Error('Either templateName or text must be provided.');
        }

        const response = await axios.post(WHATSAPP_API_URL, payload, {
            headers: {
                'Authorization': `Bearer ${WHATSAPP_TOKEN}`,
                'Content-Type': 'application/json'
            }
        });

        return response.data;
    } catch (error: any) {
        console.error('Error sending WhatsApp message:', error.response?.data || error.message);
        // We don't throw here to prevent breaking the UI flow if WhatsApp fails
        return null;
    }
}
