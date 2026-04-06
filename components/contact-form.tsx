"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Failed to send message")
      }

      setSubmitted(true)
      setFormData({ name: "", email: "", company: "", message: "" })
    } catch (err) {
      setError("Failed to send message. Please try again.")
      console.error("Form error:", err)
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="text-center py-8">
        <p className="text-lg text-black font-medium mb-2">Thank you for reaching out!</p>
        <p className="text-neutral-600">We will get back to you shortly.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-6 text-left">
      {error && (
        <div className="p-3 bg-red-100 border border-red-300 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}
      <div className="space-y-2">
        <Label htmlFor="name" className="text-neutral-700">Name</Label>
        <Input
          id="name"
          type="text"
          placeholder="Your name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          disabled={loading}
          className="bg-white/50 border-white/40 focus:border-[rgb(100,200,255)] focus:ring-[rgb(100,200,255)]/20"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email" className="text-neutral-700">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="your@email.com"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
          disabled={loading}
          className="bg-white/50 border-white/40 focus:border-[rgb(100,200,255)] focus:ring-[rgb(100,200,255)]/20"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="company" className="text-neutral-700">Company (Optional)</Label>
        <Input
          id="company"
          type="text"
          placeholder="Your company"
          value={formData.company}
          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
          disabled={loading}
          className="bg-white/50 border-white/40 focus:border-[rgb(100,200,255)] focus:ring-[rgb(100,200,255)]/20"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="message" className="text-neutral-700">Message</Label>
        <Textarea
          id="message"
          placeholder="How can we help you?"
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          required
          disabled={loading}
          rows={4}
          className="bg-white/50 border-white/40 focus:border-[rgb(100,200,255)] focus:ring-[rgb(100,200,255)]/20 resize-none"
        />
      </div>
      <Button 
        type="submit" 
        disabled={loading}
        className="w-full bg-black hover:bg-neutral-800 text-white disabled:opacity-50"
      >
        {loading ? "Sending..." : "Send Message"}
      </Button>
    </form>
  )
}
