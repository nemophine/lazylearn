'use client';

import { Heart, DollarSign, CreditCard, Users, Info } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ImageWithFallback } from '../figma/ImageWithFallback';

export function DonationPage() {
  const donationTiers = [
    { amount: 5, title: 'Coffee Supporter', perks: ['Special badge', 'Thank you note'] },
    { amount: 10, title: 'Learning Patron', perks: ['All previous', 'Ad-free month', 'Exclusive wallpapers'] },
    { amount: 25, title: 'Education Champion', perks: ['All previous', '3 months ad-free', 'Priority support'] },
  ];

  const subscriptions = [
    { name: 'Basic', price: 4.99, features: ['Unlimited courses', 'Basic support', 'Mobile access'] },
    { name: 'Pro', price: 9.99, features: ['All Basic', 'Ad-free', 'Download videos', 'Certificates'], popular: true },
    { name: 'Premium', price: 19.99, features: ['All Pro', '1-on-1 mentoring', 'Priority support', 'Early access'] },
  ];

  const team = [
    { name: 'Alex Johnson', role: 'Founder & CEO', emoji: '👨‍💼' },
    { name: 'Sarah Lee', role: 'Lead Developer', emoji: '👩‍💻' },
    { name: 'Mike Chen', role: 'UX Designer', emoji: '🎨' },
    { name: 'Emma Wilson', role: 'Content Creator', emoji: '✍️' },
  ];

  return (
    <div className="pb-24 pt-4 px-4 max-w-md mx-auto">
      {/* Header */}
      <Card className="mb-6 bg-gradient-to-br from-[var(--pink)] to-[var(--coral)] border-0 shadow-lg">
        <CardContent className="p-6 text-center">
          <Heart className="w-12 h-12 text-white mx-auto mb-3" />
          <h2 className="text-white mb-2">Support Our Mission</h2>
          <p className="text-sm text-white/90">Help us make quality education accessible to everyone</p>
        </CardContent>
      </Card>

      {/* One-Time Donation */}
      <div className="mb-6">
        <h3 className="mb-3">One-Time Donation</h3>
        <div className="space-y-3">
          {donationTiers.map((tier, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="mb-1">{tier.title}</h4>
                    <p className="text-2xl text-[var(--teal-500)]">${tier.amount}</p>
                  </div>
                  <Button className="rounded-full bg-[var(--teal-400)] hover:bg-[var(--teal-500)]">
                    Donate
                  </Button>
                </div>
                <div className="space-y-1">
                  {tier.perks.map((perk, i) => (
                    <p key={i} className="text-sm text-muted-foreground">✓ {perk}</p>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Subscriptions */}
      <div className="mb-6">
        <h3 className="mb-3">Monthly Subscriptions</h3>
        <div className="space-y-3">
          {subscriptions.map((sub, index) => (
            <Card 
              key={index}
              className={sub.popular ? 'border-[var(--teal-400)] border-2' : ''}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4>{sub.name}</h4>
                      {sub.popular && (
                        <Badge className="bg-[var(--teal-400)] border-0">Popular</Badge>
                      )}
                    </div>
                    <p className="text-2xl text-[var(--teal-500)]">${sub.price}<span className="text-sm text-muted-foreground">/mo</span></p>
                  </div>
                  <Button 
                    variant={sub.popular ? 'default' : 'outline'}
                    className={`rounded-full ${sub.popular ? 'bg-[var(--teal-400)] hover:bg-[var(--teal-500)]' : ''}`}
                  >
                    Subscribe
                  </Button>
                </div>
                <div className="space-y-1">
                  {sub.features.map((feature, i) => (
                    <p key={i} className="text-sm text-muted-foreground">✓ {feature}</p>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Top Up Wallet */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-[var(--yellow)] rounded-xl flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-[var(--teal-600)]" />
            </div>
            <div className="flex-1">
              <p className="mb-0.5">Top Up Wallet</p>
              <p className="text-sm text-muted-foreground">Add credits to your account</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 mb-3">
            {[10, 25, 50].map((amount) => (
              <Button key={amount} variant="outline" className="rounded-full">
                ${amount}
              </Button>
            ))}
          </div>
          <Button className="w-full rounded-full bg-[var(--teal-400)] hover:bg-[var(--teal-500)]">
            Add Funds
          </Button>
        </CardContent>
      </Card>

      {/* About Us / Team */}
      <div className="mb-6">
        <h3 className="mb-3">Meet Our Team</h3>
        <div className="grid grid-cols-2 gap-3">
          {team.map((member, index) => (
            <Card key={index}>
              <CardContent className="p-4 text-center">
                <div className="text-5xl mb-2">{member.emoji}</div>
                <p className="mb-0.5">{member.name}</p>
                <p className="text-xs text-muted-foreground">{member.role}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* About Section */}
      <Card className="bg-gradient-to-br from-[var(--teal-50)] to-[var(--mint)] border-0">
        <CardContent className="p-6">
          <div className="flex items-start gap-3 mb-3">
            <Info className="w-5 h-5 text-[var(--teal-500)] flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="mb-2">About LearnHub</h4>
              <p className="text-sm text-foreground/80">
                We're on a mission to make quality education accessible to everyone. 
                Your support helps us create better content, improve our platform, and reach more learners worldwide.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
