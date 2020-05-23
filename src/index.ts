(async () => {
  console.log("initializing config...")
  await require("@service/config").initialize()
  console.log("initializing database...")
  await require("@service/orm").connect()
  console.log("initializing koa webserver...")
  await require("@service/koa/permission").initialize()
  await require("@service/koa").initialize()
  console.log("initializing instance manager...")
  await require("@service/battlefield").initialize()
  console.log("initialization done!")
})()