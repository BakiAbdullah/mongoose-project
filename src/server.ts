import app from './app'
import config from './app/config'
import mongoose from 'mongoose'
// const mongoose = require("mongoose");

async function main() {
  try {
    await mongoose.connect(config.database_url as string)
    app.listen(config.port, () => {
      console.log(`🚀 University app listening on port ${config.port}🚀`)
    })
  } catch (error) {
    console.log(error)
  }
}

main()
