class AuthorModel {
	constructor() {}

	findOne() {
		return {
			id: 1,
			name: "Ravi Stone",
			firstname: "Ravi",
			lastname: "Stone"
		};
	}

	find(post) {
		return [
			{
				id: 1,
				name: "Glynnis Campbell",
				firstname: "Glynnis",
				lastname: "Campbell"
			},
			{
				id: 2,
				name: "John Scalzi",
				firstname: "John",
				lastname: "Scalzi"
			}
		];
	}

	findById({ id: postid }) {
		return [
			{
				id: 1,
				name: "Glynnis Campbell",
				firstname: "Glynnis",
				lastname: "Campbell"
			},
			{
				id: 2,
				name: "John Scalzi",
				firstname: "John",
				lastname: "Scalzi"
			}
		];
	}
}

module.exports = AuthorModel;
