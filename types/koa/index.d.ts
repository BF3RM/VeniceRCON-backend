import { Instance } from "@service/battlefield/libs/Instance"
import { JsonWebToken } from "@service/koa/jwt"
import { Permission } from "@entity/Permission"
import { Battlefield } from "vu-rcon"
import { Plugin } from "@service/plugin/main/Plugin"

declare module "koa" {

  interface DefaultState {
    token?: JsonWebToken
    instance?: Instance
    permission?: Permission
    player?: Battlefield.Player
    map?: Battlefield.MapEntry
    name?: string
    plugin?: Plugin
  }

}