'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { Card } from "@repo/ui/components/ui/card"

export default function SettingsPage() {
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession()
      if (session) {
        setSession(session)
      }
      setLoading(false)
    }

    fetchSession()
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  if (!session) {
    return <div>Please sign in to view settings</div>
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <h2 className="font-semibold">Email</h2>
            <p>{session.user.email}</p>
          </div>
          <div>
            <h2 className="font-semibold">User ID</h2>
            <p>{session.user.id}</p>
          </div>
          {session.user.user_metadata && (
            <div>
              <h2 className="font-semibold">GitHub Username</h2>
              <p>{session.user.user_metadata.user_name}</p>
            </div>
          )}
          <div>
            <h2 className="font-semibold">Last Sign In</h2>
            <p>{new Date(session.user.last_sign_in_at).toLocaleString()}</p>
          </div>
        </div>
      </Card>
    </div>
  )
}
