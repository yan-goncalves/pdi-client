import { Global } from '@mantine/core'

const GlobalStyles = () => {
  return (
    <Global
      styles={(theme) => ({
        '&::-webkit-scrollbar': {
          width: '1rem'
        },

        '&::-webkit-scrollbar-thumb': {
          width: '1rem',
          borderRadius: '2rem',
          backgroundClip: 'padding-box',
          border: '0.2rem solid transparent',
          boxShadow: 'inset 0 0 0 10px #ccc'
        },

        'html, body, #__next': {
          height: '100%',
          minHeight: '38rem'
        },

        [`* > .nextui-input-wrapper--normal,
          .nextui-input-wrapper--hover,
          .nextui-input-wrapper--with-value,
          .nextui-input-wrapper--disabled`]: {
          borderRadius: theme.radius.md
        },

        [`* > .nextui-input-main-container--with-value,
          .nextui-input-main-container--hover,
          .nextui-input-main-container--disabled`]: {
          '& .nextui-input-block-label': {
            fontWeight: 500
          }
        },

        '.mantine-Button-root': {
          transition: 'background-color 300ms ease-in-out'
        }

        // '* > .nextui-input-main-container--hover': {
        //   '& .nextui-input-block-label': {
        //     fontWeight: 500
        //   }
        // }
      })}
    />
  )
}

export default GlobalStyles
