import React from 'react'

const withFormattedDecimals = ({
  formattedValue,
}: {
  formattedValue: string | undefined | null
}) => {
  if (!formattedValue) {
    return null
  }
  const regex = /(,)(\d*)/g
  const groups = regex.exec(formattedValue)

  const arrayElements = formattedValue.split(/,\d*/)
  return (
    <>
      {arrayElements.map((value: string, index: number) => {
        return (
          <>
            {value}
            {index !== arrayElements.length - 1 && (
              <WithFormattedDecimals groups={groups} />
            )}
          </>
        )
      })}
    </>
  )
}

const WithFormattedDecimals = (props: { groups: string[] | null }) => {
  const { groups } = props
  return groups && groups[1] && groups[2] ? (
    <>
      {groups[1]}
      <sup>{groups[2]}</sup>
    </>
  ) : (
    <></>
  )
}

export default withFormattedDecimals
