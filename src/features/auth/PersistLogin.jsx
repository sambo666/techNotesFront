import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useRefreshMutation } from './authApiSlice';
import usePersist from '../../hooks/usePersist';
import { useSelector } from 'react-redux';
import { selectCurrentToken } from './authSlice';

const PersistLogin = () => {

	const [persist] = usePersist();
	const token = useSelector(selectCurrentToken);
	const effectRan = React.useRef(false);

	const [trueSuccess, setTrueSuccess] = React.useState(false);

	const [refresh, {
		isUninitialized,
		isLoading,
		isSuccess,
		isError,
		error
	}] = useRefreshMutation();

	React.useEffect(() => {
		if (effectRan.current === true || process.env.NODE_ENV !== 'development') { // React 18 Strict Mode

			const verifyRefreshToken = async () => {
				console.log('verifying refresh token');
				try {
					// const response =
					await refresh();
					// const { accessToken } = response.data
					// it's all about isSuccess in mutation useRefreshMutation
					setTrueSuccess(true);
				} catch (err) {
					console.log(err);
				}
			}
			// !token happens when we refresh token, then
			// no access token and no refresh token
			// then we send cookies back and get new access token
			if (!token && persist) verifyRefreshToken();

		}

		return () => effectRan.current = true;

		// eslint-disable-next-line
	}, []);

	let content;
	if (!persist) { // persist: no
		console.log('no persist');
		content = <Outlet />;
	} else if (isLoading) { // persist: yes, token: no
		console.log('loading');
		content = <p>Loading...</p>;
	} else if (isError) { // persist: yes, token: no
		console.log('error');
		content = (
			<p className='errmsg'>
				{`${error?.data?.message} - `}
				<Link to="/login">Please login again</Link>
			</p>
		)
	} else if (isSuccess && trueSuccess) { // persist: yes, token: yes
		console.log('success');
		content = <Outlet />;
	} else if (token && isUninitialized) { // persist: yes, token: yes
		console.log('token and uninit');
		console.log(isUninitialized);
		content = <Outlet />;
	}

	return content;
}

export default PersistLogin;