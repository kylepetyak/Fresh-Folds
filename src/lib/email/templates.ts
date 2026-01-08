// Email notification templates for Fresh Folds
// These can be used with any email provider (Resend, SendGrid, etc.)

export const emailTemplates = {
  // Customer emails
  pickupReminder48h: {
    subject: 'Your Fresh Folds pickup is in 2 days!',
    template: (data: { customerName: string; pickupDay: string; pickupWindow: string }) => `
Hi ${data.customerName},

Your Fresh Folds pickup is coming up in 2 days!

📅 ${data.pickupDay}
🕐 ${data.pickupWindow}

Make sure your bags are filled and ready on your porch.

Need to skip this pickup? Log in to your dashboard with at least 24 hours notice.

—
The Fresh Folds Team
Laundry day, handled.
    `.trim(),
  },

  pickupReminder24h: {
    subject: 'Your Fresh Folds pickup is tomorrow!',
    template: (data: { customerName: string; pickupWindow: string }) => `
Hi ${data.customerName},

Just a friendly reminder — your laundry pickup is tomorrow!

🕐 ${data.pickupWindow}

Please have your bags filled and set out on your porch before the pickup window starts.

Last chance to skip! Log in to your dashboard if you need to skip this pickup.

—
The Fresh Folds Team
Laundry day, handled.
    `.trim(),
  },

  pickupConfirmed: {
    subject: 'Your laundry has been picked up! 🧺',
    template: (data: { customerName: string; pickupTime: string }) => `
Hi ${data.customerName},

Great news! Your laundry has been picked up at ${data.pickupTime}.

Your clothes are now on their way to be washed, dried, and folded with care.

Expect delivery within 48 hours. We'll send you another notification when your Fresh Folds are on the way back!

—
The Fresh Folds Team
Laundry day, handled.
    `.trim(),
  },

  beingCleaned: {
    subject: 'Your laundry is being cleaned',
    template: (data: { customerName: string }) => `
Hi ${data.customerName},

Your laundry is currently being washed and folded with care!

We use fragrance-free, dermatologist-recommended detergent to keep your clothes fresh and gentle on skin.

You'll receive a notification when your Fresh Folds are out for delivery.

—
The Fresh Folds Team
Laundry day, handled.
    `.trim(),
  },

  outForDelivery: {
    subject: 'Your Fresh Folds are on the way! 🚗',
    template: (data: { customerName: string }) => `
Hi ${data.customerName},

Your freshly folded laundry is out for delivery!

Your provider is on their way to drop off your bags. They'll be placed on your porch.

—
The Fresh Folds Team
Laundry day, handled.
    `.trim(),
  },

  delivered: {
    subject: 'Your Fresh Folds are back! ✨',
    template: (data: { customerName: string; deliveryTime: string }) => `
Hi ${data.customerName},

Your Fresh Folds have been delivered at ${data.deliveryTime}!

Your freshly washed and folded laundry is waiting for you on your porch.

How did we do? Reply to this email with any feedback.

See you next pickup day!

—
The Fresh Folds Team
Laundry day, handled.
    `.trim(),
  },

  subscriptionWelcome: {
    subject: 'Welcome to Fresh Folds! 🎉',
    template: (data: { customerName: string; pickupDay: string; firstPickupDate: string }) => `
Hi ${data.customerName},

Welcome to Fresh Folds! We're so excited to have you.

Here's what happens next:

1. Your Fresh Folds kit (weather-resistant bags) will arrive within 3-5 business days
2. Your first pickup is scheduled for ${data.firstPickupDate}
3. Fill your bags and set them on your porch by your pickup window
4. We'll take care of the rest!

Your regular pickup day: ${data.pickupDay}

Questions? Just reply to this email.

—
The Fresh Folds Team
Laundry day, handled.
    `.trim(),
  },

  subscriptionPaused: {
    subject: 'Your Fresh Folds subscription is paused',
    template: (data: { customerName: string }) => `
Hi ${data.customerName},

Your Fresh Folds subscription has been paused.

We'll keep your spot warm! You can resume anytime from your dashboard.

Miss us already? Log in to resume your subscription.

—
The Fresh Folds Team
Laundry day, handled.
    `.trim(),
  },

  subscriptionCancelled: {
    subject: 'We\'re sorry to see you go',
    template: (data: { customerName: string }) => `
Hi ${data.customerName},

Your Fresh Folds subscription has been cancelled.

We're sorry to see you go. If there's anything we could have done better, please let us know by replying to this email.

Changed your mind? You can always sign up again at freshfolds.com.

—
The Fresh Folds Team
    `.trim(),
  },

  // Provider emails
  providerApplicationReceived: {
    subject: 'We received your Fresh Folds application!',
    template: (data: { providerName: string }) => `
Hi ${data.providerName},

Thanks for applying to become a Fresh Folds provider!

We've received your application and will review it within 48 hours. You'll receive an email with next steps once we've completed our review.

In the meantime, if you have any questions, just reply to this email.

—
The Fresh Folds Team
    `.trim(),
  },

  providerApproved: {
    subject: 'You\'re approved! Welcome to Fresh Folds 🎉',
    template: (data: { providerName: string; onboardingLink: string }) => `
Hi ${data.providerName},

Great news — you've been approved as a Fresh Folds provider!

Next steps:
1. Complete your onboarding at: ${data.onboardingLink}
2. Watch our training videos
3. Set up your bank account for weekly payouts
4. Set your availability and service zones

Once you complete onboarding, you'll start receiving pickup assignments.

Welcome to the team!

—
The Fresh Folds Team
    `.trim(),
  },

  providerPayoutSent: {
    subject: 'Your Fresh Folds payout is on the way! 💰',
    template: (data: { providerName: string; amount: string; periodStart: string; periodEnd: string }) => `
Hi ${data.providerName},

Your payout of ${data.amount} for ${data.periodStart} - ${data.periodEnd} has been sent!

The funds should arrive in your bank account within 1-2 business days.

Keep up the great work!

—
The Fresh Folds Team
    `.trim(),
  },

  providerNewAssignments: {
    subject: 'Your schedule for next week is ready!',
    template: (data: { providerName: string; pickupCount: number }) => `
Hi ${data.providerName},

Your schedule for next week is ready! You have ${data.pickupCount} pickups assigned.

Log in to your dashboard to view your full schedule and route.

Need to request a reassignment? Make sure to do so at least 48 hours in advance.

—
The Fresh Folds Team
    `.trim(),
  },
}

// Helper function to generate email HTML (basic wrapper)
export function wrapInHtml(content: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Fresh Folds</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="white-space: pre-line;">
${content}
  </div>
</body>
</html>
  `.trim()
}
