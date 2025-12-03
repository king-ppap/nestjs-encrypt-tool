import { Logger, Module } from '@nestjs/common';
import { fileLoader, TypedConfigModule } from 'nest-typed-config';
import { RootConfig } from './config';
import { LoggerModule } from 'nestjs-pino';

@Module({
  imports: [
    TypedConfigModule.forRoot({
      schema: RootConfig,
      load: fileLoader({
        transform: (c) => {
          new Logger('TypedConfigModule').debug(c);
          return c;
        },
      }),
    }),
    LoggerModule.forRootAsync({
      inject: [RootConfig],
      useFactory: (config: RootConfig) => {
        return {
          pinoHttp: {
            level: config.LOG_LEVEL,
            genReqId: (req) => {
              const correlationId = req.headers['x-correlation-id'];
              if (Array.isArray(correlationId)) {
                return correlationId[0];
              }
              return correlationId || '';
            },
            transport:
              process.env.NODE_ENV === 'production'
                ? undefined
                : {
                    target: 'pino-pretty',
                    options: {
                      colorize: true,
                      translateTime: 'SYS:standard',
                      ignore: 'pid,hostname',
                      singleLine: false,
                    },
                  },
          },
        };
      },
    }),
  ],
})
export class AppModule {}
