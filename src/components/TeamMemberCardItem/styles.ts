import { DEFAULT_THEME } from '@mantine/core'
import { css } from '@nextui-org/react'

export const useCardStyles = css({
  length: 0,
  transition: 'all 0.15s ease-in-out !important',
  '&:hover': {
    boxShadow: `0 20px 30px ${DEFAULT_THEME.fn.rgba(
      '#1864ab',
      0.15
    )} !important`
  }
})
