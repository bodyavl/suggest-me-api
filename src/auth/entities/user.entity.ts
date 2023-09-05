import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

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
}