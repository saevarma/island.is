import {
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript'

import { ApiProperty } from '@nestjs/swagger'

@Table({
  tableName: 'draft_regulation',
})
export class DraftRegulation extends Model<DraftRegulation> {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: DataType.UUIDV4,
  })
  @ApiProperty()
  id!: string

  @Column({
    type: DataType.ENUM,
    allowNull: false,
    values: ['draft', 'proposal', 'shipped'],
  })
  @ApiProperty()
  drafting_status!: 'draft' | 'proposal' | 'shipped'

  @Column({
    type: DataType.STRING,
    unique: true,
  })
  @ApiProperty()
  name?: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty()
  title?: string

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  @ApiProperty()
  text?: string

  @Column({
    type: DataType.TEXT,
  })
  @ApiProperty()
  drafting_notes?: string

  @Column({
    type: DataType.DATEONLY,
  })
  @ApiProperty()
  ideal_publish_date?: Date

  @Column({
    type: DataType.STRING,
  })
  @ApiProperty()
  ministry_id?: string

  @Column({
    type: DataType.DATEONLY,
  })
  @ApiProperty()
  signature_date?: Date

  @Column({
    type: DataType.DATEONLY,
  })
  @ApiProperty()
  effective_date?: Date

  @Column({
    type: DataType.ENUM,
    allowNull: false,
    values: ['base', 'amending'],
  })
  @ApiProperty()
  type?: 'base' | 'amending'

}
