import ContentHeader from 'components/ContentHeader'
import { useStyles } from './styles'

type ContentBaseProps = {
  children: React.ReactNode
}

const ContentBase = ({ children }: ContentBaseProps) => {
  const { classes } = useStyles()

  return (
    <div className={classes.root}>
      <ContentHeader />
      {children}
    </div>
  )
}

export default ContentBase
