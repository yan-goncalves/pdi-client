import { Card, Divider } from '@mantine/core'
import ContentHeader from 'components/ContentHeader'
import { useStyles } from './styles'

type ContentBaseProps = {
  children: React.ReactNode
  title?: React.ReactNode
}

const ContentBase = ({ children, title }: ContentBaseProps) => {
  const { classes } = useStyles()

  return (
    <div className={classes.root}>
      <Card withBorder mx={15} sx={{ height: '100%' }}>
        <Card.Section>
          <ContentHeader title={title} />
        </Card.Section>
        <Card.Section>
          <Divider />
        </Card.Section>
        <Card.Section sx={{ height: '100%' }}>
          <div className={classes.container}>{children}</div>
        </Card.Section>
      </Card>
    </div>
  )
}

export default ContentBase
