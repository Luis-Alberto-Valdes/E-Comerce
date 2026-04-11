'use client'

import { useEffect } from 'react'

export default function Error ({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log error to monitoring service in production
  }, [error])

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        padding: '2rem',
        textAlign: 'center'
      }}
    >
      <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Algo sali&oacute; mal</h2>
      <p style={{ color: '#666', marginBottom: '2rem' }}>
        Ha ocurrido un error inesperado. Por favor, intenta de nuevo.
      </p>
      <button
        type='button'
        onClick={reset}
        style={{
          padding: '0.75rem 1.5rem',
          backgroundColor: '#000',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '1rem'
        }}
      >
        Intentar de nuevo
      </button>
    </div>
  )
}
