import React, {useContext, useState, useEffect} from 'react';
import {useQuery} from '@apollo/react-hooks';
import {AuthContext} from '../context/auth';
import {FETCH_POSTS_QUERY} from '../util/graphqljs';

import {Grid, Transition} from 'semantic-ui-react';

import PostCard from '../Components/PostCard';
import PostForm from '../Components/PostForm';

function Home() {
  const [posts, setPosts] = useState([]);
  const {user} = useContext(AuthContext);
  const { 
  	loading, 
  	data
  } = useQuery(FETCH_POSTS_QUERY);
 	
  useEffect(() => {
		if (data) {
			setPosts(data.getPosts);
		}
	
    }, [data]);
  
  return (
    <Grid columns={3}>
	    <Grid.Row className="page-title">
	    	<h1> Recent Posts </h1>
	    </Grid.Row>
	    <Grid.Row>
	    	{user && (
	    		<Grid.Column>
	    			<PostForm />
	    		</Grid.Column>
	    	)}

	    	{loading ? (
	    		<h1>Loading Posts...</h1>
	    	) : (
	    		<Transition.Group>
	    			{posts && posts.map(post => (
	    			<Grid.Column key={post.id} style={{marginBottom: 20}}>
	    				<PostCard post={post} />
	    			</Grid.Column>
	    			))}
	    		</Transition.Group>
	    	)}
	    </Grid.Row>
    </Grid>
  );
}

export default Home;