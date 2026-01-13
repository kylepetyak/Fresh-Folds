import Link from 'next/link'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { Button, Card, CardContent } from '@/components/ui'

export default function ProvidersPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-teal-600 to-teal-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Earn $300-800/month doing laundry from home
            </h1>
            <p className="mt-6 text-xl text-teal-100">
              Set your own schedule. Use your own equipment. Help busy families in your neighborhood.
            </p>
            <div className="mt-8">
              <Link href="/providers/apply">
                <Button variant="secondary" size="lg">
                  Apply Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* What You'll Do Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">What You&apos;ll Do</h2>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: '1',
                title: 'Pick Up',
                description: 'Collect bags from customers\' porches during your scheduled window.',
              },
              {
                step: '2',
                title: 'Wash & Dry',
                description: 'Launder using our provided fragrance-free, gentle detergent.',
              },
              {
                step: '3',
                title: 'Fold',
                description: 'Fold items the "Fresh Folds way" using our training videos.',
              },
              {
                step: '4',
                title: 'Deliver',
                description: 'Return clean laundry within 48 hours. That\'s it!',
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 rounded-full bg-teal-100 text-teal-600 font-bold text-xl flex items-center justify-center mx-auto">
                  {item.step}
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">{item.title}</h3>
                <p className="mt-2 text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Requirements</h2>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                ),
                title: 'Reliable Transportation',
                description: 'A car, SUV, or van to pick up and deliver laundry.',
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                ),
                title: 'Washer & Dryer',
                description: 'Working machines at your home that you own or can use freely.',
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                title: 'Available Hours',
                description: 'At least 5-10 hours per week for pickups and deliveries.',
              },
            ].map((item) => (
              <Card key={item.title} variant="default">
                <CardContent className="text-center pt-6">
                  <div className="w-12 h-12 rounded-lg bg-teal-100 text-teal-600 flex items-center justify-center mx-auto">
                    {item.icon}
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-gray-900">{item.title}</h3>
                  <p className="mt-2 text-gray-600">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Earnings Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">How Much Can You Earn?</h2>
            <p className="text-lg text-gray-600 mb-8">
              Providers typically earn $300-800 per month, depending on the number of customers
              they serve and their availability.
            </p>

            <div className="bg-teal-50 rounded-xl p-8">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-3xl font-bold text-teal-600">$15-25</p>
                  <p className="text-gray-600">per pickup cycle</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-teal-600">Weekly</p>
                  <p className="text-gray-600">payouts (Fridays)</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-teal-600">Flexible</p>
                  <p className="text-gray-600">schedule</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-teal-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white">Ready to get started?</h2>
          <p className="mt-4 text-xl text-teal-100">
            Applications take about 5 minutes. We review within 48 hours.
          </p>
          <div className="mt-8">
            <Link href="/providers/apply">
              <Button variant="secondary" size="lg">
                Apply Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
