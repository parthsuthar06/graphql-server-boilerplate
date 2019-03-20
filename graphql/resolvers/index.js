const { Post: PostController } = require("../../controllers");
const { Author: AuthorController } = require("../../controllers")
const AuthorResolver = require("./Author");
const PostResolver = require("./Post");

const rootResolvers = {
	Query: {
		author: async () => await AuthorController().findOneAuthor(),
		posts: async () => await PostController().find()
	}
};
/**
 * merge Modularize resolver.
 */
const resolvers = Object.assign({}, rootResolvers, AuthorResolver, PostResolver);

module.exports = resolvers;
