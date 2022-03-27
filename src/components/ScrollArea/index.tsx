import { ScrollArea as MantineScrollArea } from '@mantine/core'
import { useStyles } from './styles'

type ScrollAreaProps = {
  children: React.ReactNode
}

const ScrollArea = ({ children }: ScrollAreaProps) => {
  const { classes } = useStyles()

  return (
    <MantineScrollArea scrollbarSize={10} className={classes.root}>
      {children}
    </MantineScrollArea>
  )
}

export default ScrollArea
