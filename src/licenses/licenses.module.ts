import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { License } from './license.entity';
import { LicensesService } from './licenses.service';
import { LicensesController } from './licenses.controller';

@Module({
  imports: [TypeOrmModule.forFeature([License])],
  providers: [LicensesService],
  controllers: [LicensesController],
})
export class LicensesModule {}
