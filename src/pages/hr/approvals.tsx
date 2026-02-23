import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/react'
import HRApprovalsTemplate from 'templates/HRApprovals'
import config from '../../../config.json'

const HRApprovalsPage = () => {
  return <HRApprovalsTemplate />
}

export const getServerSideProps: GetServerSideProps = async ({ req, locale }) => {
  const session = await getSession({ req })

  if (!session) {
    const rewriteLocale = locale === 'en' ? '/en' : ''
    return {
      redirect: {
        destination: `${rewriteLocale}/signin`,
        permanent: false
      }
    }
  }

  if (!config.approvals.users.includes(session.user.username)) {
    const rewriteLocale = locale === 'en' ? '/en' : ''
    return {
      redirect: {
        destination: `${rewriteLocale}/dashboard`,
        permanent: false
      }
    }
  }

  return {
    props: {}
  }
}

export default HRApprovalsPage

