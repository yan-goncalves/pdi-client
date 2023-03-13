import { Text, Textarea, TextInput, useMantineTheme } from '@mantine/core'
import ActionGroup, { ActionGroupProps } from 'components/ActionGroup'
import { CommonConstants } from 'constants/common'
import { useEvaluation } from 'contexts/EvaluationProvider'
import { useLocale } from 'contexts/LocaleProvider'
import { useEffect, useState } from 'react'

export type CommentProps = {
  value?: string
  type?: 'textarea' | 'text'
  placeholder?: string
  isDisabled: boolean
  onChange: (value?: string) => void
  hidden?: boolean
}

const Comment = ({
  value,
  type = 'textarea',
  placeholder,
  isDisabled,
  onChange,
  handleSave,
  hidden = false
}: CommentProps & Pick<ActionGroupProps, 'handleSave'>) => {
  const theme = useMantineTheme()
  const { locale } = useLocale()
  const { isSaving } = useEvaluation()
  const [currentValue, setCurrentValue] = useState<string>()
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [isFirstValue, setIsFirstValue] = useState<boolean>(false)

  useEffect(() => {
    if (value !== undefined && !isFirstValue) {
      setCurrentValue(value)
      setIsFirstValue(true)
    }
  }, [value, isFirstValue])

  const handleCommentSave = async () => {
    await handleSave()
      .then(() => {
        setCurrentValue(value)
      })
      .finally(() => {
        setIsEditing(false)
      })
  }

  const handleCommentCancel = async () => {
    if (value !== currentValue) {
      onChange(currentValue)
    }
    setIsEditing(false)
  }

  return !isDisabled ? (
    <>
      {type === 'textarea' ? (
        <Textarea
          radius={'md'}
          disabled={isSaving}
          value={value}
          placeholder={placeholder ?? CommonConstants.placeholder.comment[locale]}
          onChange={({ currentTarget: { value: newComment } }) => {
            if (!isEditing) setIsEditing(true)
            onChange(newComment)
          }}
          onFocus={() => setIsEditing(true)}
          minRows={!isEditing && !value ? 1 : 5}
          maxRows={!isEditing ? 1 : 5}
          sx={{ width: 'min(30rem, 100%)' }}
          hidden={hidden}
        />
      ) : (
        <TextInput
          radius={'md'}
          disabled={isSaving}
          value={value}
          placeholder={placeholder ?? CommonConstants.placeholder.comment[locale]}
          onChange={({ currentTarget: { value: newComment } }) => {
            if (!isEditing) setIsEditing(true)
            onChange(newComment)
          }}
          onFocus={() => setIsEditing(true)}
          sx={{ width: 'min(30rem, 100%)' }}
          hidden={hidden}
        />
      )}
      {isEditing && (
        <ActionGroup
          disabled={value === currentValue}
          handleSave={handleCommentSave}
          handleCancel={handleCommentCancel}
        />
      )}
    </>
  ) : (
    <Text
      size={!value ? 'sm' : 'lg'}
      weight={400}
      sx={{ color: !value ? theme.colors.gray[3] : 'dark' }}
      hidden={hidden}
    >
      {!value ? CommonConstants.empty.comment[locale] : <i> - {value}</i>}
    </Text>
  )
}

export default Comment
