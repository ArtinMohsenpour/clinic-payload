'use client'
import { useRowLabel } from '@payloadcms/ui'

const ExceptionRowLabel: React.FC = () => {
  const { data, rowNumber } = useRowLabel<any>()

  const dateValue = data?.date
  const reasonValue = data?.reason

  // If both are empty, show the default label
  if (!dateValue && !reasonValue) return 'مورد جدید (New Exception)'

  let labelParts = []
  if (dateValue) {
    const date = new Date(dateValue)
    if (!isNaN(date.getTime())) {
      labelParts.push(
        date.toLocaleDateString('fa-IR', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        }),
      )
    } else {
      // If it's not a valid date but exists, just show it as string
      labelParts.push(String(dateValue))
    }
  }

  if (reasonValue) {
    labelParts.push(String(reasonValue))
  }

  return labelParts.join(' - ') || 'مورد جدید (New Exception)'
}

export default ExceptionRowLabel
