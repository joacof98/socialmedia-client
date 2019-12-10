import React, {useContext, useState} from 'react';
import {useQuery, useMutation} from '@apollo/react-hooks';
import moment from 'moment';
import {Grid, Button, Card, Label, Icon, Image, Form} from 'semantic-ui-react';

import LikeButton from '../Components/LikeButton';
import DeleteButton from '../Components/DeleteButton';

import {AuthContext} from '../context/auth';
import {FETCH_POST_QUERY} from '../util/graphqljs';
import {CREATE_COMMENT_MUTATION} from '../util/graphqljs';

function SinglePost(props) {
	const postId = props.match.params.postId; //From url
	const {user} = useContext(AuthContext);
	const [comment, setComment] = useState('');

	const {data} = useQuery(FETCH_POST_QUERY, {
		variables: {
			postId
		}
	});

	const [submitComment] = useMutation(CREATE_COMMENT_MUTATION, {
		update(){
			setComment('');
		},
		variables: {
			postId,
			body: comment
		}
	});

	function deletePostCallback() {
		props.history.push("/");
	}

	let postMarkup;
	if(!data) {
		postMarkup = <p> Loading post... </p>
	} else {
		const {id, body, createdAt, username, comments, likes, likeCount, commentCount} = data.getPost;
	
		postMarkup = (
			<Grid>
				<Grid.Row>
					<Grid.Column width={2}>
						<Image
						floated='right'
		          		size='small'
		          		src='https://react.semantic-ui.com/images/avatar/large/elliot.jpg'
						/>
					</Grid.Column>

					<Grid.Column width={10}>
						<Card fluid>
							<Card.Content>
								<Card.Header> {username} </Card.Header>
								<Card.Meta> {moment(createdAt).fromNow()} </Card.Meta>
								<Card.Description> {body} </Card.Description>
							</Card.Content>
							<hr/>
							<Card.Content extra>
								<LikeButton user={user} post={{id, likeCount, likes}} />
								<Button
									as="div"
									labelPosition="right"
									onClick={() => console.log("comment")}
								>
									<Button basic color="blue">
										<Icon name="comments" />
									</Button>
									<Label basic color="blue" pointing="left">
										{commentCount}
									</Label>
								</Button>

								{user && user.username === username && (
									<DeleteButton postId={id} callback={deletePostCallback} />
								)}	
							</Card.Content>
						</Card>

						{user && (
							<Card fluid>
								<Card.Content>
									<p>Post a comment</p>
									<Form>
										<div className="ui action input fluid">
											<input 
												type="text" 
												placeholder="Comment..." 
												name="comment" 
												value={comment} 
												onChange={e => setComment(e.target.value)} 
											/>
											<button 
												type="submit" 
												className="ui button teal" 
												disabled={comment.trim() === ''}
												onClick={submitComment}
											>
												Submit
											</button>
										</div>
									</Form>
								</Card.Content>
							</Card>
						)}	

						{comments.map(comment => (
							<Card fluid key={comment.id}>
								<Card.Content>
									{user && user.username === comment.username && (
										<DeleteButton postId={id} commentId={comment.id} />
									)}
									<Card.Header> {comment.username} </Card.Header>
									<Card.Meta> {moment(comment.createdAt).fromNow()} </Card.Meta>
									<Card.Description> {comment.body} </Card.Description>
								</Card.Content>
							</Card>
						))}
					</Grid.Column>
				</Grid.Row>
			</Grid>
		)
	}

	return postMarkup;
}

export default SinglePost;