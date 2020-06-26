import { Socket } from "./Socket"
import io from "socket.io"
import { SocketPool } from "./SocketPool"

export class SocketManager extends SocketPool {

  private io: io.Server

  constructor(server: io.Server) {
    super()
    this.io = server
  }

  /**
   * adds a new connected socket
   * @param socket
   */
  connect(socket: io.Socket) {
    this.add(new Socket({
      socket,
      userId: socket.request.user.user.id,
      handleClose: socket => this.remove(socket)
    }))
  }

  /**
   * sends an update for the specified instance
   * @param id the instance id the update is for
   * @param changes changes to commit
   */
  emitInstanceUpdate(id: number, changes: [string, any][]) {
    this.io
      .to(SocketManager.getInstanceRoomName(id))
      .emit(SocketManager.INSTANCE.UPDATE, { id, changes })
  }

  static getInstanceRoomName(id: number) {
    return `${SocketManager.INSTANCE.NAMESPACE}#${id}`
  }

}

export namespace SocketManager {

  export enum INSTANCE {
    NAMESPACE = "INSTANCE",
    UPDATE = "INSTANCE#UPDATE",
    REMOVE = "INSTANCE#REMOVE",
    ADD = "INSTANCE#ADD",
    CHAT = "INSTANCE#CHAT"
  }

  export enum SELF {
    NAMESPACE = "SELF",
    PERMISSION_UPDATE = "SELF#PERMISSION_UPDATE"
  }

}