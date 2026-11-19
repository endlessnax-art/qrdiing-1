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

      // Anti-enumeration: Always trigger internal token creation if valid user,
      // but return the EXACT identical response regardless of whether email exists or not.
      setPasswordResetToken(email);

      return NextResponse.json({
        success: true,
        message: "If an account is associated with this email address, password reset instructions have been dispatched.",
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
