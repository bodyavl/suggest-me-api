import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Movie {
  @PrimaryColumn()
  @ApiProperty()
  id: number;

  @Column()
  @ApiProperty()
  title: string;

  @Column()
  @ApiProperty()
  description: string;

  @Column({ enum: ['Movie', 'TV show'] })
  @ApiProperty()
  type: string;

  @Column()
  @ApiProperty()
  tagline: string;

  @Column()
  @ApiProperty()
  poster: string;

  @Column()
  @ApiProperty()
  backdrop: string;

  @Column({type: 'text', array: true})
  @ApiProperty()
  genres: string[];

  @Column('timestamptz', { nullable: true })
  @ApiProperty()
  date: Date;

  @Column('float')
  @ApiProperty()
  rating: number;

  @Column('int')
  @ApiProperty()
  runtime: number;
}
