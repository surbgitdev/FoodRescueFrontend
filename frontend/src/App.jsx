
import { useState } from 'react'
import DonorDashboard from './DonorDashboard'
import NGODashboard from './NGODashboard'
import VolunteerDashboard from './VolunteerDashboard'
import './App.css'

function App() {
  const [loggedInUser, setLoggedInUser] = useState(null)
  const [role, setRole] = useState('DONOR')
  const [mode, setMode] = useState('register')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
  })

  function updateField(event) {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    })
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setMessage('')
    setLoading(true)

    const endpoint =
      mode === 'register'
        ? 'http://localhost:8080/api/auth/register'
        : 'http://localhost:8080/api/auth/login'

    const body =
      mode === 'register'
        ? { ...form, role }
        : { email: form.email, password: form.password }

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Something went wrong.')
      }

      if (mode === 'login') {
        setLoggedInUser(data)
        setRole(data.role || 'DONOR')
        return
      }

      setMessage('Registration successful! You can now sign in.')

      setMode('login')
      setForm({
        fullName: '',
        email: form.email,
        password: '',
        phone: '',
      })
    } catch (error) {
      setMessage(
        error.message === 'Failed to fetch'
          ? 'Cannot connect to the server. Check that your backend is running.'
          : error.message
      )
    } finally {
      setLoading(false)
    }
  }

  function handleLogout() {
    setLoggedInUser(null)
    setMessage('')
    setMode('login')
    setForm({
      fullName: '',
      email: '',
      password: '',
      phone: '',
    })
  }

  // Show the appropriate dashboard after successful login.
  if (loggedInUser) {
    if (loggedInUser.role === 'DONOR') {
      return (
        <DonorDashboard
          user={loggedInUser}
          onLogout={handleLogout}
        />
      )
    }

    if (loggedInUser.role === 'NGO') {
      return (
        <NGODashboard
          user={loggedInUser}
          onLogout={handleLogout}
        />
      )
    }

    if (loggedInUser.role === 'VOLUNTEER') {
      return (
        <VolunteerDashboard
          user={loggedInUser}
          onLogout={handleLogout}
        />
      )
    }

    return (
      <div className="app">
        <main className="join-section">
          <div className="auth-card">
            <p className="eyebrow">{loggedInUser.role} SPACE</p>
            <h2>Welcome, {loggedInUser.name || 'User'}!</h2>
            <p>Your account role is not recognized.</p>
            <button className="submit-button" onClick={handleLogout}>
              Sign out
            </button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="app">
      <nav className="navbar">
        <a className="brand" href="#">
          <span className="brand-icon">F</span>
          FoodRescue<span className="brand-light">TT</span>
        </a>

        <div className="nav-links">
          <a href="#how-it-works">How it works</a>
          <a href="#mission">Our mission</a>
          <button
            className="nav-button"
            onClick={() => {
              setMode('login')
              setMessage('')
              document.getElementById('join')?.scrollIntoView({
                behavior: 'smooth',
              })
            }}
          >
            Sign in
          </button>
        </div>
      </nav>

      <main>
        <section className="hero" id="mission">
          <div className="hero-content">
            <span className="eyebrow">LESS WASTE. MORE GOOD.</span>

            <h1>
              Good food deserves
              <br />
              <span>a second chance.</span>
            </h1>

            <p className="hero-description">
              We connect surplus food with people who need it.
              Together, we can reduce food waste and make every
              meal count.
            </p>

            <div className="hero-actions">
              <button
                className="primary-button"
                onClick={() => {
                  setMode('register')
                  setMessage('')
                  document.getElementById('join')?.scrollIntoView({
                    behavior: 'smooth',
                  })
                }}
              >
                Join the movement <span>→</span>
              </button>

              <a className="text-link" href="#how-it-works">
                Discover how it works ↗
              </a>
            </div>

            <div className="impact">
              <div>
                <strong>01</strong>
                <span>Share surplus food</span>
              </div>
              <div>
                <strong>02</strong>
                <span>Connect with NGOs</span>
              </div>
              <div>
                <strong>03</strong>
                <span>Deliver with care</span>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="visual-glow" />
            <div className="food-card">
              <div className="food-illustration">🥗</div>
              <span className="available-tag">
                <span className="status-dot" /> FOOD CAN HELP
              </span>
              <h3>Every meal matters.</h3>
              <p>Rescue food. Restore hope.</p>
              <div className="food-card-footer">
                <span>DONATE</span>
                <span>CONNECT</span>
                <span>DELIVER</span>
              </div>
            </div>
            <div className="floating-note">
              <span className="note-icon">✳</span>
              <div>
                <strong>Small action.</strong>
                <p>Meaningful impact.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="steps-section" id="how-it-works">
          <div className="section-heading">
            <span className="eyebrow">HOW IT WORKS</span>
            <h2>A little effort goes a long way.</h2>
            <p>Three roles. One shared purpose.</p>
          </div>

          <div className="steps-grid">
            <article className="step-card">
              <span className="step-number">01 / DONATE</span>
              <div className="step-icon">↗</div>
              <h3>Have extra food?</h3>
              <p>
                Restaurants, canteens, events and individuals can
                share surplus food instead of wasting it.
              </p>
            </article>

            <article className="step-card">
              <span className="step-number">02 / CONNECT</span>
              <div className="step-icon">◎</div>
              <h3>Find those in need.</h3>
              <p>
                NGOs can discover available food and coordinate
                collections.
              </p>
            </article>

            <article className="step-card">
              <span className="step-number">03 / DELIVER</span>
              <div className="step-icon">↗</div>
              <h3>Be the connection.</h3>
              <p>
                Volunteers help move food from donors to
                organizations that need it.
              </p>
            </article>
          </div>
        </section>

        <section className="join-section" id="join">
          <div className="join-intro">
            <span className="eyebrow">GET INVOLVED</span>
            <h2>
              There is a place
              <br />
              for <span>everyone.</span>
            </h2>
            <p>
              Whether you have food to share, people to serve,
              or time to give, you can be part of the change.
            </p>

            <div className="role-list">
              <button
                className={
                  role === 'DONOR'
                    ? 'role-option selected'
                    : 'role-option'
                }
                onClick={() => setRole('DONOR')}
              >
                <span>01</span> Food donor <span>→</span>
              </button>

              <button
                className={
                  role === 'NGO'
                    ? 'role-option selected'
                    : 'role-option'
                }
                onClick={() => setRole('NGO')}
              >
                <span>02</span> NGO / Organisation <span>→</span>
              </button>

              <button
                className={
                  role === 'VOLUNTEER'
                    ? 'role-option selected'
                    : 'role-option'
                }
                onClick={() => setRole('VOLUNTEER')}
              >
                <span>03</span> Volunteer <span>→</span>
              </button>
            </div>
          </div>

          <div className="auth-card">
            <div className="auth-heading">
              <span className="eyebrow">
                {mode === 'register'
                  ? 'CREATE YOUR ACCOUNT'
                  : 'WELCOME BACK'}
              </span>

              <h2>
                {mode === 'register'
                  ? 'Join FoodRescue.'
                  : 'Good to see you.'}
              </h2>

              <p>
                {mode === 'register'
                  ? `Register as a ${role.toLowerCase()}.`
                  : 'Sign in to continue your journey.'}
              </p>
            </div>

            <div className="auth-tabs">
              <button
                type="button"
                className={mode === 'register' ? 'active' : ''}
                onClick={() => {
                  setMode('register')
                  setMessage('')
                }}
              >
                Create account
              </button>

              <button
                type="button"
                className={mode === 'login' ? 'active' : ''}
                onClick={() => {
                  setMode('login')
                  setMessage('')
                }}
              >
                Sign in
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              {mode === 'register' && (
                <label>
                  Full name
                  <input
                    name="fullName"
                    placeholder="Enter your full name"
                    value={form.fullName}
                    onChange={updateField}
                    required
                  />
                </label>
              )}

              <label>
                Email address
                <input
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={updateField}
                  required
                />
              </label>

              {mode === 'register' && (
                <label>
                  Phone number
                  <input
                    name="phone"
                    type="tel"
                    placeholder="Enter your phone number"
                    value={form.phone}
                    onChange={updateField}
                  />
                </label>
              )}

              <label>
                Password
                <input
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={updateField}
                  minLength={mode === 'register' ? 8 : undefined}
                  required
                />
              </label>

              <button
                className="submit-button"
                type="submit"
                disabled={loading}
              >
                {loading
                  ? 'Please wait...'
                  : mode === 'register'
                    ? 'Create account →'
                    : 'Sign in →'}
              </button>
            </form>

            {message && (
              <div className="form-message" role="status">
                {message}
              </div>
            )}

            <p className="privacy-note">
              By continuing, you agree to use FoodRescue responsibly
              and help reduce food waste.
            </p>
          </div>
        </section>
      </main>

      <footer className="footer">
        <a className="brand" href="#">
          <span className="brand-icon">F</span>
          FoodRescue<span className="brand-light">TT</span>
        </a>
        <p>Rescue food. Restore hope. Make a difference.</p>
        <span>© 2026 FoodRescueTT</span>
      </footer>
    </div>
  )
}

export default App
