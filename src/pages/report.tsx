import { GetServerSideProps } from 'next'

const ReportPage = () => {
  return (
    <div>
      <div>report</div>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {}
  }
}

export default ReportPage
