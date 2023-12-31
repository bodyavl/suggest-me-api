import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../../user/entities";

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

    @OneToOne(() => User, {onDelete: 'CASCADE'})
    @JoinColumn()
    user: User

}
