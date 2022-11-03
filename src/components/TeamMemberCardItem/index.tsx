import { Text } from '@mantine/core'
import { Card } from '@nextui-org/react'
import { useAppDispatch } from 'app/hooks'
import { FALLBACK_USER_PICTURE } from 'components/UserPicture'
import { setLoadingOverlayVisibility } from 'features/LoadingOverlay/loading-overlay-slice'
import { useRouter } from 'next/router'
import { UserType } from 'types/collection/User'
import { useCardStyles } from './styles'

const TeamMemberCardItem = ({ id, username, info, picture }: UserType) => {
  const { push, pathname } = useRouter()
  const dispatch = useAppDispatch()

  const handleClick = async () => {
    dispatch(setLoadingOverlayVisibility({ loadingOverlayVisible: true }))
    await push(`${pathname}/${username}`).then(() => {
      dispatch(setLoadingOverlayVisibility({ loadingOverlayVisible: false }))
    })
  }

  return (
    <Card
      key={`${id}-${username}`}
      onClick={handleClick}
      isHoverable
      isPressable
      className={useCardStyles()}
    >
      <Card.Body css={{ p: 0, backgroundColor: '#ddd', height: 200, maxHeight: 200 }}>
        <Card.Image
          css={{ objectPosition: 'center center' }}
          objectFit={!picture ? 'scale-down' : 'cover'}
          width={'100%'}
          alt={'team-member-picture'}
          src={!picture ? FALLBACK_USER_PICTURE : `${process.env.NEXT_PUBLIC_API_URL}/${picture}`}
        />
      </Card.Body>
      <Card.Footer style={{ justifyContent: 'center' }}>
        <Text size={'sm'} align={'center'} weight={500}>
          {!info ? username : `${info.name} ${info.lastname}`}
        </Text>
      </Card.Footer>
    </Card>
  )
}

export default TeamMemberCardItem
