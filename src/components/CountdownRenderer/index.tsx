import { Text, useMantineTheme } from '@mantine/core'
import { CountdownRenderProps } from 'react-countdown'

const CountdownRenderer = ({ days, hours, minutes, seconds }: CountdownRenderProps) => {
  const theme = useMantineTheme()

  return (
    <Text
      size={'xs'}
      px={5}
      py={2}
      weight={500}
      sx={{
        color: theme.colors.gray[5],
        backgroundColor: theme.colors.gray[1],
        borderRadius: theme.radius.md
      }}
    >
      {days}d {hours}h {minutes}m {seconds}s
    </Text>
  )
}

export default CountdownRenderer
