
module.exports = {
	Post: {
		authors: async (post, _, { loaders }) => {
			return loaders.author.loadMany([post.id]);
		}
	}
}