import { Product } from './product.model'
import { User, roles } from '../user/user.model'
import { AuthenticationError } from 'apollo-server'
import mongoose from 'mongoose'

const productsTypeMatcher = {
  GAMING_PC: 'GamingPc',
  BIKE: 'Bike',
  DRONE: 'Drone'
}
const products = _ => {
  return Product.find({}).exec()
}
const product = (_, args, ctx, info) => {
  return Product.findById(args.id)
    .lean()
    .exec()
}
const newProduct = (_, args, ctx, info) => {
  return Product.create({ ...args.input, createdBy: ctx.user._id })
}
const updateProduct = (_, args, ctx, info) => {
  return Product.findByIdAndUpdate(args.id, args.input, { new: true })
    .lean()
    .exec()
}
const removeProduct = (_, args, ctx, info) => {
  return Product.findByIdAndRemove(args.id)
    .lean()
    .exec()
}
export default {
  Query: {
    product,
    products
  },
  Mutation: {
    newProduct,
    updateProduct,
    removeProduct
  },
  Product: {
    __resolveType(product) {},
    createdBy(product) {
      return User.findById(product.createdBy)
        .lean()
        .exec()
    }
  }
}
