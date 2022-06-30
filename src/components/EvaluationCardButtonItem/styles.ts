import { DEFAULT_THEME } from '@mantine/core'
import { css } from '@nextui-org/react'

export const useCardStyles = css({
  length: 0,
  transition: 'all 0.15s ease-in-out !important',
  // filter: 'drop-shadow(0 6px 12px rgb(104 112 118 / 0.15))  !important',
  filter: 'none !important',
  border: `1px solid ${DEFAULT_THEME.colors.gray[3]}`,
  '&:hover': {
    boxShadow: `0 10px 15px ${DEFAULT_THEME.colors.gray[3]} !important`
  }
})
