import {
  ActionIcon,
  Badge,
  Card,
  Divider,
  Grid,
  Group,
  SimpleGrid,
  Slider,
  Text,
  useMantineTheme
} from '@mantine/core'
import { IconEdit, IconSearch, IconStar } from '@tabler/icons'
import ContentBase from 'components/ContentBase'
import ContentTitle from 'components/ContentHeader'
import { useStyles } from './styles'

const EvaluationListTemplate = () => {
  const theme = useMantineTheme()
  const { classes } = useStyles()

  return (
    <ContentBase>
      <ContentTitle title={'Minhas avaliações'} />
      <SimpleGrid
        pt={20}
        spacing={30}
        breakpoints={[
          {
            cols: 1,
            maxWidth: 'xs'
          },
          {
            cols: 2,
            minWidth: 'sm',
            maxWidth: 'lg'
          },
          {
            cols: 3,
            minWidth: 'lg'
          },
          {
            cols: 4,
            minWidth: 'xl'
          }
        ]}
      >
        {['2022', '2021', '2020'].map((year, index) => (
          <Card key={year} radius={'md'} shadow={'sm'} py={25} px={25}>
            <Card.Section p={20}>
              <Grid justify={'space-between'} align={'center'}>
                <Grid.Col span={2} lg={3}>
                  <Badge radius={'md'} size={'xl'}>
                    <strong>{year}</strong>
                  </Badge>
                </Grid.Col>

                <Grid.Col span={6} lg={7}>
                  <Slider
                    disabled
                    labelAlwaysOn
                    radius={'sm'}
                    value={index + Math.random() * 95}
                    label={'04/04'}
                    marks={[
                      { value: 0, label: '10/01' },
                      { value: 100, label: '30/06' }
                    ]}
                    classNames={{
                      root: classes.root,
                      dragging: classes.dragging,
                      thumb: classes.thumb,
                      track: classes.track,
                      bar: classes.bar,
                      markLabel: classes.markLabel,
                      label: classes.label
                    }}
                    thumbChildren={
                      <IconStar
                        fill={theme.colors.blue[1]}
                        color={theme.colors.blue[9]}
                      />
                    }
                  />
                </Grid.Col>
              </Grid>
            </Card.Section>
            <Divider
              mb={10}
              mt={30}
              style={{ borderTopColor: theme.colors.gray[1] }}
            />
            <Card.Section p={20}>
              <Group mb={10} style={{ justifyContent: 'space-between' }}>
                <Text style={{ fontWeight: 500 }}>Meio de Ano</Text>
                <Group>
                  <ActionIcon radius={'md'} variant={'light'} color={'cyan'}>
                    <IconEdit size={20} />
                  </ActionIcon>
                  <ActionIcon radius={'md'} variant={'light'} color={'violet'}>
                    <IconSearch size={20} />
                  </ActionIcon>
                </Group>
              </Group>
              <Group style={{ justifyContent: 'space-between' }}>
                <Text style={{ fontWeight: 500 }}>Fechamento de ano</Text>
                <Group>
                  <ActionIcon radius={'md'} variant={'light'} color={'cyan'}>
                    <IconEdit size={20} />
                  </ActionIcon>
                  <ActionIcon radius={'md'} variant={'light'} color={'violet'}>
                    <IconSearch size={20} />
                  </ActionIcon>
                </Group>
              </Group>
            </Card.Section>
          </Card>
        ))}
      </SimpleGrid>
    </ContentBase>
  )
}

export default EvaluationListTemplate
