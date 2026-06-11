import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHelloTesteRoute(): string {
    return 'Hello World!';
  }
}
