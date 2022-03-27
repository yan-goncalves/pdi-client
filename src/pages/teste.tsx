import { Button } from '@mantine/core'
import { signOut } from 'next-auth/react'
import { useRouter } from 'next/router'

const Teste = () => {
  const { push } = useRouter()

  return (
    <div>
      Esta é uma página protegida
      <Button
        onClick={async () =>
          await signOut({ redirect: false }).then(() => push('/'))
        }
      >
        logout
      </Button>
    </div>
  )
}

export default Teste
