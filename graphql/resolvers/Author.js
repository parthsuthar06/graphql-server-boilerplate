const { Post: PostController } = require("../../controllers");
const { ApolloError } = require('apollo-server')

module.exports = {
	Author: {
		posts: async (author, args, { UUID }, error) => {
			try {
				// throw ('author post err!')
				return await PostController().findPostById(author)
			} catch (e) {
				throw new ApolloError(e, null, { UUID })
			}
		}
	}
}