import { signIn, useSession } from 'next-auth/client'
import { useCallback } from 'react'

import { getStripeJS } from '../../services/stripe-js'
import { api } from '../../services/api'

import styles from './styles.module.scss'

interface ISubscribeButtonProps {
  priceId: string
}

export function SubscribeButton({
  priceId
}: ISubscribeButtonProps): JSX.Element {
  const [session] = useSession()

  const handleSubscribe = useCallback(async () => {
    if (!session) {
      signIn('github')
      return
    }

    try {
      const response = await api.post('subscribe', { item: priceId })
      const { sessionId } = response.data

      const stripe = await getStripeJS()
      await stripe.redirectToCheckout({ sessionId })
    } catch (error) {
      // eslint-disable-next-line no-alert
      alert(error.message)
    }
  }, [priceId, session])

  return (
    <button
      type="button"
      className={styles.subscribeButton}
      onClick={handleSubscribe}
    >
      Subscribe now
    </button>
  )
}

export default SubscribeButton
