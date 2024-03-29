import gql from 'graphql-tag';

export const CREATE_POST_MUTATION = gql`
	mutation createPost($body: String!) {
		createPost(body: $body) {
			id
			body 
			createdAt 
			username
			likes{
				id username createdAt
			}
			likeCount
			comments{
				id body username createdAt
			}
			commentCount
		}
	}

`

export const FETCH_POSTS_QUERY = gql `
{
	getPosts {
		id
		body
		createdAt
		username
		likeCount
		likes {
			username
		}
		commentCount
		comments {
			id
			username
			createdAt
			body
		}
	}
}
`
export const FETCH_POST_QUERY = gql `
	query($postId: ID!) {
		getPost(postId: $postId) {
			id
			body
			username
			createdAt
			likeCount
			likes{
				username
			}
			commentCount
			comments{
				id
				username
				createdAt
				body
			}
		}
	}
`

export const DELETE_POST_MUTATION = gql`
	mutation deletePost($postId: ID!) {
		deletePost(postId: $postId)
	}
`
export const DELETE_COMMENT_MUTATION = gql`
	mutation deleteComment($postId: ID!, $commentId: ID!) {
		deleteComment(postId: $postId, commentId: $commentId) {
			id
			comments{
				id 
				username 
				createdAt 
				body
			}
			commentCount
		}
	}

`
export const CREATE_COMMENT_MUTATION = gql`
	mutation($postId: ID!, $body: String!) {
		createComment(postId: $postId, body: $body) {
			id
			comments{
				id
				body
				createdAt
				username
			}
			commentCount
		}
	}
`