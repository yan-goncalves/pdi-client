import { Container } from '@mantine/core'
import ContentHeader from 'components/ContentHeader'
import { useStyles } from './styles'

type ContentBaseProps = {
  children: React.ReactNode
  title?: string
}

const ContentBase = ({ children, title }: ContentBaseProps) => {
  const { classes } = useStyles()

  return (
    <div className={classes.root}>
      <ContentHeader title={title} />
      <div className={classes.container}>{children}</div>
    </div>
  )
}

export default ContentBase
