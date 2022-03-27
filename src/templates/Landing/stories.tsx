import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import Landing from './index'

export default {
  title: 'Layout/Landing',
  component: Landing
} as ComponentMeta<typeof Landing>

export const Default: ComponentStory<typeof Landing> = () => <Landing />
