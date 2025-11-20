/**
 * Email Service for Business Rules
 *
 * Provides email sending functionality for automated business rules actions.
 * Uses mock email storage in development.
 */

import { supabaseAdmin } from '@/lib/supabase/server';
import { getCurrentTime } from '@/lib/helpers/time-helpers';

interface EmailService {
  sendTemplate: (
    templateId: string,
    to: string,
    variables: Record<string, any>
  ) => Promise<void>;
}

class MockEmailService implements EmailService {
  async sendTemplate(
    templateId: string,
    to: string,
    variables: Record<string, any>
  ): Promise<void> {
    console.log('[EmailService] Sending email:', {
      templateId,
      to,
      variables,
    });

    const now = getCurrentTime();

    // In development, save to mock_emails table
    if (process.env.NODE_ENV !== 'production') {
      try {
        await supabaseAdmin.from('mock_emails').insert({
          recipient: to,
          subject: `Business Rule: ${templateId}`,
          body: JSON.stringify(variables, null, 2),
          status: 'sent',
          sent_at: now,
          metadata: {
            templateId,
            variables,
            source: 'business_rules',
          },
        });
        console.log('[EmailService] Mock email saved to database');
      } catch (error) {
        console.error('[EmailService] Error saving mock email:', error);
      }
    } else {
      // In production, would integrate with actual email service
      console.warn('[EmailService] Production email service not configured');
    }
  }
}

let emailServiceInstance: EmailService | null = null;

export function getEmailService(): EmailService {
  if (!emailServiceInstance) {
    emailServiceInstance = new MockEmailService();
  }
  return emailServiceInstance;
}
