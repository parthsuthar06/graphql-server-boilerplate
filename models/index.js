/**
 * model is reponsible for crud operation only
 * for 3rd party api call create services 
 * folder, inherit that class for models.
 */
module.exports = {
	AuthorModel: require("./Author"),
	PostModel: require("./Post")
};
