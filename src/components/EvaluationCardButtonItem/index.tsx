import { Title } from '@mantine/core'
import { Card } from '@nextui-org/react'
import { useAppDispatch } from 'app/hooks'
import { setLoadingOverlayVisibility } from 'features/LoadingOverlay/loading-overlay-slice'
import { useRouter } from 'next/router'
import { useCardStyles } from './styles'

export type EvaluationCardItemProps = {
  year: string
}

const EvaluationCardButtonItem = ({ year }: EvaluationCardItemProps) => {
  const { push, asPath } = useRouter()
  const dispatch = useAppDispatch()

  const handleClick = async () => {
    dispatch(setLoadingOverlayVisibility({ loadingOverlayVisible: true }))
    await push(`${asPath}/${year}`).then(() => {
      dispatch(setLoadingOverlayVisibility({ loadingOverlayVisible: false }))
    })
  }

  return (
    <Card isHoverable isPressable onClick={handleClick} className={useCardStyles()}>
      <Card.Body>
        <Title py={5} order={1} sx={{ fontWeight: 900 }} align={'center'}>
          {year}
        </Title>
      </Card.Body>
    </Card>
  )
}

export default EvaluationCardButtonItem
