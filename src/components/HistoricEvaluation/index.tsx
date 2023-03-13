import {
  Grid,
  Group,
  SegmentedControl,
  SegmentedControlItem,
  Text,
  useMantineTheme
} from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import Accordion from 'components/Accordion'
import PerformedView from 'components/Performed/View'
import { CommonConstants } from 'constants/common'
import { EvaluationConstants, EVALUATION_PERIOD } from 'constants/evaluation'
import { EVALUATION_ACTOR, EVALUATION_MODE, useEvaluation } from 'contexts/EvaluationProvider'
import { useLocale } from 'contexts/LocaleProvider'
import { useEffect, useState } from 'react'

export type HistoricEvaluationProps = {
  [EVALUATION_ACTOR.MANAGER]?: {
    midYear?: string
    endYear?: string
    rating?: number
    target?: string
  }

  [EVALUATION_ACTOR.USER]?: {
    midYear?: string
    endYear?: string
    rating?: number
  }
}

const HistoricEvaluation = (props: HistoricEvaluationProps) => {
  const theme = useMantineTheme()
  const { locale } = useLocale()
  const { appraisee, periodMode, mode } = useEvaluation()
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.md}px)`, false)
  const [segmented, setSegmented] = useState<EVALUATION_ACTOR>(EVALUATION_ACTOR.MANAGER)
  const managerName = `${appraisee.manager.info.name} ${appraisee.manager.info.lastname}`
  const userName = `${appraisee.info.name} ${appraisee.info.lastname}`
  const [segmentedList, setSegmentedList] = useState<SegmentedControlItem[]>([
    { value: EVALUATION_ACTOR.MANAGER, label: managerName }
  ])
  const [accordionLabelName] = useState({
    [EVALUATION_ACTOR.MANAGER]: managerName,
    [EVALUATION_ACTOR.USER]: userName
  })

  useEffect(() => {
    if (props?.user && !segmentedList.find((s) => s.value === EVALUATION_ACTOR.USER)) {
      setSegmentedList((state) => [...state, { value: EVALUATION_ACTOR.USER, label: userName }])
    }
  }, [props])

  if (!props?.manager && !props?.user) {
    return null
  }

  return (
    <>
      <Grid.Col mt={15} span={12} hidden={mode === EVALUATION_MODE.VIEW}>
        <Text
          size={'sm'}
          p={10}
          mb={5}
          weight={500}
          // hidden={actor === EVALUATION_ACTOR.MANAGER && periodMode === EVALUATION_PERIOD.MID}
        >
          {CommonConstants.historic[locale]}:
        </Text>
      </Grid.Col>
      <Grid.Col span={!isMobile ? 2 : 12} hidden={segmentedList.length === 1}>
        <SegmentedControl
          style={{ height: 'fit-content', width: !isMobile ? 'auto' : '100%' }}
          orientation={!isMobile ? 'vertical' : 'horizontal'}
          value={segmented}
          onChange={(value) => setSegmented(value as EVALUATION_ACTOR)}
          data={segmentedList || []}
          radius={'md'}
          styles={{
            root: {
              backgroundColor: theme.colors.gray[2],
              border: `1px solid ${theme.colors.gray[3]}`
            }
          }}
        />
      </Grid.Col>
      {!isMobile && segmentedList.length === 2 && (
        <Grid.Col span={1} sx={{ maxWidth: 20 }}></Grid.Col>
      )}
      <Grid.Col span={!isMobile && segmentedList.length > 1 ? 9 : 12}>
        <Accordion hidden={typeof props[segmented]?.midYear !== 'string'}>
          <Accordion.Item
            label={
              <Group>
                <Text>
                  <b>{accordionLabelName[segmented]}</b>
                  {` - ${EvaluationConstants.title.MID[locale]}`}
                </Text>
              </Group>
            }
          >
            <PerformedView comment={props[segmented]?.midYear} />
          </Accordion.Item>
        </Accordion>

        <Accordion
          mt={10}
          hidden={
            periodMode === EVALUATION_PERIOD.MID || typeof props[segmented]?.endYear !== 'string'
          }
        >
          <Accordion.Item
            label={
              <Group>
                <Text>
                  <b>{accordionLabelName[segmented]}</b>
                  {` - ${EvaluationConstants.title.END[locale]}`}
                </Text>
              </Group>
            }
          >
            <PerformedView
              rating={props[segmented]?.rating}
              comment={props[segmented]?.endYear}
              target={segmented === EVALUATION_ACTOR.MANAGER ? props?.manager?.target : undefined}
            />
            {/* <Overlay blur={15} /> */}
          </Accordion.Item>
        </Accordion>
      </Grid.Col>
    </>
  )
}

export default HistoricEvaluation
