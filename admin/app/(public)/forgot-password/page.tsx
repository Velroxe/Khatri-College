"use client";

import { useState, useEffect, memo } from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

// ⏱️ Stable timer component (no re-renders on parent state)
const OtpTimer = memo(function OtpTimer({
  initialSeconds,
  onExpire,
}: {
  initialSeconds: number;
  onExpire: () => void;
}) {
  const [timeLeft, setTimeLeft] = useState(initialSeconds);

  useEffect(() => {
    if (timeLeft <= 0) {
      onExpire();
      return;
    }
    const id = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [timeLeft, onExpire]);

  return (
    <p className="text-center text-sm text-muted-foreground mt-1">
      Resend OTP in <strong>{timeLeft}s</strong>
    </p>
  );
});

// ✅ Subcomponent for OTP input
const OTPInput = ({otp, setOtp} : any) => (
  <InputOTP
    maxLength={6}
    pattern={REGEXP_ONLY_DIGITS}
    value={otp}
    onChange={(val) => setOtp(val)}
  >
    <InputOTPGroup>
      <InputOTPSlot index={0} />
      <InputOTPSlot index={1} />
      <InputOTPSlot index={2} />
      <InputOTPSlot index={3} />
      <InputOTPSlot index={4} />
      <InputOTPSlot index={5} />
    </InputOTPGroup>
  </InputOTP>
);

export default function ForgotPasswordPage() {
  const { resolvedTheme } = useTheme();
  const host = process.env.NEXT_PUBLIC_BACKEND || "";

  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpExpired, setOtpExpired] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  // 📨 Send OTP
  const handleSendOtp = async () => {
    if (!email) return alert("Please enter your email");
    setLoading(true);
    try {
      const res = await fetch(`${host}/api/auth/admin/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, purpose: "forgot_password" }),
      });
      if (res.ok) {
        setOtpSent(true);
        setOtpExpired(false);
        alert("OTP sent to your email!");
      } else alert("Failed to send OTP");
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // 🔒 Reset Password
  const handleResetPassword = async () => {
    if (!otp || otp.length < 6) return alert("Please enter a valid OTP");
    if (!password || password !== confirmPassword)
      return alert("Passwords do not match");

    setLoading(true);
    try {
      const res = await fetch(`${host}/api/auth/admin/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword: password }),
      });

      if (res.ok) {
        alert("Password reset successful! You can now log in.");
        window.location.href = "/login";
      } else {
        alert("Invalid OTP or error resetting password.");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`relative min-h-screen flex items-center justify-center p-6 ${
        resolvedTheme === "dark"
          ? "bg-gray-950 text-gray-100"
          : "bg-gray-50 text-gray-900"
      }`}
    >
      <Card
        className={`w-full max-w-sm shadow-lg border ${
          resolvedTheme === "dark"
            ? "bg-gray-900 border-gray-800"
            : "bg-white border-gray-200"
        }`}
      >
        <CardHeader className="pb-4">
          <CardTitle className="text-center text-2xl font-semibold">
            Reset Password
          </CardTitle>
          <p className="text-center text-sm text-muted-foreground mt-1">
            {otpSent
              ? "Enter the OTP and new password below"
              : "Enter your email to receive an OTP"}
          </p>
        </CardHeader>

        <CardContent>
          <div className="space-y-5">
            {/* 📧 Email always visible */}
            <div className="space-y-2">
              <Label>Email</Label>
              {!otpSent ? (
                <Input
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              ) : (
                <div className="p-2 rounded-md bg-muted text-center text-sm">
                  {email}
                </div>
              )}
            </div>

            {/* 📨 Send OTP or Resend */}
            {!otpSent ? (
              <Button
                className="w-full"
                onClick={handleSendOtp}
                disabled={loading || !email}
              >
                {loading ? "Sending..." : "Send OTP"}
              </Button>
            ) : (
              <div className="space-y-4">
                {/* 🔢 OTP input */}
                <div className="space-y-2">
                  <Label>Enter OTP</Label>
                  <OTPInput otp={otp} setOtp={setOtp} />
                  {!otpExpired ? (
                    <OtpTimer
                      initialSeconds={60}
                      onExpire={() => setOtpExpired(true)}
                    />
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full mt-2"
                      onClick={handleSendOtp}
                      disabled={loading}
                    >
                      {loading ? "Resending..." : "Resend OTP"}
                    </Button>
                  )}
                </div>

                {/* 🔐 New Password */}
                <div className="space-y-2">
                  <Label>New Password</Label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                {/* 🔁 Confirm Password */}
                <div className="space-y-2">
                  <Label>Confirm New Password</Label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>

                <Button
                  className="w-full"
                  onClick={handleResetPassword}
                  disabled={loading || otp.length < 6}
                >
                  {loading ? "Resetting..." : "Reset Password"}
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 🌗 Theme Toggle */}
      <div className="fixed bottom-6 right-6">
        <ThemeSwitcher />
      </div>
    </div>
  );
}
