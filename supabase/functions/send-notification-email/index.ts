import { serve } from "https://deno.land/std@0.192.0/http/server.ts";

serve(async (req) => {
  // ✅ CORS preflight
  if (req?.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "*"
      }
    });
  }
  
  try {
    const { emailType, recipientEmail, recipientName, data } = await req?.json();
    
    const RESEND_API_KEY = Deno?.env?.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not configured");
    }

    let subject = "";
    let htmlContent = "";

    // Generate email content based on type
    switch (emailType) {
      case "crypto_bonus":
        subject = "🎉 Crypto Bonus Credited - 8% TAX-FREE Bonus!";
        htmlContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0;">Starlink Crypto Bonus</h1>
            </div>
            <div style="background-color: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              <h2 style="color: #333; margin-top: 0;">Hi ${recipientName},</h2>
              <p style="color: #666; font-size: 16px; line-height: 1.6;">
                Great news! Your crypto deposit has been processed and you've received your <strong>8% TAX-FREE bonus</strong> on Starlink stocks!
              </p>
              <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 10px 0; color: #666;">Crypto Deposit Amount:</td>
                    <td style="padding: 10px 0; text-align: right; font-weight: bold; color: #333;">$${data?.depositAmount?.toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; color: #666;">Bonus Percentage:</td>
                    <td style="padding: 10px 0; text-align: right; font-weight: bold; color: #10b981;">8% TAX-FREE</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; color: #666;">Bonus Amount:</td>
                    <td style="padding: 10px 0; text-align: right; font-weight: bold; color: #10b981;">$${data?.bonusAmount?.toLocaleString()}</td>
                  </tr>
                  <tr style="border-top: 2px solid #e5e7eb;">
                    <td style="padding: 15px 0 0 0; color: #333; font-size: 18px; font-weight: bold;">Total Value:</td>
                    <td style="padding: 15px 0 0 0; text-align: right; font-size: 18px; font-weight: bold; color: #667eea;">$${data?.totalValue?.toLocaleString()}</td>
                  </tr>
                </table>
              </div>
              <p style="color: #666; font-size: 14px; line-height: 1.6;">
                Transaction ID: <strong>${data?.transactionId}</strong><br>
                Date: ${new Date(data.timestamp)?.toLocaleString()}
              </p>
              <div style="background-color: #fef3c7; padding: 15px; border-left: 4px solid #f59e0b; border-radius: 4px; margin-top: 20px;">
                <p style="color: #92400e; margin: 0; font-size: 14px;">
                  <strong>💡 Tax Benefit:</strong> Crypto investments on our platform enjoy TAX-FREE status on bonus earnings!
                </p>
              </div>
            </div>
          </div>
        `;
        break;

      case "withdrawal_approved":
        subject = "✅ Withdrawal Approved - Funds Processing";
        htmlContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
            <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0;">Withdrawal Approved</h1>
            </div>
            <div style="background-color: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              <h2 style="color: #333; margin-top: 0;">Hi ${recipientName},</h2>
              <p style="color: #666; font-size: 16px; line-height: 1.6;">
                Your withdrawal request has been approved and is being processed.
              </p>
              <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 10px 0; color: #666;">Withdrawal Amount:</td>
                    <td style="padding: 10px 0; text-align: right; font-weight: bold; color: #333;">$${data?.amount?.toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; color: #666;">Withdrawal Method:</td>
                    <td style="padding: 10px 0; text-align: right; color: #333;">${data?.method}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; color: #666;">Processing Time:</td>
                    <td style="padding: 10px 0; text-align: right; color: #333;">${data?.processingTime}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; color: #666;">Status:</td>
                    <td style="padding: 10px 0; text-align: right; font-weight: bold; color: #10b981;">Approved</td>
                  </tr>
                </table>
              </div>
              <p style="color: #666; font-size: 14px; line-height: 1.6;">
                Request ID: <strong>${data?.requestId}</strong><br>
                Approved: ${new Date(data.approvedAt)?.toLocaleString()}
              </p>
              <div style="background-color: #dbeafe; padding: 15px; border-left: 4px solid #3b82f6; border-radius: 4px; margin-top: 20px;">
                <p style="color: #1e40af; margin: 0; font-size: 14px;">
                  <strong>📌 Note:</strong> Funds will be transferred to your designated account within the specified processing time.
                </p>
              </div>
            </div>
          </div>
        `;
        break;

      case "investment_alert":
        subject = `📊 Investment Alert - ${data?.alertType}`;
        htmlContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
            <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0;">Investment Alert</h1>
            </div>
            <div style="background-color: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              <h2 style="color: #333; margin-top: 0;">Hi ${recipientName},</h2>
              <p style="color: #666; font-size: 16px; line-height: 1.6;">
                <strong>${data?.alertType}:</strong> ${data?.message}
              </p>
              <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 10px 0; color: #666;">Stock:</td>
                    <td style="padding: 10px 0; text-align: right; font-weight: bold; color: #333;">${data?.stockName}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; color: #666;">Current Price:</td>
                    <td style="padding: 10px 0; text-align: right; font-weight: bold; color: #333;">$${data?.currentPrice}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; color: #666;">Price Change:</td>
                    <td style="padding: 10px 0; text-align: right; font-weight: bold; color: ${data?.priceChange >= 0 ? '#10b981' : '#ef4444'};">
                      ${data?.priceChange >= 0 ? '+' : ''}${data?.priceChange}%
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; color: #666;">Alert Trigger:</td>
                    <td style="padding: 10px 0; text-align: right; color: #333;">${data?.triggerCondition}</td>
                  </tr>
                </table>
              </div>
              <p style="color: #666; font-size: 14px; line-height: 1.6;">
                Alert Time: ${new Date(data.timestamp)?.toLocaleString()}
              </p>
              <div style="background-color: ${data?.severity === 'high' ? '#fee2e2' : '#fef3c7'}; padding: 15px; border-left: 4px solid ${data?.severity === 'high' ? '#ef4444' : '#f59e0b'}; border-radius: 4px; margin-top: 20px;">
                <p style="color: ${data?.severity === 'high' ? '#991b1b' : '#92400e'}; margin: 0; font-size: 14px;">
                  <strong>⚠️ Severity: ${data?.severity?.toUpperCase()}</strong><br>
                  ${data?.recommendation}
                </p>
              </div>
            </div>
          </div>
        `;
        break;

      case "portfolio_milestone":
        subject = `🎯 Portfolio Milestone Achieved - ${data?.milestoneType}`;
        htmlContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
            <div style="background: linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0;">🎉 Milestone Achieved!</h1>
            </div>
            <div style="background-color: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              <h2 style="color: #333; margin-top: 0;">Congratulations ${recipientName}!</h2>
              <p style="color: #666; font-size: 16px; line-height: 1.6;">
                You've reached an important portfolio milestone: <strong>${data?.milestoneType}</strong>
              </p>
              <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 10px 0; color: #666;">Current Portfolio Value:</td>
                    <td style="padding: 10px 0; text-align: right; font-weight: bold; color: #333;">$${data?.currentValue?.toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; color: #666;">Milestone Target:</td>
                    <td style="padding: 10px 0; text-align: right; font-weight: bold; color: #8b5cf6;">$${data?.targetValue?.toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; color: #666;">Total Gain:</td>
                    <td style="padding: 10px 0; text-align: right; font-weight: bold; color: #10b981;">+${data?.totalGain}%</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; color: #666;">Achievement Date:</td>
                    <td style="padding: 10px 0; text-align: right; color: #333;">${new Date(data.achievedAt)?.toLocaleDateString()}</td>
                  </tr>
                </table>
              </div>
              <div style="background-color: #ede9fe; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
                <h3 style="color: #6d28d9; margin: 0 0 10px 0;">Investment Journey</h3>
                <p style="color: #666; margin: 0; font-size: 14px;">
                  Starting Value: <strong>$${data?.startValue?.toLocaleString()}</strong><br>
                  Time to Achieve: <strong>${data?.timeToAchieve}</strong><br>
                  Average Monthly Gain: <strong>${data?.avgMonthlyGain}%</strong>
                </p>
              </div>
              <div style="background-color: #dcfce7; padding: 15px; border-left: 4px solid #10b981; border-radius: 4px; margin-top: 20px;">
                <p style="color: #166534; margin: 0; font-size: 14px;">
                  <strong>🚀 Next Milestone:</strong> ${data?.nextMilestone} - $${data?.nextTargetValue?.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        `;
        break;

      default:
        throw new Error("Invalid email type");
    }

    // Send email via Resend API
    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: "onboarding@resend.dev",
        to: recipientEmail,
        subject: subject,
        html: htmlContent
      })
    });

    if (!resendResponse?.ok) {
      const errorData = await resendResponse?.text();
      throw new Error(`Resend API error: ${errorData}`);
    }

    const resendData = await resendResponse?.json();

    return new Response(JSON.stringify({
      success: true,
      messageId: resendData.id,
      emailType: emailType
    }), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  }
});