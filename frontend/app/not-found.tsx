import Link from 'next/link'

export default function NotFound () {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      padding: '2rem',
      textAlign: 'center'
    }}
    >
      <h2 style={{ fontSize: '4rem', marginBottom: '0.5rem' }}>404</h2>
      <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Página no encontrada</h3>
      <p style={{ color: '#666', marginBottom: '2rem' }}>
        La página que buscas no existe o ha sido movida.
      </p>
      <Link
        href='/'
        style={{
          padding: '0.75rem 1.5rem',
          backgroundColor: '#000',
          color: '#fff',
          textDecoration: 'none',
          borderRadius: '4px',
        }}
      >
        Volver al inicio
      </Link>
    </div>
  )
}
