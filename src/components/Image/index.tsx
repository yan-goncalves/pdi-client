import {
  Image as MantineImage,
  ImageProps as MantineImageProps
} from '@mantine/core'
import { useStyles } from './styles'

export type ImageProps = {
  url: string
  alternativeText: string | null
  hideOnMobile?: boolean
}

const Image = ({
  url,
  alternativeText,
  hideOnMobile = false,
  ...props
}: ImageProps & MantineImageProps) => {
  const { classes } = useStyles()

  return (
    <MantineImage
      {...props}
      className={!hideOnMobile ? undefined : classes.hideOnMobile}
      src={`${process.env.NEXT_PUBLIC_API_URL}${url}`}
      alt={alternativeText || url}
    />
  )
}

export default Image
