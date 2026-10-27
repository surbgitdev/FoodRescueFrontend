import { useEffect, useState } from 'react'
import './DonorDashboard.css'

const API_URL = 'http://localhost:8080/api/donations'

const emptyForm = {
  foodName: '',
  category: 'Cooked meals',
  quantity: '',
  expiry: '',
  location: '',
  description: '',
}

function DonorDashboard({ user, onLogout }) {
  const [showForm, setShowForm] = useState(false)
  const [donations, setDonations] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    async function loadDonations() {
      try {
        const response = await fetch(
          `${API_URL}/donor/${encodeURIComponent(user?.id ?? '')}`
        )

        if (!response.ok) {
          throw new Error('Could not load donations.')
        }

        const data = await response.json()
        setDonations(Array.isArray(data) ? data : [])
      } catch (error) {
        setMessage(
          'Could not load donations. The backend donation API still needs to be set up.'
        )
      } finally {
        setLoading(false)
      }
    }

    if (user?.id) {
      loadDonations()
    } else {
      setLoading(false)
      setMessage('Please sign in again to manage your donations.')
    }
  }, [user?.id])

  function updateForm(event) {
    const { name, value } = event.target
    setForm((previous) => ({ ...previous, [name]: value }))
  }

  async function addDonation(event) {
    event.preventDefault()
    setMessage('')
    setSaving(true)

    try {
      if (!user?.id) {
        throw new Error('Your user session is missing. Please sign in again.')
      }

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          quantity: Number(form.quantity),
          donorId: user.id,
        }),
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(data.error || 'Could not save this donation.')
      }

      setDonations((previous) => [data, ...previous])
      setForm(emptyForm)
      setShowForm(false)
      setMessage('Donation added successfully!')
    } catch (error) {
      setMessage(
        error.message === 'Failed to fetch'
          ? 'Cannot connect to the backend. Make sure it is running.'
          : error.message
      )
    } finally {
      setSaving(false)
    }
  }

  const availableCount = donations.filter(
    (donation) => donation.status === 'Available'
  ).length

  const rescuedKg = donations
    .filter((donation) => donation.status === 'Rescued')
    .reduce((total, donation) => total + Number(donation.quantity || 0), 0)

  return (
    <div className="donor-page">
      <header className="donor-header">
        <a className="donor-brand" href="/">
          F <span>FoodRescueTT</span>
        </a>

        <div className="donor-account">
          <span>{user?.name || 'Food Donor'}</span>
          <button type="button" onClick={onLogout}>
            Sign out
          </button>
        </div>
      </header>

      <main className="donor-main">
        <p className="donor-eyebrow">DONOR SPACE</p>

        <h1>
          Good food deserves
          <br />
          <span>a second chance.</span>
        </h1>

        <p className="donor-subtitle">
          Manage your surplus food and help get good meals to people who need
          them.
        </p>

        <section className="donor-stats">
          <article>
            <span>Total donations</span>
            <strong>{donations.length}</strong>
          </article>

          <article>
            <span>Available</span>
            <strong>{availableCount}</strong>
          </article>

          <article>
            <span>Food rescued</span>
            <strong>{rescuedKg} kg</strong>
          </article>
        </section>

        <section className="donor-list-section">
          <div className="donor-section-heading">
            <div>
              <p className="donor-eyebrow">YOUR CONTRIBUTION</p>
              <h2>My food donations</h2>
            </div>

            <button
              type="button"
              className="donor-primary-button"
              onClick={() => {
                setShowForm((previous) => !previous)
                setMessage('')
              }}
            >
              {showForm ? 'Cancel' : '+ Add food'}
            </button>
          </div>

          {message && (
            <p className="form-message" role="status">
              {message}
            </p>
          )}

          {showForm && (
            <form className="donor-form" onSubmit={addDonation}>
              <label>
                Food name
                <input
                  name="foodName"
                  value={form.foodName}
                  onChange={updateForm}
                  placeholder="e.g. Fresh vegetable rice"
                  required
                />
              </label>

              <label>
                Food category
                <select
                  name="category"
                  value={form.category}
                  onChange={updateForm}
                >
                  <option>Cooked meals</option>
                  <option>Bakery</option>
                  <option>Fruits and vegetables</option>
                  <option>Packaged food</option>
                  <option>Dairy</option>
                  <option>Other</option>
                </select>
              </label>

              <label>
                Quantity (kg)
                <input
                  name="quantity"
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={form.quantity}
                  onChange={updateForm}
                  placeholder="e.g. 5"
                  required
                />
              </label>

              <label>
                Use by / expiry date and time
                <input
                  name="expiry"
                  type="datetime-local"
                  value={form.expiry}
                  onChange={updateForm}
                  required
                />
              </label>

              <label className="donor-full-width">
                Pickup address
                <input
                  name="location"
                  value={form.location}
                  onChange={updateForm}
                  placeholder="Enter the full pickup address"
                  required
                />
              </label>

              <label className="donor-full-width">
                Additional details
                <textarea
                  name="description"
                  value={form.description}
                  onChange={updateForm}
                  placeholder="Preparation time, storage details, allergens..."
                  rows="3"
                />
              </label>

              <button
                className="donor-primary-button donor-full-width"
                type="submit"
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Add donation →'}
              </button>
            </form>
          )}

          {loading ? (
            <p>Loading your donations...</p>
          ) : donations.length === 0 ? (
            <div className="donor-empty">
              <span className="donor-empty-icon">+</span>
              <h3>Your rescue journey starts here.</h3>
              <p>
                Add your first surplus food listing to help reduce food waste.
              </p>
              <button
                type="button"
                className="donor-secondary-button"
                onClick={() => setShowForm(true)}
              >
                Create your first donation
              </button>
            </div>
          ) : (
            <div className="donor-cards">
              {donations.map((donation) => (
                <article className="donation-card" key={donation.id}>
                  <div>
                    <span className="donor-status">
                      {donation.status || 'Available'}
                    </span>
                    <h3>{donation.foodName}</h3>
                    <p>
                      {donation.category} · {donation.quantity} kg
                    </p>
                    <p>Pickup: {donation.location}</p>
                    <p>
                      Expires:{' '}
                      {donation.expiry
                        ? new Date(donation.expiry).toLocaleString()
                        : 'Not specified'}
                    </p>
                    {donation.description && <p>{donation.description}</p>}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

export default DonorDashboard