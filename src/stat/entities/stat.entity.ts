import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Stat {
    @PrimaryGeneratedColumn()
    id: string
    
    @Column()
    movies: number

    @Column()
    tv_shows: number

    @Column()
    suggestions: number

    @Column()
    man_suggestions: number
}
