import { Button, LoadingOverlay } from '@mantine/core'
import { signOut } from 'next-auth/react'
import { useRouter } from 'next/router'

const Teste = () => {
  if (typeof window === 'undefined') {
    return <LoadingOverlay visible />
  }
  return (
    <div style={{ height: '900px', border: '10px solid black' }}>
      <div
        style={{
          position: 'sticky',
          top: 10
        }}
      >
        scroll: {window.scrollY}
      </div>
    </div>
  )
}

export default Teste
