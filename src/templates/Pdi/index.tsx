import { Avatar, Box, Group, Tabs, Text, Title, useMantineTheme } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import ContentBase from 'components/ContentBase'
import { FALLBACK_USER_PICTURE } from 'components/UserPicture'
import { CommonConstants } from 'constants/common'
import { EVALUATION_ACTOR, useEvaluation } from 'contexts/EvaluationProvider'
import { useLocale } from 'contexts/LocaleProvider'
import PdiCoaching from 'templates/PdiCoaching'
import PdiCompetence from 'templates/PdiCompetence'
import PdiQuality from 'templates/PdiQuality'
import { useStyles } from './styles'

const PdiManagementTemplate = () => {
  const theme = useMantineTheme()
  const { classes } = useStyles()
  const { locale } = useLocale()
  const { evaluationModel, performedEvaluation, appraisee } = useEvaluation()
  const match = useMediaQuery(`(max-width: ${theme.breakpoints.xs}px)`, false)

  return (
    <ContentBase
      title={
        <Group sx={{ justifyContent: 'space-between' }}>
          <Title p={20} order={!match ? 3 : 6}>
            {CommonConstants.pdi.title[locale]} - {evaluationModel.year}
          </Title>
          <Group mr={25}>
            <Avatar
              size={!match ? 'sm' : 'xs'}
              src={
                !appraisee?.picture
                  ? FALLBACK_USER_PICTURE
                  : `${process.env.NEXT_PUBLIC_API_URL}${appraisee.picture}`
              }
              sx={{ backgroundColor: theme.colors.gray[3] }}
            />
            <Text size={!match ? 'md' : 'xs'} weight={500}>
              {appraisee.info?.name} {appraisee.info?.lastname}
            </Text>
          </Group>
        </Group>
      }
    >
      <Tabs
        grow
        color={'grape'}
        position={'center'}
        variant={'unstyled'}
        m={30}
        classNames={{ tabControl: classes.tabControl, tabActive: classes.tabActive }}
        sx={{
          height: 'calc(100% - 100px)',
          border: `1px solid ${theme.colors.gray[3]}`,
          borderRadius: theme.radius.lg
        }}
      >
        <Tabs.Tab label={CommonConstants.pdiQuality.title[locale]}>
          <Group p={25}>
            <PdiQuality actor={EVALUATION_ACTOR.MANAGER} pdi={performedEvaluation.pdiQuality} />
          </Group>
        </Tabs.Tab>
        <Tabs.Tab label={CommonConstants.pdiCompetence.title[locale]}>
          <Box p={25}>
            <PdiCompetence
              actor={EVALUATION_ACTOR.MANAGER}
              pdi={performedEvaluation.pdiCompetence}
            />
          </Box>
        </Tabs.Tab>
        <Tabs.Tab label={CommonConstants.pdiCoaching.title[locale]}>
          <Group p={25}>
            <PdiCoaching actor={EVALUATION_ACTOR.MANAGER} pdi={performedEvaluation.pdiCoaching} />
          </Group>
        </Tabs.Tab>
      </Tabs>
    </ContentBase>
  )
}

export default PdiManagementTemplate
