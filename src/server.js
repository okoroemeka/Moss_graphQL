import { ApolloServer } from 'apollo-server'
import { loadTypeSchema } from './utils/schema'
import { merge } from 'lodash'
import config from './config'
import { connect } from './db'
import product from './types/product/product.resolvers'
import coupon from './types/coupon/coupon.resolvers'
import user from './types/user/user.resolvers'

const types = ['product', 'coupon', 'user']

export const start = async () => {
  const rootSchema = `
    type Cat{
      owner: Owner
      name: String!
      age: Int!
    }
    type Owner{
      name: String!
      age: Int!
      cat: Cat!
    }
    type Query{
      cat(name: String): Cat!
      owner(name: String!): Owner!
    }
    schema {
      query: Query
    }
  `
  const schemaTypes = await Promise.all(types.map(loadTypeSchema))

  const server = new ApolloServer({
    typeDefs: [rootSchema],
    resolvers: {
      Query: {
        cat(_, args) {
          return {}
        },
        owner(_, args) {
          return {}
        }
      },
      Cat: {
        name() {
          return 'emeka'
        },
        age() {
          return 94
        },
        owner() {
          return {}
        }
      },
      Owner: {
        name() {
          return 'meks'
        },
        age() {
          return 34
        },
        cat() {
          return {}
        }
      }
    },
    context({ req }) {
      // use the authenticate function from utils to auth req, its Async!
      return { user: null }
    }
  })

  await connect(config.dbUrl)
  const { url } = await server.listen({ port: config.port })

  console.log(`GQL server ready at ${url}`)
}
