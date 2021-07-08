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

import { DraftRegulation } from '../draft_regulation'

@Table({
  tableName: 'draft_author',
})
export class DraftAuthor extends Model<DraftAuthor> {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: DataType.UUIDV4,
  })
  @ApiProperty()
  id!: string

  @ForeignKey(() => DraftRegulation)
  @Column({
    type: DataType.UUID,
  })
  @ApiProperty()
  draft_id!: string

  @Column({
    type: DataType.STRING,
  })
  @ApiProperty()
  author_id!: string
}
