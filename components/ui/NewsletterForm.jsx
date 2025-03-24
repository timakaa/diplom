"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    // Here you would add your newsletter subscription logic
    console.log(`Subscribing email: ${email}`);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setEmail("");
      // Show success toast or message
    }, 1000);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className='flex w-full max-w-sm items-center space-x-2'
    >
      <Input
        type='email'
        placeholder='Email'
        className='flex-1'
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <Button type='submit' disabled={isSubmitting}>
        {isSubmitting ? "..." : "Подписаться"}
      </Button>
    </form>
  );
}
