import { Column, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../../auth/entities";

@Entity()
export class Stat {
    @PrimaryGeneratedColumn()
    id: number
    
    @Column({default: 0})
    movies: number

    @Column({default: 0})
    tv_shows: number

    @Column({default: 0})
    suggestions: number

    @Column({default: 0})
    man_suggestions: number

}
