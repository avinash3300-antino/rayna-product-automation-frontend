"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

function PipelineGraphic() {
  const nodes = ["Ingest", "Enrich", "Review", "Publish"];

  return (
    <div className="mt-12 flex items-center justify-center">
      <svg
        viewBox="0 0 520 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full max-w-md"
      >
        {/* Connecting dashed lines */}
        {[0, 1, 2].map((i) => (
          <line
            key={`line-${i}`}
            x1={70 + i * 150}
            y1={30}
            x2={130 + i * 150}
            y2={30}
            stroke="#C9A84C"
            strokeWidth={2}
            strokeDasharray="6 6"
            className="animate-flow-dash"
            style={{ animationDelay: `${i * 0.3}s` }}
          />
        ))}

        {/* Arrow heads */}
        {[0, 1, 2].map((i) => (
          <polygon
            key={`arrow-${i}`}
            points={`${125 + i * 150},25 ${135 + i * 150},30 ${125 + i * 150},35`}
            fill="#C9A84C"
            opacity={0.8}
          />
        ))}

        {/* Nodes */}
        {nodes.map((label, i) => (
          <g key={label}>
            <circle
              cx={40 + i * 150}
              cy={30}
              r={22}
              fill="rgba(201, 168, 76, 0.15)"
              stroke="#C9A84C"
              strokeWidth={2}
              className="animate-pulse-node"
              style={{ animationDelay: `${i * 0.5}s`, transformOrigin: `${40 + i * 150}px 30px` }}
            />
            <circle
              cx={40 + i * 150}
              cy={30}
              r={6}
              fill="#C9A84C"
              className="animate-pulse-node"
              style={{ animationDelay: `${i * 0.5}s`, transformOrigin: `${40 + i * 150}px 30px` }}
            />
            <text
              x={40 + i * 150}
              y={68}
              textAnchor="middle"
              fill="rgba(255,255,255,0.7)"
              fontSize={11}
              fontWeight={500}
            >
              {label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password. Please try again.");
      } else if (result?.ok) {
        router.push("/dashboard");
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      {/* Left Panel - Brand */}
      <div className="hidden lg:flex flex-col items-center justify-center bg-navy px-12 py-16 relative overflow-hidden">
        {/* Subtle background gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-navy-light/30 via-transparent to-navy-dark/50" />

        <div className="relative z-10 flex flex-col items-center text-center">
          {/* Logo */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white tracking-wide">
              Rayna<span className="text-gold">Tours</span>
            </h1>
            <div className="mt-1 h-0.5 w-16 mx-auto bg-gold/60 rounded-full" />
          </div>

          {/* Tagline with staggered animation */}
          <div className="flex gap-3 text-xl font-medium text-white/90">
            {["Automate.", "Enrich.", "Publish."].map((word, i) => (
              <span
                key={word}
                className="animate-fade-in-up opacity-0"
                style={{ animationDelay: `${0.3 + i * 0.25}s` }}
              >
                {word}
              </span>
            ))}
          </div>

          {/* Pipeline Graphic */}
          <PipelineGraphic />

          <p className="mt-10 text-sm text-white/40 max-w-xs">
            Product Automation System
          </p>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex items-center justify-center px-6 py-12 sm:px-12">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-4">
            <h1 className="text-2xl font-bold text-navy tracking-wide">
              Rayna<span className="text-gold">Tours</span>
            </h1>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">
              Sign in to your account
            </h2>
            <p className="text-sm text-muted-foreground">
              Enter your credentials to access the dashboard
            </p>
          </div>

          {/* Error alert */}
          {error && (
            <div className="flex items-center gap-2 rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@raynatours.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                disabled={isLoading}
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  disabled={isLoading}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember me + Forgot password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) =>
                    setRememberMe(checked === true)
                  }
                  disabled={isLoading}
                />
                <Label
                  htmlFor="remember"
                  className="text-sm font-normal cursor-pointer"
                >
                  Remember me
                </Label>
              </div>
              <button
                type="button"
                className="text-sm text-gold hover:text-gold-dark transition-colors"
              >
                Forgot password?
              </button>
            </div>

            {/* Sign in with SSO button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gold hover:bg-gold-dark text-navy font-semibold h-11 text-sm"
            >
              {isLoading ? "Signing in..." : "Sign in with SSO"}
            </Button>
          </form>

          {/* Role restriction note */}
          <p className="text-center text-xs text-muted-foreground pt-4 border-t">
            Access is role-restricted. Contact your Admin to request access.
          </p>
        </div>
      </div>
    </div>
  );
}
