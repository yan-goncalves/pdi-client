import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/react'
import HRApprovalsTemplate from 'templates/HRApprovals'

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

  // Check if user is from HR department
  const userDepartmentKey = session.user?.department?.key?.toLowerCase()
  const hrDepartmentKeys = ['rh', 'recursos_humanos', 'human_resources']

  if (!userDepartmentKey || !hrDepartmentKeys.includes(userDepartmentKey)) {
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

