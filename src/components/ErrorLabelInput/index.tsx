import { Text } from '@mantine/core'
import { useStyles } from './styles'

type ErrorLabelInputProps = {
  text: string
  inError?: boolean
}

const ErrorLabelInput = ({ text, inError = false }: ErrorLabelInputProps) => {
  const { classes } = useStyles({ inError })

  return (
    <Text
      size={'xs'}
      align={'right'}
      mb={'xs'}
      color={'#f21361'}
      className={classes.root}
    >
      {text}
    </Text>
  )
}

export default ErrorLabelInput
