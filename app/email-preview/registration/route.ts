import { NextResponse } from 'next/server'

/**
 * Dev-only route to preview the registration confirmation email
 * Access at: /email-preview/registration
 */
export async function GET() {
  // Only allow in development
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not available in production' }, { status: 404 })
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || 'https://mycreatorplaybook.com'
  const logoUrl = `${siteUrl}/logo/Creator_Playbook_Logo_Full_Colorful_NoBG.png`

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="x-apple-disable-message-reformatting">
  <title>You're in. Welcome to Creative Playbook</title>
  <!--[if mso]>
  <style type="text/css">
    body, table, td {font-family: Arial, sans-serif !important;}
  </style>
  <![endif]-->
</head>
<body style="margin: 0; padding: 0; background-color: #FFF6EE; font-family: ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <!-- Preheader -->
  <div style="display: none; font-size: 1px; color: #FFF6EE; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
    Registration confirmed. Monthly playbook + video delivered to your inbox.
  </div>
  
  <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #FFF6EE; padding: 0; margin: 0;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; width: 100%; border-collapse: collapse; background-color: #FFFFFF; border-radius: 16px; border: 1px solid rgba(43, 43, 43, 0.08); box-shadow: 0 4px 24px rgba(43, 43, 43, 0.06);">
          <!-- Logo Header -->
          <tr>
            <td style="padding: 48px 40px 32px; text-align: center;">
              <img src="${logoUrl}" alt="Creator Playbook" style="max-width: 200px; height: auto; display: block; margin: 0 auto;" width="200" />
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 0 40px 40px;">
              <!-- Headline -->
              <h1 style="margin: 0 0 24px; font-size: 28px; font-weight: 700; color: #2B2B2B; line-height: 1.3; letter-spacing: -0.5px;">
                Registration confirmed ✅
              </h1>
              
              <!-- Body Copy -->
              <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #2B2B2B;">
                Thanks for registering. You're now on the list.
              </p>
              
              <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #2B2B2B;">
                Each month, we'll send you the Creative Playbook: a new playbook + video to help you think clearer and move faster.
              </p>
              
              <p style="margin: 0 0 32px; font-size: 16px; line-height: 1.6; color: #6B6B6B;">
                No spam. Just the journey.
              </p>
              
              <!-- CTA Button -->
              <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 0 0 40px;">
                <tr>
                  <td align="center" style="padding: 0;">
                    <a href="${siteUrl}/events" style="display: inline-block; padding: 14px 32px; background-color: #FF7A1A; color: #FFFFFF; text-decoration: none; border-radius: 12px; font-weight: 600; font-size: 16px; line-height: 1.5; text-align: center; box-shadow: 0 4px 12px rgba(255, 122, 26, 0.25);">
                      View Events
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 32px 40px; text-align: center; border-top: 1px solid rgba(43, 43, 43, 0.08); background-color: #FFF6EE; border-radius: 0 0 16px 16px;">
              <p style="margin: 0 0 12px; font-size: 13px; line-height: 1.5; color: #6B6B6B;">
                You're receiving this because you registered on Creator Playbook.
              </p>
              <p style="margin: 0; font-size: 12px; line-height: 1.5; color: #6B6B6B;">
                <a href="${siteUrl}/terms" style="color: #6B6B6B; text-decoration: underline;">Terms</a> &middot; <a href="${siteUrl}/privacy" style="color: #6B6B6B; text-decoration: underline;">Privacy</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `

  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html',
    },
  })
}
