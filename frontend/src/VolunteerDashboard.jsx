
import { useEffect, useState } from 'react'
import './VolunteerDashboard.css'

const API_URL = 'http://localhost:8080/api/donations'

function VolunteerDashboard({ user, onLogout }) {
  const [tasks, setTasks] = useState([])
  const [myDeliveries, setMyDeliveries] = useState([])
  const [loading, setLoading] = useState(true)
  const [acceptingId, setAcceptingId] = useState(null)
  const [message, setMessage] = useState('')
  const [activeTab, setActiveTab] = useState('tasks')

  async function loadTasks() {
    try {
      setLoading(true)
      const response = await fetch(`${API_URL}/delivery-tasks`)

      if (!response.ok) {
        throw new Error('Could not load delivery tasks.')
      }

      const data = await response.json()
      setTasks(Array.isArray(data) ? data : [])
    } catch (error) {
      setMessage(error.message || 'Could not load delivery tasks.')
    } finally {
      setLoading(false)
    }
  }

  async function loadMyDeliveries() {
    if (!user?.id) return

    try {
      const response = await fetch(`${API_URL}/volunteer/${user.id}`)

      if (!response.ok) {
        throw new Error('Could not load your deliveries.')
      }

      const data = await response.json()
      setMyDeliveries(Array.isArray(data) ? data : [])
    } catch (error) {
      setMessage(error.message || 'Could not load your deliveries.')
    }
  }

  useEffect(() => {
    loadTasks()
    loadMyDeliveries()
  }, [])

  async function acceptDelivery(donationId) {
    if (!user?.id) {
      setMessage('Unable to identify your volunteer account. Please sign in again.')
      return
    }

    setAcceptingId(donationId)
    setMessage('')

    try {
      const response = await fetch(
        `${API_URL}/${donationId}/accept-delivery?volunteerId=${user.id}`,
        { method: 'POST' }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message ||
          data.detail ||
          'Could not accept this delivery.'
        )
      }

      setMessage('Delivery accepted successfully!')
      await loadTasks()
      await loadMyDeliveries()
      setActiveTab('deliveries')
    } catch (error) {
      setMessage(error.message || 'Could not accept this delivery.')
      await loadTasks()
    } finally {
      setAcceptingId(null)
    }
  }

  return (
    <div className="volunteer-page">
      <header className="volunteer-header">
        <a className="volunteer-brand" href="/">
          F <span>FoodRescueTT</span>
        </a>

        <div className="volunteer-account">
          <span>{user?.name || 'Volunteer'}</span>
          <button type="button" onClick={onLogout}>
            Sign out
          </button>
        </div>
      </header>

      <main className="volunteer-main">
        <p className="volunteer-eyebrow">VOLUNTEER SPACE</p>

        <h1>Be the link. <span>Make an impact.</span></h1>

        <p className="volunteer-subtitle">
          Help move surplus food from NGOs to the people who need it.
          Find a delivery task and accept it when you're available.
        </p>

        <section className="volunteer-summary">
          <div>
            <span>Available delivery tasks</span>
            <strong>{tasks.length}</strong>
          </div>

          <div>
            <span>My deliveries</span>
            <strong>{myDeliveries.length}</strong>
          </div>
        </section>

        <section className="volunteer-list-section">
          <div className="volunteer-tabs">
            <button
              type="button"
              className={activeTab === 'tasks' ? 'active' : ''}
              onClick={() => {
                setActiveTab('tasks')
                loadTasks()
              }}
            >
              Available tasks
            </button>

            <button
              type="button"
              className={activeTab === 'deliveries' ? 'active' : ''}
              onClick={() => {
                setActiveTab('deliveries')
                loadMyDeliveries()
              }}
            >
              My deliveries
            </button>
          </div>

          <div className="volunteer-section-heading">
            <h2>
              {activeTab === 'tasks'
                ? 'Available delivery tasks'
                : 'My assigned deliveries'}
            </h2>

            <button
              type="button"
              className="volunteer-refresh"
              onClick={() => {
                loadTasks()
                loadMyDeliveries()
              }}
            >
              Refresh
            </button>
          </div>

          {message && (
            <p className="volunteer-message" role="status">
              {message}
            </p>
          )}

          {loading ? (
            <p className="volunteer-info">Loading delivery tasks...</p>
          ) : (
            (activeTab === 'tasks' ? tasks : myDeliveries).length === 0 ? (
              <div className="volunteer-empty">
                <h3>
                  {activeTab === 'tasks'
                    ? 'No delivery tasks available'
                    : 'No deliveries assigned yet'}
                </h3>

                <p>
                  {activeTab === 'tasks'
                    ? 'When an NGO claims a food donation, its delivery task can appear here.'
                    : 'Accept an available task to see it here.'}
                </p>
              </div>
            ) : (
              <div className="volunteer-cards">
                {(activeTab === 'tasks' ? tasks : myDeliveries).map(donation => (
                  <article className="volunteer-card" key={donation.id}>
                    <div className="volunteer-card-top">
                      <span className="volunteer-status">
                        {donation.status}
                      </span>
                      <span className="volunteer-id">
                        Donation #{donation.id}
                      </span>
                    </div>

                    <h3>{donation.foodName}</h3>

                    <p className="volunteer-food-details">
                      {donation.category} · {donation.quantity} kg
                    </p>

                    <div className="volunteer-detail">
                      <span>Pickup location</span>
                      <strong>{donation.location || 'Not specified'}</strong>
                    </div>

                    <div className="volunteer-detail">
                      <span>Expiry</span>
                      <strong>
                        {donation.expiry
                          ? new Date(donation.expiry).toLocaleString()
                          : 'Not specified'}
                      </strong>
                    </div>

                    {donation.description && (
                      <p className="volunteer-description">
                        {donation.description}
                      </p>
                    )}

                    {activeTab === 'tasks' && (
                      <button
                        type="button"
                        className="volunteer-accept"
                        disabled={acceptingId !== null}
                        onClick={() => acceptDelivery(donation.id)}
                      >
                        {acceptingId === donation.id
                          ? 'Accepting...'
                          : 'Accept delivery'}
                      </button>
                    )}
                  </article>
                ))}
              </div>
            )
          )}
        </section>
      </main>
    </div>
  )
}

export default VolunteerDashboard
