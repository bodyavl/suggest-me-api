import { Column, PrimaryGeneratedColumn } from "typeorm";

export class Movie {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    title: string

    @Column()
    description: string

    @Column({enum: ['Movie', 'TV show']})
    type: string

    @Column()
    tagline: string

    @Column()
    poster: string

    @Column()
    backdrop: string

    @Column({array: true})
    genres: string[]

    @Column()
    date: Date

    @Column()
    rating: number

    @Column()
    runtime: number
}
