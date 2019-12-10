import React, {useState, useContext} from 'react';
import {Form, Button} from 'semantic-ui-react';
import {AuthContext} from '../context/auth';

import {useMutation} from '@apollo/react-hooks';
import gql from 'graphql-tag';

import {useForm} from '../util/hooks';

function Login(props){
  const context = useContext(AuthContext);

  const [errors, setErrors] = useState({});
  
  const {onChange, onSubmit, values} = useForm(loginUserCallback, {
  	username: '',
  	password: ''
  });

  //function to execute login mutation, and set the userData in the global context for other uses.
  const [loginUser, {loading}] = useMutation(LOGIN_USER, {
  	update(_, {data: {login: userData}}){
      context.login(userData);
  		props.history.push('/');
  	},
  	onError(err) {
  		setErrors(err.graphQLErrors[0].extensions.exception.errors);
  	},
  	variables: values
  });

  function loginUserCallback(){
  	loginUser();
  }

  return (
    <div className="form-container">
    	<Form onSubmit={onSubmit} noValidate className={loading ? "loading" : ""}>
    		<h1>Login</h1>
    		<Form.Input 
	    		label="Username"
	    		placeholder="Username"
	    		name="username"
	    		value={values.username}
	    		onChange={onChange}
	    		error={errors.username ? true : false}
    		/>
    		<Form.Input
    			type="password" 
	    		label="Password"
	    		placeholder="Password"
	    		name="password"
	    		value={values.password}
	    		onChange={onChange}
	    		error={errors.password ? true : false}
    		/>

    		<Button type="submit" primary>
    			Login
    		</Button>
    	</Form>

    	{Object.keys(errors).length > 0 && (
    		<div className="ui error message">
	    		<ul className="list">
	    			{Object.values(errors).map(value => (
	    				<li key={value}>{value}</li>
	    			))}
	    		</ul>
    		</div>
    	)}
    </div>
  )
}

const LOGIN_USER = gql`
	mutation login(
		$username: String!
		$password: String!
	) {
		login(
			username: $username
			password: $password
		){
			id email username createdAt token
		}
	}
`

export default Login;