import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Entities } from '@/shared/entities';

import { RepositoryProviders } from './repository.provider';

const imports = [TypeOrmModule.forFeature(Entities)];

@Module({
  imports: imports,
  providers: RepositoryProviders,
  exports: [...imports, ...RepositoryProviders],
})
export class RepositoryModule {}
