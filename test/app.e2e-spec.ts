import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { DataSource } from 'typeorm';
import { User } from '../src/user/entities';
import { setTimeout } from "timers/promises"
import { Movie } from '../src/movie/entities';

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
      access_token = res.body.access_token;
      refresh_token = res.body.refresh_token;
    });
    it('/signout', async () => {
      const res = await request(app.getHttpServer()).delete('/auth/signout').set("Authorization", `Bearer ${refresh_token}`);
      expect(res.statusCode).toEqual(200);
    });
    it('/signout with wrong token', async () => {
      const res = await request(app.getHttpServer()).delete('/auth/signout').set("Authorization", `Bearer ${refresh_token}`);
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
      expect(res.statusCode).toEqual(403);
    });
    it('/signin, with wrong email', async () => {
      const res = await request(app.getHttpServer()).post('/auth/signin').send({
        email: 'test1@gmail.com',
        password: 'test',
      });
      expect(res.statusCode).toEqual(403);
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
    let movieId
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
      movieId = res.body[0].id
    });
    it('/, with genre query', async () => {
      const genre = 'Action'
      const res = await request(app.getHttpServer()).get('/movie').query({
        genre
      });
      expect(res.statusCode).toEqual(200);
      expect(res.body).toBeInstanceOf(Array);
      expect(res.body).toHaveLength(8)
      for(let movie of res.body) {
        expect(movie.genres).toContain(genre)
      }
    });
    it('/:id', async () => {
      const res = await request(app.getHttpServer()).get(`/movie/${movieId}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toBeInstanceOf(Object);
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
