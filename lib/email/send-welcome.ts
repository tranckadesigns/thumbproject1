import { Resend } from "resend";
import { welcomeEmailHtml, welcomeEmailText } from "./templates/welcome";

export async function sendWelcomeEmail({
  to,
  plan,
}: {
  to: string;
  plan: "monthly" | "yearly" | null;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL ?? "PSDfuel <info@psdfuel.com>";

  if (!apiKey) {
    console.warn("RESEND_API_KEY not set — skipping welcome email");
    return;
  }

  const resend = new Resend(apiKey);

  const { error } = await resend.emails.send({
    from,
    to,
    subject: "Welcome to PSDfuel — you're in.",
    html: welcomeEmailHtml({ email: to, plan }),
    text: welcomeEmailText({ plan }),
  });

  if (error) {
    console.error("Failed to send welcome email:", error);
  }
}
