import { Image, useMantineTheme } from '@mantine/core'

type LogoMinimalProps = {
  width?: number | 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}

const LogoMinimal = ({ width }: LogoMinimalProps) => {
  const theme = useMantineTheme()

  return <Image src={theme.other.images.logo} width={width || 50} />
}

export default LogoMinimal
