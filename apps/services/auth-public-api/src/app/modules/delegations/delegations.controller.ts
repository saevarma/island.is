import {
  DelegationsService,
  IDelegation,
  DelegationDTO,
  Delegation,
} from '@island.is/auth-api-lib'
import {
  IdsUserGuard,
  Scopes,
  ScopesGuard,
  User,
  CurrentUser,
} from '@island.is/auth-nest-tools'
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common'
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'

// @UseGuards(IdsUserGuard, ScopesGuard)
@ApiTags('delegations')
@Controller('delegations')
export class DelegationsController {
  constructor(private readonly delegationsService: DelegationsService) {}

  @Scopes('@identityserver.api/authentication')
  @Get()
  @ApiOkResponse({ isArray: true })
  async findAllTo(@CurrentUser() user: User): Promise<IDelegation[]> {
    return await this.delegationsService.findAllTo(user.nationalId)
  }

  @Post()
  @ApiCreatedResponse({ type: Delegation })
  async create(@Body() delegation: DelegationDTO): Promise<Delegation | null> {
    return await this.delegationsService.create(delegation)
  }

  @Put(':id')
  @ApiCreatedResponse({ type: Delegation })
  async update(
    @Body() delegation: DelegationDTO,
    @Param('id') id: string,
  ): Promise<Delegation | null> {
    return await this.delegationsService.update(delegation, id)
  }

  @Get('custom/findone/:id')
  @ApiOkResponse({ type: Delegation })
  async findByPk(@Param('id') id: string): Promise<Delegation | null> {
    return await this.delegationsService.findByPk(id)
  }

  @Get('custom/to')
  @ApiOkResponse({ type: [Delegation] })
  async findAllCustomTo(
    @CurrentUser() user: User,
  ): Promise<Delegation[] | null> {
    return await this.delegationsService.findAllCustomTo(user.nationalId)
  }

  @Get('custom/from')
  @ApiOkResponse({ type: [Delegation] })
  async findAllCustomFrom(
    @CurrentUser() user: User,
  ): Promise<Delegation[] | null> {
    return await this.delegationsService.findAllCustomFrom(user.nationalId)
  }
}
