import { AuthModule, SequelizeConfigService } from '@island.is/auth-api-lib'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { SequelizeModule } from '@nestjs/sequelize'
import { ClientsModule } from './modules/clients/clients.module'
import { GrantsModule } from './modules/grants/grants.module'
import { ResourcesModule } from './modules/resources/resources.module'
import { UsersModule } from './modules/users/users.module'

@Module({
  imports: [
    AuthModule.register({
      audience: '@identityserver.api',
      issuer: 'https://identity-server.dev01.devland.is', // TODO: process.env.issuer -- needs to be configured locally
      jwksUri:
        'https://identity-server.dev01.devland.is/.well-known/openid-configuration/jwks',
    }),
    SequelizeModule.forRootAsync({
      useClass: SequelizeConfigService,
    }),
    UsersModule,
    ClientsModule,
    ResourcesModule,
    GrantsModule,
    ConfigModule.forRoot({
      envFilePath: ['.env', '.env.secret'],
    }),
  ],
})
export class AppModule {}
