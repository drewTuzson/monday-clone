import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/stores/auth'

export default function LandingPage() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuthStore()

  // If already authenticated, redirect to dashboard
  if (isAuthenticated) {
    navigate('/')
    return null
  }

  const features = [
    {
      title: 'Visual Project Management',
      description: 'Organize work in colorful boards that everyone can see and understand at a glance.',
      icon: '📊'
    },
    {
      title: 'Team Collaboration',
      description: 'Keep everyone aligned with real-time updates, comments, and file sharing.',
      icon: '👥'
    },
    {
      title: 'Automated Workflows',
      description: 'Save time with automations that handle repetitive tasks and notifications.',
      icon: '⚡'
    },
    {
      title: 'Custom Templates',
      description: 'Get started fast with pre-built templates for any team or project type.',
      icon: '🎯'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-monday-blue/5 via-white to-monday-purple/5">
      {/* Header */}
      <header className="px-4 py-6 sm:px-6 lg:px-8" role="banner">
        <nav className="flex items-center justify-between max-w-7xl mx-auto" role="navigation" aria-label="Main navigation">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-monday-blue">
              Monday Clone
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link
              to="/login"
              className="text-gray-600 hover:text-monday-blue transition-colors focus:outline-none focus:ring-2 focus:ring-monday-blue focus:ring-offset-2 rounded-md px-3 py-2"
              aria-label="Log in to your account"
            >
              Log in
            </Link>
            <Button
              onClick={() => navigate('/login?signup=true')}
              className="bg-monday-blue hover:bg-monday-blue/90 text-white focus:outline-none focus:ring-2 focus:ring-monday-blue focus:ring-offset-2"
              aria-label="Sign up for a new account"
            >
              Get Started
            </Button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" role="main">
        <section className="text-center py-16 sm:py-20" aria-labelledby="hero-heading">
          <div>
            <h1 id="hero-heading" className="text-4xl sm:text-6xl font-bold text-gray-900 mb-6">
              Work without limits
            </h1>
            <p className="text-xl sm:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Easily build, run, and scale your dream workflows on one platform. What would you like to manage with Monday Clone?
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12" role="group" aria-label="Sign up actions">
              <Button
                size="lg"
                onClick={() => navigate('/login?signup=true')}
                className="bg-monday-blue hover:bg-monday-blue/90 text-white px-8 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-monday-blue focus:ring-offset-2"
                aria-label="Sign up for free account"
              >
                Get Started - It's Free
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate('/login')}
                className="border-monday-blue text-monday-blue hover:bg-monday-blue/5 px-8 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-monday-blue focus:ring-offset-2"
                aria-label="Watch product demonstration"
              >
                See How It Works
              </Button>
            </div>

            {/* Hero Image Placeholder */}
            <div className="mt-12 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden">
              <div className="h-96 bg-gradient-to-br from-monday-blue/10 to-monday-purple/10 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-4">📋</div>
                  <p className="text-gray-600">Interactive demo coming soon</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Everything you need to manage work
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Powerful features that scale with your team, from startups to enterprises
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6">
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 text-center">
          <div className="bg-monday-blue rounded-lg p-12 text-white">
            <h2 className="text-3xl font-bold mb-4">
              Ready to get started?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of teams already using Monday Clone
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                onClick={() => navigate('/login?signup=true')}
                className="bg-white text-monday-blue hover:bg-gray-100 px-8 py-4 text-lg"
              >
                Start Free Trial
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate('/login')}
                className="border-white text-white hover:bg-white/10 px-8 py-4 text-lg"
              >
                Contact Sales
              </Button>
            </div>
          </div>
        </section>

        {/* Social Proof */}
        <section className="py-16 text-center">
          <p className="text-gray-600 mb-8">Trusted by teams at</p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-50">
            <div className="text-2xl font-bold text-gray-400">Company A</div>
            <div className="text-2xl font-bold text-gray-400">Company B</div>
            <div className="text-2xl font-bold text-gray-400">Company C</div>
            <div className="text-2xl font-bold text-gray-400">Company D</div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 mt-16 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between">
            <p className="text-gray-500 mb-4 sm:mb-0">
              © 2024 Monday Clone. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-500 hover:text-monday-blue transition-colors">
                Privacy
              </a>
              <a href="#" className="text-gray-500 hover:text-monday-blue transition-colors">
                Terms
              </a>
              <a href="#" className="text-gray-500 hover:text-monday-blue transition-colors">
                Support
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}