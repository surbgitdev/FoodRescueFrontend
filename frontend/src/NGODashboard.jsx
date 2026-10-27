
import { useEffect, useState } from 'react'
import './NGODashboard.css'

const API_URL = 'https://foodrescue-backend-8o0j.onrender.com/api/donations/available'

function NGODashboard({ user, onLogout }) {
  const [donations, setDonations] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [claimingId, setClaimingId] = useState(null)
  const [claimedDonations, setClaimedDonations] = useState([])
const [activeTab, setActiveTab] = useState('available')

  async function loadDonations() {
    try {
      setLoading(true)

      const response = await fetch(API_URL)

      if (!response.ok) {
        throw new Error('Could not load available donations.')
      }

      const data = await response.json()

      setDonations(
        Array.isArray(data)
          ? data.filter(donation => donation.status === 'Available')
          : []
      )
    } catch (error) {
      setMessage(error.message || 'Could not load donations. Please check the backend.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDonations()
  }, [])
  
async function loadClaimedDonations() {
  if (!user?.id) return

  try {
  const response = await fetch(
    `https://foodrescue-backend-8o0j.onrender.com/api/donations/ngo/${user.id}`
  );

    if (!response.ok) {
      throw new Error('Could not load claimed donations.')
    }

    const data = await response.json()
    setClaimedDonations(Array.isArray(data) ? data : [])
  } catch (error) {
    setMessage(error.message || 'Could not load claimed donations.')
  }
}


  async function claimDonation(donationId) {
    if (!user?.id) {
      setMessage('Unable to identify your NGO account. Please sign in again.')
      return
    }

    setClaimingId(donationId)
    setMessage('')

    try {
  const response = await fetch(
    `https://foodrescue-backend-8o0j.onrender.com/api/donations/${donationId}/claim?ngoId=${user.id}`,
    { method: 'POST' }
  );
      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message || data.detail || 'Could not claim this donation.'
        )
      }

      setDonations(current =>
  current.filter(donation => donation.id !== donationId)
)

await loadClaimedDonations()

setMessage('Donation claimed successfully!')
    } catch (error) {
      setMessage(error.message || 'Could not claim this donation.')
    } finally {
      setClaimingId(null)
    }
  }

  return (
    <div className="ngo-page">
      <header className="ngo-header">
        <a className="ngo-brand" href="/">
          F <span>FoodRescueTT</span>
        </a>

        <div className="ngo-account">
          <span>{user?.name || 'NGO'}</span>
          <button type="button" onClick={onLogout}>
            Sign out
          </button>
        </div>
      </header>

      <main className="ngo-main">
        <p className="ngo-eyebrow">NGO SPACE</p>

        <h1>
          Good food. <span>Greater impact.</span>
        </h1>

        <p className="ngo-subtitle">
          Discover available food donations and help get them to people
          who need them.
        </p>

        <section className="ngo-summary">
          <span>Available food donations</span>
          <strong>{donations.length}</strong>
        </section>

        <section className="ngo-list-section">
          
<div className="ngo-tabs">
  <button
    type="button"
    className={activeTab === 'available' ? 'active' : ''}
    onClick={() => setActiveTab('available')}
  >
    Available donations
  </button>

  <button
    type="button"
    className={activeTab === 'claimed' ? 'active' : ''}
    onClick={() => {
      setActiveTab('claimed')
      loadClaimedDonations()
    }}
  >
    My claimed donations
  </button>
</div>

<h2>
  {activeTab === 'available'
    ? 'Available donations'
    : 'My claimed donations'}
</h2>


          {message && <p role="status">{message}</p>}

          {loading ? (
            <p>Loading available donations...</p>
          ) : (activeTab === 'available' ? donations : claimedDonations).length === 0 ? (
            <div className="ngo-empty">
              <h3>
  {activeTab === 'available'
    ? 'No available donations yet'
    : 'No claimed donations yet'}
</h3>
<p>
  {activeTab === 'available'
    ? 'New food donations will appear here when available.'
    : 'Donations you claim will appear here.'}
</p>

              <button type="button" onClick={loadDonations}>
                Refresh donations
              </button>
            </div>
          ) : (
            <div className="ngo-cards">
              {(activeTab === 'available' ? donations : claimedDonations).map(donation => (
                <article className="ngo-card" key={donation.id}>
                  <span className="ngo-status">
  {donation.status}
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

                  {donation.description && (
                    <p>{donation.description}</p>
                  )}

                  <button
                    type="button"
                    disabled={claimingId !== null}
                    onClick={() => claimDonation(donation.id)}
                  >
                    {claimingId === donation.id
                      ? 'Claiming...'
                      : 'Claim donation'}
                  </button>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

export default NGODashboard
