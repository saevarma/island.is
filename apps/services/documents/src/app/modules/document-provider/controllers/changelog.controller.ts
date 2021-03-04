import { Controller, Get, Param } from '@nestjs/common'
import { ApiHeader, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { DocumentProviderService } from '../document-provider.service'
import { Changelog } from '../models/changelog.model'

@ApiTags('changelogs')
@ApiHeader({
  name: 'authorization',
  description: 'Bearer token authorization',
})
@Controller('changelogs')
export class ChangelogController {
  constructor(
    private readonly documentProviderService: DocumentProviderService,
  ) {}

  @Get('/organisations/:organisationId')
  @ApiOkResponse({ type: [Changelog] })
  async getChangelogsByOrganisationId(
    @Param('organisationId') organisationId: string,
  ): Promise<Changelog[] | null> {
    return await this.documentProviderService.getChangelogsByOrganisationId(
      organisationId,
    )
  }

  @Get('/organisations/:organisationId/entities/:entityId')
  @ApiOkResponse({ type: [Changelog] })
  async getChangelogsByOrganisationIdAndEntityId(
    @Param('organisationId') organisationId: string,
    @Param('entityId') entityId: string,
  ): Promise<Changelog[] | null> {
    return await this.documentProviderService.getChangelogsByOrganisationIdAndEntityId(
      organisationId,
      entityId,
    )
  }
}
