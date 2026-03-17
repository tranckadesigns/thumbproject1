const ACCENT = "#C9A96E";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.psdfuel.com";

export function welcomeEmailHtml({
  email: _email,
  plan,
}: {
  email: string;
  plan: "monthly" | "yearly" | null;
}): string {
  const planLabel = plan === "yearly" ? "Annual" : "Monthly";
  const libraryUrl = `${SITE_URL}/library`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Welcome to PSDfuel</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">

          <!-- Logo -->
          <tr>
            <td align="center" style="padding-bottom:28px;">
              <span style="font-size:20px;font-weight:700;letter-spacing:-0.5px;color:#0a0a0a;">
                PSD<span style="color:${ACCENT};">fuel</span>
              </span>
            </td>
          </tr>

          <!-- Card -->
          <tr>
            <td style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,0.08);">

              <!-- Top accent bar -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="height:3px;background:linear-gradient(90deg,#0a0a0a 0%,${ACCENT} 50%,#0a0a0a 100%);"></td>
                </tr>
              </table>

              <!-- Body -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:40px 48px 16px;">
                    <p style="margin:0 0 8px;font-size:13px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:#999999;">
                      ${planLabel} plan
                    </p>
                    <h1 style="margin:0 0 20px;font-size:26px;font-weight:700;letter-spacing:-0.5px;color:#0a0a0a;line-height:1.2;">
                      You&rsquo;re in.
                    </h1>
                    <p style="margin:0 0 20px;font-size:15px;line-height:1.6;color:#555555;">
                      Your PSDfuel subscription is active. The full library is now unlocked — every PSD asset, every category, every new release.
                    </p>
                    <p style="margin:0 0 32px;font-size:15px;line-height:1.6;color:#555555;">
                      Head to the library and start downloading.
                    </p>

                    <!-- CTA -->
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="border-radius:8px;background:#0a0a0a;">
                          <a href="${libraryUrl}"
                             style="display:inline-block;padding:13px 28px;font-size:14px;font-weight:600;color:#ffffff;text-decoration:none;letter-spacing:0.1px;">
                            Browse the library &rarr;
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Divider -->
                <tr>
                  <td style="padding:32px 48px 0;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr><td style="height:1px;background:#eeeeee;"></td></tr>
                    </table>
                  </td>
                </tr>

                <!-- What's included -->
                <tr>
                  <td style="padding:28px 48px 0;">
                    <p style="margin:0 0 16px;font-size:13px;font-weight:600;letter-spacing:1px;text-transform:uppercase;color:#999999;">
                      What&rsquo;s included
                    </p>
                    <table cellpadding="0" cellspacing="0" width="100%">
                      ${[
                        "Full library — all assets unlocked",
                        "Fully layered Adobe Photoshop PSD files",
                        "Commercial license included",
                        "New assets added every month, automatically",
                        "Unlimited downloads",
                      ]
                        .map(
                          (item) => `
                      <tr>
                        <td width="20" valign="top" style="padding:0 10px 10px 0;color:${ACCENT};font-size:14px;">&#10003;</td>
                        <td style="padding-bottom:10px;font-size:14px;line-height:1.5;color:#444444;">${item}</td>
                      </tr>`
                        )
                        .join("")}
                    </table>
                  </td>
                </tr>

                <!-- Footer note -->
                <tr>
                  <td style="padding:28px 48px 40px;">
                    <p style="margin:0;font-size:13px;line-height:1.6;color:#aaaaaa;">
                      Questions? Reply to this email — we read every message.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding-top:24px;">
              <p style="margin:0;font-size:12px;color:#aaaaaa;">
                PSDfuel &middot; You&rsquo;re receiving this because you subscribed at psdfuel.com
              </p>
              <p style="margin:6px 0 0;font-size:12px;">
                <a href="${SITE_URL}/account" style="color:#aaaaaa;text-decoration:underline;">
                  Manage subscription
                </a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function welcomeEmailText({
  plan,
}: {
  plan: "monthly" | "yearly" | null;
}): string {
  const planLabel = plan === "yearly" ? "Annual" : "Monthly";
  const libraryUrl = `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.psdfuel.com"}/library`;

  return `Welcome to PSDfuel — ${planLabel} plan

Your subscription is active. The full library is now unlocked.

Browse the library: ${libraryUrl}

What's included:
- Full library — all assets unlocked
- Fully layered Adobe Photoshop PSD files
- Commercial license included
- New assets added every month, automatically
- Unlimited downloads

Questions? Reply to this email.

PSDfuel`;
}
