import { Title } from '@mantine/core'
import { useWindowScroll } from '@mantine/hooks'
import { useStyles } from './styles'

type ContentHeaderProps = {
  title: string
}

const ContentHeader = ({ title }: ContentHeaderProps) => {
  const [scroll] = useWindowScroll()
  const { classes } = useStyles({ scroll: scroll.y >= 30 })

  return (
    <div className={classes.root}>
      <Title p={20} order={2}>
        {title}
      </Title>
    </div>
  )
}

export default ContentHeader
