export type DashboardProps = {
  type: 'User' | 'Manager'
}

const Dashboard = ({ type }: DashboardProps) => {
  return <div>{type} dashboard</div>
}

export default Dashboard
