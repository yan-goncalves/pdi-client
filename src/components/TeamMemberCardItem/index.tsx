import { Text } from '@mantine/core'
import { Card } from '@nextui-org/react'
import { useAppDispatch } from 'app/hooks'
import { FALLBACK_USER_PICTURE } from 'components/UserPicture'
import { setLoadingOverlayVisibility } from 'features/LoadingOverlay/loading-overlay-slice'
import { useRouter } from 'next/router'
import { TeamMember } from 'types/collection/Team'

const TeamMemberCardItem = ({ id, username, info, picture }: TeamMember) => {
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
      shadow={false}
      bordered
      hoverable
      clickable
    >
      <Card.Body css={{ p: 0 }}>
        <Card.Image
          css={{ objectPosition: 'center center' }}
          objectFit={'cover'}
          width={'100%'}
          height={140}
          alt={'team-member-picture'}
          src={
            !picture
              ? FALLBACK_USER_PICTURE
              : `${process.env.NEXT_PUBLIC_API_URL}${picture.url}`
          }
        />
      </Card.Body>
      <Card.Footer>
        <Text align={'center'} weight={500}>
          {!info ? username : `${info.name} ${info.lastname}`}
        </Text>
      </Card.Footer>
    </Card>
  )
}

export default TeamMemberCardItem
