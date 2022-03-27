import { Image, useMantineTheme } from '@mantine/core'

const LogoPdi = () => {
  const theme = useMantineTheme()

  return <Image src={theme.other.images.logoPdi} width={50} />
}

export default LogoPdi
