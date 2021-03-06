import React, { Component } from 'react'

import propTypes from '../prop-types'
import { EMPTY_OBJECT } from '../utils'

import ArrayInput from './array-input'
import BooleanInput from './boolean-input'
import EnumInput from './enum-input'
import IntegerInput from './integer-input'
import NumberInput from './number-input'
import ObjectInput from './object-input'
import StringInput from './string-input'

import { getType } from './helpers'

// ===================================================================

const InputByType = {
  array: ArrayInput,
  boolean: BooleanInput,
  integer: IntegerInput,
  number: NumberInput,
  object: ObjectInput,
  string: StringInput
}

// ===================================================================

@propTypes({
  depth: propTypes.number,
  disabled: propTypes.bool,
  label: propTypes.any.isRequired,
  onChange: propTypes.func,
  required: propTypes.bool,
  schema: propTypes.object.isRequired,
  uiSchema: propTypes.object,
  defaultValue: propTypes.any
})
export default class GenericInput extends Component {
  get value () {
    return this.refs.input.value
  }

  set value (value) {
    this.refs.input.value = value
  }

  render () {
    const {
      schema,
      defaultValue = schema.default,
      uiSchema = EMPTY_OBJECT,
      ...opts
    } = this.props

    const props = {
      ...opts,
      defaultValue,
      schema,
      uiSchema,
      ref: 'input'
    }

    // Enum, special case.
    if (schema.enum) {
      return <EnumInput {...props} />
    }

    const type = getType(schema)
    const Input = uiSchema.widget || InputByType[type.toLowerCase()]

    if (!Input) {
      throw new Error(`Unsupported type: ${type}.`)
    }

    return <Input {...props} {...uiSchema.config} />
  }
}
