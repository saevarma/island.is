import React from 'react'

import * as styles from './InputError.treat'

export interface InputErrorProps {
  id?: string
  errorMessage?: string
}

export const InputError = ({ id, errorMessage }: InputErrorProps) => (
  <div className={styles.errorMessage} id={id}>
    {errorMessage}
  </div>
)

export default InputError
