import { useStyles } from './styles'

type ContentBaseProps = {
  children: React.ReactNode
}

const ContentBase = ({ children }: ContentBaseProps) => {
  const { classes } = useStyles()

  return <div className={classes.root}>{children}</div>
}

export default ContentBase
