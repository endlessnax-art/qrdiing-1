import { NextRequest, NextResponse } from "next/server";
import { setPasswordResetToken, resetPassword } from "@/lib/db/storage";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, email, token, newPassword } = body;

    if (action === "request") {
      if (!email || !email.includes("@")) {
        return NextResponse.json(
          { success: false, error: "Please enter a valid email address." },
          { status: 400 }
        );
      }

      const result = setPasswordResetToken(email);
      // Even if user not found, don't expose enumeration in production, but provide simulated link for demo ease
      if (!result) {
        return NextResponse.json({
          success: true,
          message: "If an account exists with this email, a password reset link has been dispatched.",
        });
      }

      const resetLink = `/forgot-password?token=${result.token}`;
      return NextResponse.json({
        success: true,
        message: "Password reset link has been generated.",
        resetToken: result.token,
        resetLink,
      });
    }

    if (action === "reset") {
      if (!token || !newPassword || newPassword.length < 6) {
        return NextResponse.json(
          { success: false, error: "Invalid token or password must be at least 6 characters." },
          { status: 400 }
        );
      }

      const success = resetPassword(token, newPassword);
      if (!success) {
        return NextResponse.json(
          { success: false, error: "Invalid or expired reset token. Please request a new one." },
          { status: 400 }
        );
      }

      return NextResponse.json({
        success: true,
        message: "Your password has been reset successfully. You can now log in.",
      });
    }

    return NextResponse.json({ success: false, error: "Invalid action." }, { status: 400 });
  } catch (error: any) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
