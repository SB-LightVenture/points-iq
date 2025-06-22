
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ConfirmationEmailRequest {
  email: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email }: ConfirmationEmailRequest = await req.json();

    console.log("Sending confirmation email to:", email);

    const emailResponse = await resend.emails.send({
      from: "PointsIQ <info@pointsiq.com>",
      to: [email],
      subject: "Welcome to PointsIQ Early Access! 🚀",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome to PointsIQ</title>
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #1e293b 0%, #3730a3 100%); padding: 40px 30px; text-align: center; border-radius: 12px; margin-bottom: 30px;">
              <h1 style="color: white; font-size: 32px; margin: 0 0 10px 0; font-weight: bold;">
                Welcome to <span style="background: linear-gradient(45deg, #60a5fa, #a855f7); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">PointsIQ</span>
              </h1>
              <p style="color: #e2e8f0; font-size: 18px; margin: 0;">You're on the early access list! 🎉</p>
            </div>
            
            <div style="background: #f8fafc; padding: 30px; border-radius: 8px; border-left: 4px solid #3730a3; margin-bottom: 30px;">
              <h2 style="color: #1e293b; margin-top: 0; font-size: 24px;">What's Next?</h2>
              <p style="margin-bottom: 15px;">Thank you for joining thousands of frequent flyers who are ready to discover the true potential of their points!</p>
              <ul style="color: #475569; padding-left: 20px;">
                <li style="margin-bottom: 8px;"><strong>Exclusive Access:</strong> You'll be among the first to experience our revolutionary platform</li>
                <li style="margin-bottom: 8px;"><strong>Launch Notification:</strong> We'll email you the moment PointsIQ goes live</li>
                <li style="margin-bottom: 8px;"><strong>Special Benefits:</strong> Early access members get exclusive features and priority support</li>
              </ul>
            </div>
            
            <div style="background: linear-gradient(45deg, #f0f9ff, #faf5ff); padding: 25px; border-radius: 8px; text-align: center; margin-bottom: 30px;">
              <h3 style="color: #1e293b; margin-top: 0;">Ready to Take Off? ✈️</h3>
              <p style="color: #64748b; margin-bottom: 20px;">While you wait, follow us for updates and travel tips!</p>
              <div style="text-align: center;">
                <a href="#" style="display: inline-block; background: linear-gradient(45deg, #3730a3, #7c3aed); color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 0 5px;">Follow Updates</a>
              </div>
            </div>
            
            <div style="text-align: center; padding: 20px 0; border-top: 1px solid #e2e8f0;">
              <p style="color: #64748b; font-size: 14px; margin: 0;">
                🔒 We respect your privacy. No spam, just early access updates.<br>
                <span style="color: #94a3b8;">PointsIQ - Maximize Your Miles, Optimize Your Journey</span>
              </p>
            </div>
          </body>
        </html>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, emailResponse }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-confirmation-email function:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message,
        details: error.toString()
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
