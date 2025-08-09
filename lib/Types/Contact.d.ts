
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

// نوع جديد: حالة الحظر
export type ContactBlockStatus = 'BLOCKED' | 'UNBLOCKED';

// نوع جديد: حالة النشاط
export type ContactActivityStatus = 'ONLINE' | 'OFFLINE' | 'TYPING' | 'LAST_SEEN';

// نوع جديد: تصنيفات جهة الاتصال (مدعوم في WhatsApp Business)
export type ContactLabel = {
    id: string; // معرف التصنيف
    name: string; // اسم التصنيف (مثل "عملاء" أو "أصدقاء")
};

// تعريف جهة الاتصال
export type Contact = {
    /** ID either in lid or jid format */
    id: string;
    /** ID in Lid (anonymous) format (@lid) */
    lid?: string;
    /** ID in Phone Number format (@s.whatsapp.net) */
    jid?: string;
    /** Name of the contact, you have saved on your WA */
    name?: string;
    /** Name of the contact, the contact has set on their own on WA */
    notify?: string;
    /** Verified name for business accounts */
    verifiedName?: string;
    /** 
     * Url of the profile picture of the contact
     * 'changed' => if the profile picture has changed
     * null => if the profile picture has not been set (default profile picture)
     * any other string => url of the profile picture
     */
    imgUrl?: string | 'changed' | null;
    /** Contact status (e.g., WhatsApp status message) */
    status?: string;
    /** Activity status (e.g., online, typing, last seen) */
    activityStatus?: ContactActivityStatus;
    /** Last seen timestamp (in seconds) */
    lastSeen?: number;
    /** Block status of the contact */
    blockStatus?: ContactBlockStatus;
    /** Business profile information (if applicable) */
    businessProfile?: {
        businessName: string;
        category: string;
        description?: string;
        email?: string;
        website?: string;
    };
    /** Labels assigned to the contact (supported in WhatsApp Business) */
    labels?: ContactLabel[];
};

// تعريف إجراءات جهة الاتصال
export type ContactAction = {
    /** First name of the contact */
    firstName: string;
    /** Full name of the contact */
    fullName: string;
    /** Save contact to primary address book or WhatsApp exclusively */
    saveOnPrimaryAddressbook: boolean;
    /** Save contact exclusively to WhatsApp */
    saveToWhatsApp?: boolean; // مدعوم في تحديثات واتساب الأخيرة
    /** Block or unblock the contact */
    blockAction?: 'BLOCK' | 'UNBLOCK';
    /** Add contact to a group */
    addToGroup?: string; // معرف المجموعة (group JID)
    /** Update labels (supported in WhatsApp Business) */
    updateLabels?: {
        add?: string[]; // أسماء التصنيفات للإضافة
        remove?: string[]; // أسماء التصنيفات للحذف
    };
};

exports.Contact = Contact;
exports.ContactAction = ContactAction;
