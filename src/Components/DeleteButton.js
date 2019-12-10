import React, {useState} from 'react';
import {useMutation} from '@apollo/react-hooks';

import {Button, Icon, Confirm, Popup} from 'semantic-ui-react';
import {DELETE_POST_MUTATION} from '../util/graphqljs';
import {FETCH_POSTS_QUERY} from '../util/graphqljs';
import {DELETE_COMMENT_MUTATION} from '../util/graphqljs';

function DeleteButton({postId, commentId, callback}) {
	const [confirmOpen, setConfirmOpen] = useState(false);

	const mutation = commentId ? DELETE_COMMENT_MUTATION : DELETE_POST_MUTATION;

	const [deletePostOrComment] = useMutation(mutation, {
		update(proxy){
			setConfirmOpen(false);
			if(!commentId) {
				const data = proxy.readQuery({  //just read,not exec
					query: FETCH_POSTS_QUERY
				});
				const postsUpdated = data.getPosts.filter(p => p.id !== postId);
				proxy.writeQuery({query: FETCH_POSTS_QUERY, data: {getPosts: postsUpdated}}); //What returns
			}
			if(callback) callback();
		},
		variables: {
			postId,
			commentId
		}
	})

	//Popup puede ser creado como componente y pasarle props, para modularizar y no importarlo en todos lados
	return(
		<>
		<Popup
			inverted
			content={commentId ? "Delete comment" : "Delete post"}
			trigger={
				<Button 
		    		as="div" 
		    		color="red" 
		    		onClick={() => setConfirmOpen(true)}
		    		floated="right"
		    	>
		    		<Icon name="trash" style={{margin: 0}} />
		    	</Button>
			}
		/>
    	<Confirm 
    		open={confirmOpen} 
    		onCancel={() => setConfirmOpen(false)}	
    		onConfirm={deletePostOrComment}
    	/>
    	</>
	)
}

export default DeleteButton;