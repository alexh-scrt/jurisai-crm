import type { ComponentType } from 'react'
import type { ConfigFieldType } from '@/lib/config-schema'
import type { FieldControlProps } from './fields/StringField'
import { StringField } from './fields/StringField'
import { NumberField } from './fields/NumberField'
import { BooleanField } from './fields/BooleanField'
import { SelectField } from './fields/SelectField'
import { TextareaField } from './fields/TextareaField'
import { SecretField } from './fields/SecretField'
import { StringArrayField } from './fields/StringArrayField'
import { JsonField } from './fields/JsonField'
import { SliderField } from './fields/SliderField'

export const FIELD_RENDERERS: Record<ConfigFieldType, ComponentType<FieldControlProps>> = {
  'string': StringField,
  'number': NumberField,
  'boolean': BooleanField,
  'select': SelectField,
  'textarea': TextareaField,
  'secret': SecretField,
  'string-array': StringArrayField,
  'json': JsonField,
  'slider': SliderField,
}
