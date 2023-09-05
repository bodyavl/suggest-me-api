import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Stat } from "../../stat/entities";
import { userInfo } from "os";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column({unique: true})
    email: string

    @Column()
    hash: string

    @Column()
    name: string

    @Column('text', { array: true, default: []})
    refresh_tokens: string[]

    @OneToOne(() => Stat)
    @JoinColumn()
    stat: Stat
}