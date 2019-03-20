const { PostModel } = require("../models");

module.exports = () => {
	return {
		findPost() {
			return new PostModel().find();
		},
		findPostById({ id: authorId }) {
			return new PostModel().findById({ id: authorId });
		}
	}
};

