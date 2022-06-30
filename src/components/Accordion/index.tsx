import { Accordion as MantineAccordion, AccordionItem, AccordionProps } from '@mantine/core'
import { IconChevronRight } from '@tabler/icons'
import { useStyles } from './styles'

const Accordion: ((props: AccordionProps) => React.ReactElement) & {
  Item: typeof AccordionItem
} = (props: AccordionProps) => {
  const { classes } = useStyles()

  return (
    <MantineAccordion
      {...props}
      icon={<IconChevronRight size={20} />}
      classNames={classes}
      sx={{ width: '100%' }}
    />
  )
}

Accordion.Item = MantineAccordion.Item

export default Accordion
