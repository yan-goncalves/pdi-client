import {
  Loader,
  LoadingOverlay as MantineLoadingOverlay,
  useMantineTheme
} from '@mantine/core'
import { Grid } from '@nextui-org/react'
import { useAppSelector } from 'app/hooks'
import LogoPdi from 'components/LogoPdi'
import { selectLoadingOverlay } from 'features/LoadingOverlay/loading-overlay-slice'
import { useEffect } from 'react'

type LoadginOverlayProps = {
  alwaysVisible?: boolean
}

const LoadingOverlay = ({ alwaysVisible = false }: LoadginOverlayProps) => {
  const theme = useMantineTheme()
  const { loadingOverlayVisible } = useAppSelector(selectLoadingOverlay)

  useEffect(() => {
    if (loadingOverlayVisible) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
  }, [loadingOverlayVisible])

  return (
    <MantineLoadingOverlay
      overlayOpacity={0.9}
      transitionDuration={500}
      visible={loadingOverlayVisible || alwaysVisible}
      loader={
        <Grid.Container direction={'column'} alignItems={'center'} gap={1}>
          <Grid>
            <LogoPdi />
          </Grid>
          <Grid>
            <Loader color={theme.colors.blue[9]} variant={'dots'} />
          </Grid>
        </Grid.Container>
      }
    />
  )
}

export default LoadingOverlay
