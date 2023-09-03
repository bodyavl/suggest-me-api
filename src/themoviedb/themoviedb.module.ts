import { Global, Module } from '@nestjs/common';
import { ThemoviedbService } from './themoviedb.service';

@Global()
@Module({
  providers: [ThemoviedbService],
  exports: [ThemoviedbService]
})
export class ThemoviedbModule {}
