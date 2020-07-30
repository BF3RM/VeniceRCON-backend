import { Entity, Column, ManyToOne, MoreThan, DeepPartial } from "typeorm"
import { AbstractEntity } from "./Abstract"
import { Instance } from "./Instance"

@Entity()
export class LogMessage extends AbstractEntity<LogMessage> {

  protected entityClass = LogMessage

  @ManyToOne(
    type => Instance,
    instance => instance.logs,
    { cascade: true, onDelete: "CASCADE" }
  )
  instance!: Promise<Instance>

  @Column()
  instanceId!: number

  @Column()
  message!: string

  @Column()
  level!: string

  @Column({ default: 0 })
  source!: number

  @Column({ nullable: true })
  sourceLocation?: string

  /** creates a new instance */
  static async from(props: LogMessage.ICreate) {
    const msg = new LogMessage()
    msg.instanceId = props.instanceId
    msg.message = props.message
    msg.level = props.level
    msg.source = props.source
    msg.sourceLocation = props.sourceLocation
    return msg.save()
  }

  static getMessages(
    instanceId: number,
    filter: LogMessage.Filter = {}
  ) {
    const date = filter.from instanceof Date ? filter.from : new Date(filter.from || Date.now())
    const where: Record<string, any> = {
      created: MoreThan(date.getTime()),
      instanceId
    }
    if (typeof filter.source === "number") {
      where.source = filter.source
      if (filter.sourceLocation) where.sourceLocation = filter.sourceLocation
    }
    return this.createQueryBuilder()
      .select()
      .where(where)
      .orderBy({ created: "DESC" })
      .limit(filter.count || 100)
      .getMany()
  }

}

export namespace LogMessage {

  export interface ICreate {
    instanceId: number
    level: string
    message: string
    source: Source
    sourceLocation?: string
  }

  export interface Filter {
    count?: number,
    source?: Source,
    sourceLocation?: string
    from?: Date|number
  }

  export enum Source {
    INSTANCE = 0,
    PLUGIN = 1
  }
}