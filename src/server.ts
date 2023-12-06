import app from './app'
import config from './app/config'
import mongoose from 'mongoose'
// const mongoose = require("mongoose");
import { Server } from 'http'

let server: Server

async function main() {
  try {
    await mongoose.connect(config.database_url as string)
    server = app.listen(config.port, () => {
      console.log(`🚀 University app listening on port ${config.port}🚀`)
    })
  } catch (error) {
    console.log(error)
  }
}

main()

// Asynchronous code
process.on('unhandledRejection', () => {
  console.log('❌❌ unhandledRejection is Detected, shutting down ...')
  if (server) {
    server.close(() => {
      process.exit(1)
    })
  }
  process.exit(1)
})

// Synchronous code
process.on('uncaughtException', () => {
  console.log('⚠uncaughtException⚠ is Detected !!!')
  process.exit(1)
})
