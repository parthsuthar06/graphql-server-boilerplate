const { AuthorModel } = require("../models");

module.exports = () => {
	return {
		findOneAuthor() {
			return new AuthorModel().findOne();
		},

		async findAuthor(post) {
			return await new AuthorModel().find(post);
		},

		findAuthorById({ id: postid }) {
			return new AuthorModel().findById({ id: postid });
		}
	}
};
