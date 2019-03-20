const { gql } = require('apollo-server-express');

const Query = gql`
# Gives Author Info.
type Author {
  id: Int
  name: String @deprecated
  firstname: String
  lastname: String
  posts: [Post]
}

# Gives Posts Info.
type Post {
  id: String
  title: String
  text: String
  authors: [Author]
}

# Root Query For Author and its Post.
type Query { 
  author: Author
  posts: [Post] 
} 
`;

module.exports = () => [Query];