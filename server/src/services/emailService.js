/**
 * Brevo Transactional Email Service
 * Uses Brevo v3 REST API (https://api.brevo.com/v3/smtp/email)
 */

const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';

/**
 * Low-level sender using Brevo REST API
 */
async function sendBrevoEmail({ to, subject, htmlContent, replyTo = null }) {
  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.BREVO_SENDER_EMAIL || 'bestinsurance.pmk@gmail.com';
  const senderName = process.env.BREVO_SENDER_NAME || 'THE BEST INSURANCE POINT';

  if (!apiKey) {
    console.warn('[Brevo Service] BREVO_API_KEY is not set. Email dispatch logged in console (development mode).');
    console.log(`[Brevo Email Preview] To: ${JSON.stringify(to)} | Subject: "${subject}"`);
    return { success: true, simulated: true };
  }

  const payload = {
    sender: { name: senderName, email: senderEmail },
    to: Array.isArray(to) ? to : [{ email: to }],
    subject,
    htmlContent,
  };

  if (replyTo) {
    payload.replyTo = typeof replyTo === 'string' ? { email: replyTo } : replyTo;
  }

  try {
    const res = await fetch(BREVO_API_URL, {
      method: 'POST',
      headers: {
        'api-key': apiKey,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json().catch(() => ({}));
    if (res.ok) {
      console.log(`[Brevo Service] Email sent successfully to ${JSON.stringify(to)}. MessageId: ${data.messageId}`);
      return { success: true, messageId: data.messageId };
    }

    console.error('[Brevo Service Error]', data);
    return { success: false, error: data.message || 'Brevo API error' };
  } catch (err) {
    console.error('[Brevo Service Exception]', err);
    return { success: false, error: err.message };
  }
}

/**
 * Send admin notification when new insurance application is submitted
 */
export async function sendApplicationAdminNotification(application) {
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || 'bestinsurance.pmk@gmail.com';
  const { applicationId, categoryLabel, customer, details, createdAt } = application;

  const detailsRows = Object.entries(details || {})
    .map(
      ([key, val]) =>
        `<tr><td style="padding: 8px; border-bottom: 1px solid #E5E7EB; font-weight: bold; text-transform: capitalize; color: #53627A;">${key.replace(/([A-Z])/g, ' $1')}</td><td style="padding: 8px; border-bottom: 1px solid #E5E7EB; color: #101C38;">${val || '—'}</td></tr>`
    )
    .join('');

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #E5B544; border-radius: 12px; overflow: hidden;">
      <div style="background-color: #171717; padding: 20px; color: white; border-bottom: 3px solid #E5B544;">
        <h2 style="margin: 0; color: #E5B544; font-size: 20px; text-transform: uppercase;">THE BEST INSURANCE POINT</h2>
        <p style="margin: 4px 0 0 0; color: #A7ADB4; font-size: 13px;">New Insurance Application Received [Verified via Mobile OTP]</p>
      </div>
      
      <div style="padding: 24px; background-color: #FFFFFF;">
        <div style="background-color: #FAF2DE; padding: 12px 16px; border-radius: 8px; margin-bottom: 20px;">
          <p style="margin: 0; font-size: 13px; color: #101C38;"><b>Application ID:</b> <span style="color: #F51F2B; font-weight: bold;">${applicationId}</span></p>
          <p style="margin: 4px 0 0 0; font-size: 13px; color: #101C38;"><b>Category:</b> ${categoryLabel}</p>
        </div>

        <h3 style="color: #101C38; font-size: 15px; border-bottom: 2px solid #F3F4F6; padding-bottom: 6px; margin-top: 0;">Customer Information</h3>
        <table style="width: 100%; font-size: 13px; margin-bottom: 20px; border-collapse: collapse;">
          <tr><td style="padding: 6px 0; color: #53627A; width: 140px;">Name:</td><td style="padding: 6px 0; font-weight: bold; color: #101C38;">${customer.name}</td></tr>
          <tr><td style="padding: 6px 0; color: #53627A;">Mobile (OTP Verified):</td><td style="padding: 6px 0; font-weight: bold; color: #047857;">+91 ${customer.mobile} (Verified)</td></tr>
          <tr><td style="padding: 6px 0; color: #53627A;">Email:</td><td style="padding: 6px 0;"><a href="mailto:${customer.email}" style="color: #F51F2B;">${customer.email}</a></td></tr>
          <tr><td style="padding: 6px 0; color: #53627A;">City / Location:</td><td style="padding: 6px 0; color: #101C38;">${customer.city}</td></tr>
          <tr><td style="padding: 6px 0; color: #53627A;">Submitted At:</td><td style="padding: 6px 0; color: #101C38;">${new Date(createdAt).toLocaleString()}</td></tr>
        </table>

        <h3 style="color: #101C38; font-size: 15px; border-bottom: 2px solid #F3F4F6; padding-bottom: 6px;">Application Specifications</h3>
        <table style="width: 100%; font-size: 13px; margin-bottom: 20px; border-collapse: collapse;">
          ${detailsRows}
        </table>
      </div>
      
      <div style="background-color: #F9FAFB; padding: 14px; text-align: center; font-size: 12px; color: #6B7280; border-top: 1px solid #E5E7EB;">
        THE BEST INSURANCE POINT Portal Notification • <a href="tel:+91${customer.mobile}" style="color: #F51F2B; font-weight: bold;">Click to Call Customer</a>
      </div>
    </div>
  `;

  return sendBrevoEmail({
    to: adminEmail,
    subject: `[New ${categoryLabel}] ${applicationId} - ${customer.name} (+91 ${customer.mobile})`,
    htmlContent,
    replyTo: customer.email,
  });
}

/**
 * Send customer confirmation receipt email
 */
export async function sendCustomerConfirmationEmail(application) {
  const { applicationId, categoryLabel, customer } = application;

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #E5E7EB; border-radius: 12px; overflow: hidden;">
      <div style="background-color: #171717; padding: 24px; color: white; border-bottom: 3px solid #E5B544; text-align: center;">
        <h1 style="margin: 0; color: #FFFFFF; font-size: 22px; font-weight: 900;">THE BEST</h1>
        <p style="margin: 2px 0 0 0; color: #E5B544; font-size: 12px; font-weight: bold; letter-spacing: 2px;">INSURANCE POINT</p>
      </div>

      <div style="padding: 24px; background-color: #FFFFFF;">
        <h2 style="color: #101C38; font-size: 18px; margin-top: 0;">Dear ${customer.name},</h2>
        <p style="color: #53627A; font-size: 14px; line-height: 1.6;">
          Thank you for applying for <b>${categoryLabel}</b> with THE BEST INSURANCE POINT. Your application has been successfully verified and registered in our underwriting system.
        </p>

        <div style="background-color: #FAF2DE; border: 1px solid #E5B544; border-radius: 10px; padding: 16px; margin: 20px 0;">
          <p style="margin: 0; font-size: 12px; color: #53627A; text-transform: uppercase; font-weight: bold;">Your Application Reference ID</p>
          <p style="margin: 4px 0 0 0; font-size: 20px; font-weight: 900; color: #101C38; letter-spacing: 1px;">${applicationId}</p>
          <p style="margin: 8px 0 0 0; font-size: 12px; color: #047857; font-weight: bold;">✔ Mobile +91 ${customer.mobile} Verified</p>
        </div>

        <h3 style="color: #101C38; font-size: 15px;">Next Steps:</h3>
        <ol style="color: #53627A; font-size: 13px; line-height: 1.8; padding-left: 20px;">
          <li>Our insurance specialists are analyzing policies across <b>50+ IRDAI approved insurance companies</b>.</li>
          <li>A dedicated advisor will call you within <b>2 working hours</b> to provide quote comparisons with maximum discounts and zero-dep benefits.</li>
          <li>Instant paperless policy issuance with cashless settlement network support.</li>
        </ol>

        <div style="margin-top: 24px; padding: 16px; background-color: #F8F9FA; border-radius: 8px; font-size: 12px; color: #53627A;">
          <b>Need urgent assistance?</b><br />
          Call our helpline directly at: <a href="tel:6380360336" style="color: #F51F2B; font-weight: bold;">+91 63803 60336</a> or email us at <a href="mailto:bestinsurance.pmk@gmail.com" style="color: #F51F2B;">bestinsurance.pmk@gmail.com</a>.
        </div>
      </div>

      <div style="background-color: #171717; padding: 16px; text-align: center; font-size: 11px; color: #A7ADB4;">
        © 2026 THE BEST INSURANCE POINT. All Rights Reserved.<br />
        Your World. Your People. Our Protection.
      </div>
    </div>
  `;

  return sendBrevoEmail({
    to: customer.email,
    subject: `Application Confirmation [${applicationId}] - THE BEST INSURANCE POINT`,
    htmlContent,
  });
}

/**
 * Send admin alert when customer submits enquiry from Contact page
 */
export async function sendEnquiryAdminNotification(enquiry) {
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || 'bestinsurance.pmk@gmail.com';
  const { enquiryId, name, mobile, email, city, insuranceType, subject, message, createdAt } = enquiry;

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #E5B544; border-radius: 12px; overflow: hidden;">
      <div style="background-color: #171717; padding: 20px; color: white; border-bottom: 3px solid #E5B544;">
        <h2 style="margin: 0; color: #E5B544; font-size: 20px; text-transform: uppercase;">THE BEST INSURANCE POINT</h2>
        <p style="margin: 4px 0 0 0; color: #A7ADB4; font-size: 13px;">New Insurance Enquiry Received via Contact Page</p>
      </div>

      <div style="padding: 24px; background-color: #FFFFFF;">
        <div style="background-color: #FAF2DE; padding: 12px 16px; border-radius: 8px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center;">
          <div>
            <span style="font-size: 11px; text-transform: uppercase; color: #53627A; font-weight: bold; display: block;">Enquiry Reference ID</span>
            <span style="font-size: 16px; font-weight: bold; color: #101C38;">${enquiryId || 'BIP-ENQ-' + Date.now().toString(36).toUpperCase()}</span>
          </div>
          <span style="background-color: #F51F2B; color: white; padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: bold;">
            ${insuranceType}
          </span>
        </div>

        <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #E5E7EB; font-weight: bold; color: #53627A; width: 35%;">Customer Name:</td>
            <td style="padding: 8px; border-bottom: 1px solid #E5E7EB; color: #101C38; font-weight: bold;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #E5E7EB; font-weight: bold; color: #53627A;">Mobile Number:</td>
            <td style="padding: 8px; border-bottom: 1px solid #E5E7EB; color: #101C38;">
              <a href="tel:+91${mobile}" style="color: #F51F2B; font-weight: bold; text-decoration: none;">+91 ${mobile}</a>
            </td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #E5E7EB; font-weight: bold; color: #53627A;">Email Address:</td>
            <td style="padding: 8px; border-bottom: 1px solid #E5E7EB; color: #101C38;">
              <a href="mailto:${email}" style="color: #101C38; text-decoration: underline;">${email}</a>
            </td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #E5E7EB; font-weight: bold; color: #53627A;">City / Location:</td>
            <td style="padding: 8px; border-bottom: 1px solid #E5E7EB; color: #101C38;">${city || 'Not provided'}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #E5E7EB; font-weight: bold; color: #53627A;">Insurance Required:</td>
            <td style="padding: 8px; border-bottom: 1px solid #E5E7EB; color: #F51F2B; font-weight: bold;">${insuranceType}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #E5E7EB; font-weight: bold; color: #53627A;">Subject:</td>
            <td style="padding: 8px; border-bottom: 1px solid #E5E7EB; color: #101C38; font-weight: bold;">${subject || 'Insurance Enquiry'}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #E5E7EB; font-weight: bold; color: #53627A; vertical-align: top;">Message:</td>
            <td style="padding: 8px; border-bottom: 1px solid #E5E7EB; color: #101C38; white-space: pre-wrap; line-height: 1.5;">${message}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold; color: #53627A;">Received At:</td>
            <td style="padding: 8px; color: #53627A;">${new Date(createdAt || Date.now()).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</td>
          </tr>
        </table>

        <div style="margin-top: 24px; text-align: center;">
          <a href="tel:+91${mobile}" style="background-color: #F51F2B; color: white; padding: 10px 22px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 13px; display: inline-block; margin-right: 10px;">
            📞 Call Customer Now
          </a>
          <a href="mailto:${email}?subject=Regarding your ${encodeURIComponent(insuranceType)} Enquiry - THE BEST INSURANCE POINT" style="background-color: #101C38; color: white; padding: 10px 22px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 13px; display: inline-block;">
            ✉ Reply via Email
          </a>
        </div>
      </div>

      <div style="background-color: #F9FAFB; padding: 14px; text-align: center; font-size: 12px; color: #6B7280; border-top: 1px solid #E5E7EB;">
        THE BEST INSURANCE POINT Admin Notification • Paramakudi, Tamil Nadu
      </div>
    </div>
  `;

  return sendBrevoEmail({
    to: adminEmail,
    subject: `[New Enquiry] ${insuranceType} - ${name} (+91 ${mobile})`,
    htmlContent,
    replyTo: email,
  });
}

/**
 * Send customer acknowledgement email for contact page enquiry
 */
export async function sendEnquiryCustomerAcknowledgement(enquiry) {
  const { enquiryId, name, email, insuranceType, subject, message } = enquiry;

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #E5E7EB; border-radius: 12px; overflow: hidden;">
      <div style="background-color: #171717; padding: 24px; color: white; border-bottom: 3px solid #E5B544; text-align: center;">
        <h1 style="margin: 0; color: #FFFFFF; font-size: 22px; font-weight: 900;">THE BEST</h1>
        <p style="margin: 2px 0 0 0; color: #E5B544; font-size: 12px; font-weight: bold; letter-spacing: 2px;">INSURANCE POINT</p>
      </div>

      <div style="padding: 24px; background-color: #FFFFFF;">
        <h2 style="color: #101C38; font-size: 18px; margin-top: 0;">Dear ${name},</h2>
        <p style="color: #53627A; font-size: 14px; line-height: 1.6;">
          Thank you for contacting <b>THE BEST INSURANCE POINT</b> regarding your interest in <b>${insuranceType}</b>. We have received your enquiry and our certified insurance specialists are reviewing your requirements.
        </p>

        <div style="background-color: #FAF2DE; border: 1px solid #E5B544; border-radius: 10px; padding: 16px; margin: 20px 0;">
          <p style="margin: 0; font-size: 11px; color: #53627A; text-transform: uppercase; font-weight: bold;">Your Enquiry Reference</p>
          <p style="margin: 4px 0 0 0; font-size: 18px; font-weight: 900; color: #101C38; letter-spacing: 1px;">${enquiryId || 'Registered'}</p>
          <p style="margin: 6px 0 0 0; font-size: 12px; color: #53627A;">Category: <b>${insuranceType}</b></p>
        </div>

        <h3 style="color: #101C38; font-size: 15px;">What to Expect Next:</h3>
        <ol style="color: #53627A; font-size: 13px; line-height: 1.8; padding-left: 20px;">
          <li>Our advisor will compare leading policies across <b>50+ IRDAI approved insurance partners</b> to find the lowest premium with maximum coverage.</li>
          <li>We will contact you within <b>2 working hours</b> to provide unbiased guidance and customized quotations.</li>
          <li>Instant assistance with zero-paperwork digital issuance and dedicated claims support.</li>
        </ol>

        <div style="margin-top: 24px; padding: 16px; background-color: #F8F9FA; border-radius: 8px; font-size: 12px; color: #53627A; border-left: 4px solid #E5B544;">
          <b>Need Immediate Assistance?</b><br />
          Helpline: <a href="tel:6380360336" style="color: #F51F2B; font-weight: bold; text-decoration: none;">+91 63803 60336</a> | Email: <a href="mailto:bestinsurance.pmk@gmail.com" style="color: #F51F2B; text-decoration: none;">bestinsurance.pmk@gmail.com</a>
        </div>
      </div>

      <div style="background-color: #171717; padding: 16px; text-align: center; font-size: 11px; color: #A7ADB4;">
        © 2026 THE BEST INSURANCE POINT • Kattu Paramakudi, Ramanathapuram, Tamil Nadu<br />
        Your World. Your People. Our Protection.
      </div>
    </div>
  `;

  return sendBrevoEmail({
    to: email,
    subject: `Thank you for your ${insuranceType} enquiry [${enquiryId || 'Registered'}] - THE BEST INSURANCE POINT`,
    htmlContent,
  });
}

export default {
  sendBrevoEmail,
  sendApplicationAdminNotification,
  sendCustomerConfirmationEmail,
  sendEnquiryAdminNotification,
  sendEnquiryCustomerAcknowledgement,
};
