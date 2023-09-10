import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { DataSource } from 'typeorm';
import { User } from '../src/user/entities';
import { setTimeout } from "timers/promises"
import { Movie } from '../src/movie/entities';
import { Stat } from '../src/stat/entities';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );

    await app.init();
    
    await setTimeout(10000)
  }, 20000);

  afterAll(async () => {
    const dataSource = app.get(DataSource);
    await dataSource.createQueryBuilder().delete().from(User).execute();
    await app.close();
  });

  let access_token;
  let refresh_token;
  describe('/auth', () => {
    
    it('/signup', async () => {
      const res = await request(app.getHttpServer()).post('/auth/signup').send({
        email: 'test@gmail.com',
        password: 'test',
        name: 'testName',
      });
      expect(res.statusCode).toEqual(201);
      expect(res.body).toEqual({
        access_token: expect.any(String),
        refresh_token: expect.any(String),
      });
    });
    it('/signin', async () => {
      const res = await request(app.getHttpServer()).post('/auth/signin').send({
        email: 'test@gmail.com',
        password: 'test',
      });
      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual({
        access_token: expect.any(String),
        refresh_token: expect.any(String),
      });
      access_token = res.body.access_token;
      refresh_token = res.body.refresh_token;
    });
    it('/tokens', async () => {
      const res = await request(app.getHttpServer())
        .get('/auth/tokens')
        .set('Authorization', `Bearer ${refresh_token}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual({
        access_token: expect.any(String),
        refresh_token: expect.any(String),
      });
      access_token = res.body.access_token;
      refresh_token = res.body.refresh_token;
    });
  });

  describe('/movie', () => {
    it('/, without auth', async () => {
      const res = await request(app.getHttpServer()).get('/movie');
      expect(res.statusCode).toEqual(200);
      expect(res.body).toBeInstanceOf(Array);
      expect(res.body).toHaveLength(8)
    });
    it('/, with auth', async () => {
      const res = await request(app.getHttpServer()).get('/movie').set('Authorization', `Bearer ${access_token}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toBeInstanceOf(Array<Movie>);
      expect(res.body).toHaveLength(8)
    });
  });

  describe('/user', () => {
    it('/stat', async () => {
      const res = await request(app.getHttpServer()).get('/user/stat').set('Authorization', `Bearer ${access_token}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body.suggestions).toBeGreaterThan(0);
    })
  })
});
