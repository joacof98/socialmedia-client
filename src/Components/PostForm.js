import React from 'react';
import {Button, Form} from 'semantic-ui-react';
import {useMutation} from '@apollo/react-hooks';

import {useForm} from '../util/hooks';
import {FETCH_POSTS_QUERY} from '../util/graphqljs';
import {CREATE_POST_MUTATION} from '../util/graphqljs';

function PostForm(){

	const {values, onChange, onSubmit} = useForm(createPostCallback, {
		body: ''
	});

	const [createPost, {error}] = useMutation(CREATE_POST_MUTATION, {
		variables: values,
		update(proxy, result){
			const data = proxy.readQuery({
				query: FETCH_POSTS_QUERY
			});
			const new_post = result.data.createPost;
			proxy.writeQuery({
				query: FETCH_POSTS_QUERY,
			 	data: {getPosts: [new_post,...data.getPosts]}
			});
			
			values.body = '';
		}
	})

	function createPostCallback(){
		createPost();
	}

	return (
		<>
		<Form onSubmit={onSubmit}>
			<h2> Create post </h2>
			<Form.Field>
				<Form.Input
					placeholder="Social Graph"
					name="body"
					onChange={onChange}
					value={values.body}
					error={error ? true : false}
				/>
				<Button type="submit" color="teal">
					Create
				</Button>
			</Form.Field>
		</Form>

		{error  && (
			<div classname="ui error message" style={{marginBottom: 20}}>
				<ul classname="list">
					<li>{error.graphQLErrors[0].message}</li>
				</ul>
			</div>
		)}
		</>
	)
}

export default PostForm;