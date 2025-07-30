import { useState } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuthStore } from '@/stores/auth'
import { useToast } from '@/hooks/use-toast'

export default function LoginPage() {
  const [searchParams] = useSearchParams()
  const [isLogin, setIsLogin] = useState(!searchParams.get('signup'))
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  
  const { login, register } = useAuthStore()
  const { toast } = useToast()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (isLogin) {
        await login(formData.email, formData.password)
      } else {
        await register(formData.email, formData.password, formData.name)
      }
      navigate('/')
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'An error occurred',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-monday-blue/5 via-white to-monday-purple/5">
      {/* Header */}
      <header className="px-4 py-6 sm:px-6 lg:px-8" role="banner">
        <nav className="flex items-center justify-between max-w-7xl mx-auto" role="navigation" aria-label="Authentication page navigation">
          <Link 
            to="/landing" 
            className="flex items-center focus:outline-none focus:ring-2 focus:ring-monday-blue focus:ring-offset-2 rounded-md px-2 py-1"
            aria-label="Go to Monday Clone homepage"
          >
            <h1 className="text-2xl font-bold text-monday-blue">
              Monday Clone
            </h1>
          </Link>
          
          <Link
            to="/landing"
            className="text-gray-600 hover:text-monday-blue transition-colors focus:outline-none focus:ring-2 focus:ring-monday-blue focus:ring-offset-2 rounded-md px-3 py-2"
            aria-label="Return to homepage"
          >
            ← Back to home
          </Link>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex items-center justify-center px-4 sm:px-6 lg:px-8 pb-12" role="main">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-lg shadow-xl border border-gray-200 p-8">
            <div className="text-center mb-8">
              <h2 id="auth-heading" className="text-3xl font-bold text-gray-900">
                {isLogin ? 'Welcome back' : 'Create your account'}
              </h2>
              <p className="mt-2 text-gray-600">
                {isLogin 
                  ? 'Sign in to access your workspace' 
                  : 'Join thousands of teams using Monday Clone'
                }
              </p>
            </div>

            {/* Social Login Buttons */}
            <section className="space-y-3 mb-6" aria-labelledby="social-login-heading">
              <h3 id="social-login-heading" className="sr-only">Social login options</h3>
              <Button
                type="button"
                variant="outline"
                className="w-full flex items-center justify-center space-x-2 py-3 focus:outline-none focus:ring-2 focus:ring-monday-blue focus:ring-offset-2"
                onClick={() => {
                  toast({
                    title: 'Coming Soon',
                    description: 'Google authentication will be available soon',
                  })
                }}
                aria-label="Sign in with Google (coming soon)"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span>Continue with Google</span>
              </Button>
              
              <Button
                type="button"
                variant="outline"
                className="w-full flex items-center justify-center space-x-2 py-3 focus:outline-none focus:ring-2 focus:ring-monday-blue focus:ring-offset-2"
                onClick={() => {
                  toast({
                    title: 'Coming Soon',
                    description: 'Microsoft authentication will be available soon',
                  })
                }}
                aria-label="Sign in with Microsoft (coming soon)"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill="#f35325" d="M1 1h10v10H1z"/>
                  <path fill="#81bc06" d="M13 1h10v10H13z"/>
                  <path fill="#05a6f0" d="M1 13h10v10H1z"/>
                  <path fill="#ffba08" d="M13 13h10v10H13z"/>
                </svg>
                <span>Continue with Microsoft</span>
              </Button>
            </section>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with email</span>
              </div>
            </div>

            <form 
              className="space-y-6" 
              onSubmit={handleSubmit}
              aria-labelledby="auth-heading"
              role="form"
            >
              <fieldset className="space-y-4">
                <legend className="sr-only">
                  {isLogin ? 'Sign in credentials' : 'Account registration information'}
                </legend>
                
                {!isLogin && (
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      required={!isLogin}
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="h-12 focus:ring-2 focus:ring-monday-blue focus:border-monday-blue"
                      aria-describedby={!isLogin ? "name-description" : undefined}
                    />
                    {!isLogin && (
                      <p id="name-description" className="sr-only">
                        Enter your full name for account registration
                      </p>
                    )}
                  </div>
                )}
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email address
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="h-12 focus:ring-2 focus:ring-monday-blue focus:border-monday-blue"
                    aria-describedby="email-description"
                  />
                  <p id="email-description" className="sr-only">
                    Enter your email address for account access
                  </p>
                </div>
                
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete={isLogin ? 'current-password' : 'new-password'}
                    required
                    placeholder={isLogin ? 'Enter your password' : 'Create a password'}
                    value={formData.password}
                    onChange={handleInputChange}
                    className="h-12 focus:ring-2 focus:ring-monday-blue focus:border-monday-blue"
                    aria-describedby={!isLogin ? "password-requirements" : undefined}
                  />
                  {!isLogin && (
                    <p id="password-requirements" className="text-xs text-gray-500 mt-1">
                      Must be at least 8 characters long
                    </p>
                  )}
                </div>
              </fieldset>

              {isLogin && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-monday-blue focus:ring-monday-blue border-gray-300 rounded"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                      Remember me
                    </label>
                  </div>
                  <button
                    type="button"
                    className="text-sm text-monday-blue hover:text-monday-blue/80"
                    onClick={() => {
                      toast({
                        title: 'Coming Soon',
                        description: 'Password reset functionality will be available soon',
                      })
                    }}
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-12 bg-monday-blue hover:bg-monday-blue/90 text-white font-medium"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>{isLogin ? 'Signing in...' : 'Creating account...'}</span>
                  </div>
                ) : (
                  isLogin ? 'Sign in' : 'Create account'
                )}
              </Button>

              <div className="text-center">
                <button
                  type="button"
                  className="text-monday-blue hover:text-monday-blue/80 font-medium"
                  onClick={() => setIsLogin(!isLogin)}
                >
                  {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
                </button>
              </div>

              {!isLogin && (
                <p className="text-xs text-gray-500 text-center">
                  By creating an account, you agree to our{' '}
                  <a href="#" className="text-monday-blue hover:text-monday-blue/80">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="#" className="text-monday-blue hover:text-monday-blue/80">
                    Privacy Policy
                  </a>
                </p>
              )}
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}