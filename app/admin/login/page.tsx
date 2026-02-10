"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Mail, Lock, Eye, EyeOff, Car } from "lucide-react"
import { login } from "@/lib/api-admin"
import { useAuth } from "@/components/auth-provider"

export default function LoginPage() {
  const router = useRouter()
  const { setUser } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const result = await login(email, password)
      setUser(result.user)
      router.push("/admin/inventory")
    } catch (err: any) {
      setError(err.message || "Credenciais inválidas")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-stretch">
      {/* Left Side: Hero Image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img
          src="/showroom.jpg"
          alt="Showroom"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-slate-900/40" />
        <div className="absolute inset-0 flex flex-col justify-end p-12 xl:p-20 z-10">
          <div className="max-w-lg">
            <div className="flex items-center gap-2 mb-6">
              <Car className="h-9 w-9 text-primary" />
              <span className="text-2xl font-bold text-white tracking-tight">
                AutoCore
              </span>
            </div>
            <h1 className="text-4xl xl:text-5xl font-bold text-white mb-6 leading-tight text-balance">
              Drive your business forward with intelligent inventory.
            </h1>
            <p className="text-lg text-slate-200 mb-8 leading-relaxed">
              The complete operating system for modern automotive retailers.
              Manage inventory, track leads, and close deals faster.
            </p>
          </div>
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 py-12 lg:px-12 bg-card">
        <div className="lg:hidden flex items-center gap-2 mb-12">
          <Car className="h-7 w-7 text-primary" />
          <span className="text-xl font-bold text-foreground tracking-tight">AutoCore</span>
        </div>

        <div className="w-full max-w-md">
          <div className="text-left mb-10">
            <h2 className="text-3xl font-bold text-foreground mb-3">Welcome back</h2>
            <p className="text-muted-foreground">Enter your credentials to manage your dealership.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2" htmlFor="email">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                </div>
                <input
                  className="block w-full pl-10 pr-3 py-3 border border-border bg-card rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm"
                  id="email"
                  placeholder="name@dealership.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-semibold text-foreground" htmlFor="password">Password</label>
                <button type="button" className="text-sm font-semibold text-primary hover:underline">Forgot password?</button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-muted-foreground" />
                </div>
                <input
                  className="block w-full pl-10 pr-10 py-3 border border-border bg-card rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm"
                  id="password"
                  placeholder="••••••••"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
                <button 
                  className="absolute inset-y-0 right-0 pr-3 flex items-center" 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  {showPassword ? <EyeOff className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" /> : <Eye className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />}
                </button>
              </div>
            </div>

            <button 
              className="w-full flex justify-center py-3.5 px-4 rounded-lg shadow-sm text-sm font-bold text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed" 
              type="submit"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="mt-12 text-center border-t border-border pt-8">
            <p className="text-sm text-muted-foreground">
              {"Don't have an account? "}
              <button className="font-bold text-primary hover:text-primary/80 transition-colors ml-1">Contact Support</button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

