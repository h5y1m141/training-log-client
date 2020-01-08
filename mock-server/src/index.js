const cors = require('micro-cors')()
const { ApolloError, ApolloServer, gql } = require('apollo-server-micro')
const { GraphQLScalarType } = require('graphql')
const data = require('./data.json')

// Note: ユーザーの属性はOpenID Connectの仕様を参考に設定
// https://openid-foundation-japan.github.io/openid-connect-basic-1_0.ja.html
const typeDefs = gql`
  scalar Date
  scalar DateTime

  type Exercise {
    id: ID!
    user: User!
    exerciseMenus: [ExerciseMenu!]!
  }

  type ExerciseMenu {
    id: ID!
    name: String!
  }

  type User {
    id: ID!
    givenName: String!
    familyName: String!
    email: String!
  }

  type Query {
    exercise(id: ID!): Exercise!
  }
  type Mutation {
    dummy: String
  }
`
const findById = (rows, id) => rows.find(row => row.id == id)

const resolvers = {
  Query: {
    exercise: (_, { id }) => findById(data.exercises, id),
  },
  Mutation: {},
  Exercise: {
    user: item => findById(data.users, item.userId),
    exerciseMenus: item =>
      (item.exerciseMenuIds || []).map(id => findById(data.exerciseMenus, id)),
  },
  ExerciseMenu: {},
  DateTime: new GraphQLScalarType({
    name: 'DateTime',
    description: 'A date and time, represented as an ISO-8601 string',
    serialize: value => value.toISOString(),
    parseValue: value => new Date(value),
    parseLiteral: ast => new Date(ast.value),
  }),
  Date: new GraphQLScalarType({
    name: 'Date',
    description: 'A date',
    serialize: value => value.toISOString().replace(/T.*$/, ''),
    parseValue: value => new Date(value),
    parseLiteral: ast => new Date(ast.value),
  }),
}

class ApiError extends ApolloError {
  constructor(name, message, code) {
    super(message, code)

    Object.defineProperty(this, 'name', { value: name })
  }
}

const context = ({ req }) => {
  const userId = 1

  return { userId }
}

const server = new ApolloServer({
  cors: {
    origin: '*',
    credentials: true,
  },
  typeDefs,
  resolvers,
  context,
  introspection: true,
  playground: true,
})

// module.exports = server.createHandler();
module.exports = cors((req, res) => {
  if (req.method === 'OPTIONS') {
    res.end()
    return
  }
  return server.createHandler()(req, res)
})
