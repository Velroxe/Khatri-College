"use client";

import { useState, useEffect, useRef, memo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { useRedirectIfAuthenticated } from "@/lib/auth-redirects";

import { REGEXP_ONLY_DIGITS } from "input-otp";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

// ✅ Lightweight memoized timer subcomponent
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

    const id = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);

    return () => clearInterval(id);
  }, [timeLeft, onExpire]);

  return (
    <p className="text-center text-sm text-muted-foreground">
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

export default function LoginPage() {
  // ✅ Constants
  const OTP_RESEND_SECONDS = 60;

  // ✅ Hooks
  const checked = useRedirectIfAuthenticated();
  const router = useRouter();
  const { resolvedTheme } = useTheme();
  const host = process.env.NEXT_PUBLIC_BACKEND || "";

  // ✅ States
  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpLogin, setIsOtpLogin] = useState(false);

  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpExpired, setOtpExpired] = useState(false);

  // ✅ Mount effect
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  if (!checked)
    return (
      <div className="flex items-center justify-center h-screen">
        Checking session...
      </div>
    );

  // ✅ Handlers
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);

    try {
      const endpoint = isOtpLogin
        ? `${host}/api/auth/admin/login-otp`
        : `${host}/api/auth/admin/login-password`;
      const body = isOtpLogin ? { email, otp } : { email, password };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        credentials: "include",
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("admin_name", data.admin.name);
        localStorage.setItem("admin_email", data.admin.email);
        router.push("/dashboard");
      }
      else alert("Invalid credentials or OTP");
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleSendOtp = async () => {
    if (!email) return alert("Please enter your email first");
    setIsSendingOtp(true);
    try {
      const res = await fetch(`${host}/api/auth/admin/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, purpose: "login" }),
      });

      if (res.ok) {
        setOtpSent(true);
        setOtpExpired(false);
        alert("OTP sent to your email!");
      } else {
        alert("Failed to send OTP");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleResendOtp = () => {
    setOtp("");
    handleSendOtp();
  };

  // ✅ UI
  return (
    <div
      className={`relative min-h-screen flex items-center justify-center p-6 transition-none ${
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
            Khatri College Admin
          </CardTitle>
          <p className="text-center text-sm text-muted-foreground mt-1">
            {isOtpLogin ? "Login with OTP" : "Sign in to continue"}
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email */}
            <div className="space-y-3">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password or OTP */}
            {isOtpLogin ? (
              <div className="space-y-3">
                {!otpSent ? (
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={handleSendOtp}
                    disabled={isSendingOtp || !email}
                  >
                    {isSendingOtp ? "Sending..." : "Send OTP"}
                  </Button>
                ) : (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="otp">Enter OTP</Label>
                      <OTPInput otp={otp} setOtp={setOtp} />
                    </div>

                    {!otpExpired ? (
                      <OtpTimer
                        initialSeconds={OTP_RESEND_SECONDS}
                        onExpire={() => setOtpExpired(true)}
                      />
                    ) : (
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={handleResendOtp}
                        disabled={isSendingOtp}
                      >
                        {isSendingOtp ? "Sending..." : "Resend OTP"}
                      </Button>
                    )}
                  </>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            )}

            {!isOtpLogin && (
              <div className="flex justify-end">
                <Link
                  href="/forgot-password"
                  className="text-sm text-blue-600 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={
                isLoggingIn ||
                (isOtpLogin && (!otpSent || otp.length < 6)) ||
                !email
              }
            >
              {isLoggingIn
                ? "Logging in..."
                : isOtpLogin
                ? "Login with OTP"
                : "Login"}
            </Button>

            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => {
                  setIsOtpLogin(!isOtpLogin);
                  setOtpSent(false);
                  setOtp("");
                  setOtpExpired(false);
                }}
                className="text-sm text-blue-600 hover:underline"
              >
                {isOtpLogin
                  ? "Back to password login"
                  : "Login with OTP instead"}
              </button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="fixed bottom-6 right-6">
        <ThemeSwitcher />
      </div>
    </div>
  );
}
