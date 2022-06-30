import { CloseButton, Image, Loader } from '@mantine/core'
import { useSession } from 'next-auth/react'
import { useCallback, useEffect, useState } from 'react'
import ImageViewer from 'react-simple-image-viewer'
import { useStyles } from './styles'

export const FALLBACK_USER_PICTURE = '/img/fallbackUserPicture.png'

type UserPictureProps = {
  width?: number
  height?: number
}

const UserPicture = ({ width = 80, height = 80 }: UserPictureProps) => {
  const [isViewerOpen, setIsViewerOpen] = useState<boolean>(false)
  const { data: session } = useSession()
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [picture, setPicture] = useState<string>(FALLBACK_USER_PICTURE)
  const { classes } = useStyles({
    width,
    height,
    cursor: picture !== FALLBACK_USER_PICTURE ? 'pointer' : undefined
  })

  useEffect(() => {
    if (session && session.user?.picture?.url) {
      setPicture(`${process.env.NEXT_PUBLIC_API_URL}${session.user.picture.url}`)
    } else {
      setPicture(FALLBACK_USER_PICTURE)
    }
    setIsLoading(false)

    return () => {
      setPicture(FALLBACK_USER_PICTURE)
      setIsLoading(true)
    }
  }, [session])

  const openImageViewer = useCallback(() => {
    picture !== FALLBACK_USER_PICTURE && setIsViewerOpen(true)
  }, [])

  const closeImageViewer = () => {
    setIsViewerOpen(false)
  }

  return (
    <div className={classes.container}>
      {isLoading ? (
        <Loader color={'cyan'} />
      ) : (
        <Image
          src={picture}
          onClick={() => openImageViewer()}
          width={width}
          height={height}
          className={classes.image}
        />
      )}

      {isViewerOpen && (
        <div className={classes.containerImageViewer}>
          <ImageViewer
            src={[picture]}
            currentIndex={0}
            onClose={closeImageViewer}
            closeComponent={
              <CloseButton variant={'outline'} style={{ color: '#FFF' }} size={'lg'} />
            }
            backgroundStyle={{
              backgroundColor: 'rgba(0,0,0,0.75)'
            }}
          />
        </div>
      )}
    </div>
  )
}

export default UserPicture
