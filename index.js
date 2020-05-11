import bodyParser from 'body-parser'
import cors from 'cors'
import express from 'express'
import expressGraphQL from 'express-graphql'
import mongoose from 'mongoose'
import graphQLSchema from './graphql/schema'
import graphQLResolvers from './graphql/resolvers'

require('dotenv').config()

const app = express()
const port = process.env.PORT || 5000
const path = require('path')
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@jct-cluster-14brc.mongodb.net/auth-app?retryWrites=true&w=majority`

// Middleware
app.use(
    cors(),
    bodyParser.json(),
)

app.use(
    '/graphql',
    expressGraphQL({
        graphiql: true,
        schema: graphQLSchema,
        rootValue: graphQLResolvers
    })
)

if (process.env.NODE_ENV === "production") {
    app.use(
        express.static(path.join(__dirname, "client/build")),

    )
}

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname + "/client/build/index.html"));
  });

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        app.listen(port, () => console.log(`App listening on port ${port}`))
    })
    .catch(err => {
        console.log(err)
    })