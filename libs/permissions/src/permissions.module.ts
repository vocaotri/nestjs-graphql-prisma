import { Module } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { CaslAbilityFactory } from './casl-ability.factory';

@Module({
  providers: [PermissionsService, CaslAbilityFactory],
  exports: [PermissionsService, CaslAbilityFactory],
})
export class PermissionsModule {}
