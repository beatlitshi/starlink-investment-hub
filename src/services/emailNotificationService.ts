interface CryptoBonusEmailData {
  depositAmount: number;
  bonusAmount: number;
  totalValue: number;
  transactionId: string;
  timestamp: string;
}

interface WithdrawalApprovedEmailData {
  amount: number;
  method: string;
  processingTime: string;
  requestId: string;
  approvedAt: string;
}

interface InvestmentAlertEmailData {
  alertType: string;
  message: string;
  stockName: string;
  currentPrice: number;
  priceChange: number;
  triggerCondition: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high';
  recommendation: string;
}

interface PortfolioMilestoneEmailData {
  milestoneType: string;
  currentValue: number;
  targetValue: number;
  totalGain: number;
  achievedAt: string;
  startValue: number;
  timeToAchieve: string;
  avgMonthlyGain: number;
  nextMilestone: string;
  nextTargetValue: number;
}

class EmailNotificationService {
  private edgeFunctionUrl: string;

  constructor() {
    this.edgeFunctionUrl = process.env.NEXT_PUBLIC_SUPABASE_URL 
      ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/send-notification-email`
      : '';
  }

  private async sendEmail(
    emailType: string,
    recipientEmail: string,
    recipientName: string,
    data: any
  ): Promise<{ success: boolean; error?: string }> {
    try {
      if (!this.edgeFunctionUrl) {
        throw new Error('Supabase URL not configured');
      }

      const response = await fetch(this.edgeFunctionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({
          emailType,
          recipientEmail,
          recipientName,
          data
        })
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to send email');
      }

      return { success: true };
    } catch (error: any) {
      console.error(`Email notification error (${emailType}):`, error);
      return { 
        success: false, 
        error: error.message || 'Failed to send email notification' 
      };
    }
  }

  async sendCryptoBonusEmail(
    recipientEmail: string,
    recipientName: string,
    data: CryptoBonusEmailData
  ): Promise<{ success: boolean; error?: string }> {
    return this.sendEmail('crypto_bonus', recipientEmail, recipientName, data);
  }

  async sendWithdrawalApprovedEmail(
    recipientEmail: string,
    recipientName: string,
    data: WithdrawalApprovedEmailData
  ): Promise<{ success: boolean; error?: string }> {
    return this.sendEmail('withdrawal_approved', recipientEmail, recipientName, data);
  }

  async sendInvestmentAlertEmail(
    recipientEmail: string,
    recipientName: string,
    data: InvestmentAlertEmailData
  ): Promise<{ success: boolean; error?: string }> {
    return this.sendEmail('investment_alert', recipientEmail, recipientName, data);
  }

  async sendPortfolioMilestoneEmail(
    recipientEmail: string,
    recipientName: string,
    data: PortfolioMilestoneEmailData
  ): Promise<{ success: boolean; error?: string }> {
    return this.sendEmail('portfolio_milestone', recipientEmail, recipientName, data);
  }
}

export const emailNotificationService = new EmailNotificationService();
export type {
  CryptoBonusEmailData,
  WithdrawalApprovedEmailData,
  InvestmentAlertEmailData,
  PortfolioMilestoneEmailData
};