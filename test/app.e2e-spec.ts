import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { DataSource } from 'typeorm';
import { User } from '../src/user/entities';
import { setTimeout } from 'timers/promises';
import { Movie } from '../src/movie/entities';
import { useContainer } from 'class-validator';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    useContainer(app.select(AppModule), { fallbackOnErrors: true });

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );

    await app.init();

    await setTimeout(15000);
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
      access_token = res.body.access_token;
      refresh_token = res.body.refresh_token;
    });
    it('/signup, with existing email', async () => {
      const res = await request(app.getHttpServer()).post('/auth/signup').send({
        email: 'test@gmail.com',
        password: 'test',
        name: 'testName',
      });
      expect(res.statusCode).toEqual(400);
    });
    it('/signout', async () => {
      const res = await request(app.getHttpServer())
        .delete('/auth/signout')
        .set('Authorization', `Bearer ${refresh_token}`);
      expect(res.statusCode).toEqual(200);
    });
    it('/signout, with wrong token', async () => {
      const res = await request(app.getHttpServer())
        .delete('/auth/signout')
        .set('Authorization', `Bearer ${refresh_token}`);
      expect(res.statusCode).toEqual(401);
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
    it('/signin, with wrong password', async () => {
      const res = await request(app.getHttpServer()).post('/auth/signin').send({
        email: 'test@gmail.com',
        password: 'test1',
      });
      expect(res.statusCode).toEqual(400);
    });
    it('/signin, with wrong email', async () => {
      const res = await request(app.getHttpServer()).post('/auth/signin').send({
        email: 'test1@gmail.com',
        password: 'test',
      });
      expect(res.statusCode).toEqual(400);
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
    it('/tokens, with wrong token', async () => {
      const res = await request(app.getHttpServer())
        .get('/auth/tokens')
        .set('Authorization', `Bearer wrong_token`);
      expect(res.statusCode).toEqual(401);
    });
  });

  describe('/movie', () => {
    let movieId;
    let man_suggestions;
    it('/', async () => {
      const res = await request(app.getHttpServer()).get('/movie');
      expect(res.statusCode).toEqual(200);
      expect(res.body).toBeInstanceOf(Array);
      expect(res.body).toHaveLength(8);
    });
    it('/, with genre query', async () => {
      const genre = 'Action';
      const res = await request(app.getHttpServer()).get('/movie').query({
        genre,
      });
      expect(res.statusCode).toEqual(200);
      expect(res.body).toBeInstanceOf(Array);
      expect(res.body).toHaveLength(8);
      for (let movie of res.body) {
        expect(movie.genres).toContain(genre);
      }
    });
    it('/, with auth', async () => {
      const res = await request(app.getHttpServer())
        .get('/movie')
        .set('Authorization', `Bearer ${access_token}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toBeInstanceOf(Array<Movie>);
      expect(res.body).toHaveLength(8);
      movieId = res.body[0].id;

      const statRes = await request(app.getHttpServer())
        .get('/user/stat')
        .set('Authorization', `Bearer ${access_token}`);
      expect(statRes.statusCode).toEqual(200);
      expect(statRes.body).toBeInstanceOf(Object);
      expect(statRes.body.suggestions).toBeGreaterThan(0);
    });
    it('/ with auth and manual query', async () => {
      const res = await request(app.getHttpServer())
        .get('/movie')
        .set('Authorization', `Bearer ${access_token}`)
        .query({
          manual: true,
        });
      expect(res.statusCode).toEqual(200);
      expect(res.body).toBeInstanceOf(Array);
      expect(res.body).toHaveLength(8);

      const statRes = await request(app.getHttpServer())
        .get('/user/stat')
        .set('Authorization', `Bearer ${access_token}`);
      man_suggestions = statRes.body.man_suggestions;
      expect(statRes.statusCode).toEqual(200);
      expect(statRes.body).toBeInstanceOf(Object);
      expect(man_suggestions).toBeGreaterThan(0);
    });
    it('/ with auth, manual and genre query', async () => {
      const genre = 'Action';
      const res = await request(app.getHttpServer())
        .get('/movie')
        .set('Authorization', `Bearer ${access_token}`)
        .query({
          manual: true,
          genre,
        });
      expect(res.statusCode).toEqual(200);
      expect(res.body).toBeInstanceOf(Array);
      expect(res.body).toHaveLength(8);
      for (let movie of res.body) {
        expect(movie.genres).toContain(genre);
      }

      const statRes = await request(app.getHttpServer())
        .get('/user/stat')
        .set('Authorization', `Bearer ${access_token}`);
      expect(statRes.statusCode).toEqual(200);
      expect(statRes.body).toBeInstanceOf(Object);
      expect(statRes.body.man_suggestions).toBeGreaterThan(0);
    });
    it('/:id', async () => {
      const res = await request(app.getHttpServer()).get(`/movie/${movieId}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toBeInstanceOf(Object);
    });
  });

  describe('/user', () => {
    it('/stat', async () => {
      const res = await request(app.getHttpServer())
        .get('/user/stat')
        .set('Authorization', `Bearer ${access_token}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body.suggestions).toBeGreaterThan(0);
    });
    it('/stat, with invalid token', async () => {
      const res = await request(app.getHttpServer())
        .get('/user/stat')
        .set('Authorization', `Bearer invalid_token`);
      expect(res.statusCode).toEqual(401);
    });
  });
});
