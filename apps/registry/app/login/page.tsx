'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../lib/supabase'
import { Button } from "@repo/ui/components/ui/button"
import { Card, CardContent } from "@repo/ui/components/ui/card"
import { Github, FileJson, ArrowRight } from 'lucide-react'
import { Badge } from "@repo/ui/components/ui/badge"
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  const handleGithubLogin = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          scopes: 'read:user gist',
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
          redirectTo: `${window.location.origin}/auth/callback`
        },
      })

      if (error) throw error
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 bg-grid-black/[0.02] bg-[size:20px_20px]" />
      <div className="absolute -top-4 -left-4 w-72 h-72 bg-primary/30 rounded-full blur-3xl" />
      <div className="absolute -bottom-4 -right-4 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />
      
      <Card className="max-w-md w-full relative backdrop-blur-xl bg-white/80 border-none shadow-xl">
        <CardContent className="p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="flex justify-center mb-6">
              <Badge className="animate-pulse" variant="secondary">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse mr-2" />
                Secure GitHub Login
              </Badge>
            </div>
            <div className="flex items-center justify-center gap-2 mb-2">
              <FileJson className="w-8 h-8 text-primary" />
              <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                JSON Resume
              </h2>
            </div>
            <h3 className="text-xl text-gray-600">
              Welcome Back
            </h3>
            <p className="text-gray-600 max-w-sm mx-auto">
              Sign in to manage your resume, explore themes, and share your professional profile.
            </p>
          </div>

          {error && (
            <div className="bg-red-50 p-4 rounded-md">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            <Button
              onClick={handleGithubLogin}
              size="lg"
              className="w-full gap-2 text-lg h-14 hover:scale-105 transition-transform group"
            >
              <Github className="w-5 h-5" />
              Continue with GitHub
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>

            <div className="text-center space-y-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white/80 text-gray-500">New to JSON Resume?</span>
                </div>
              </div>
              
              <Button
                variant="outline"
                size="lg"
                className="w-full gap-2 text-lg h-14 hover:scale-105 transition-transform group"
                asChild
              >
                <Link href="/">
                  Learn More
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-500">
              By signing in, you agree to our{' '}
              <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link>
              {' '}and{' '}
              <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
