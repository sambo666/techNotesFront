import React from 'react';
import { store } from '../../app/store';
import { notesApiSlice } from '../notes/notesApiSlice';
import { usersApiSlice } from '../users/usersApiSlice';
import { Outlet } from 'react-router-dom';

const Prefetch = () => {
	React.useEffect(() => {
		// prefetch vs initiate

		store.dispatch(notesApiSlice.util.prefetch('getNotes', 'notesList', { force: true }))
		store.dispatch(usersApiSlice.util.prefetch('getUsers', 'usersList', { force: true }))

		//const notes = store.dispatch(notesApiSlice.endpoints.getNotes.initiate());
		//const users = store.dispatch(usersApiSlice.endpoints.getUsers.initiate());

		// return () => {
		// 	console.log('unsubscribing');
		// 	notes.unsubscribe();
		// 	users.unsubscribe();
		// }
	}, [])

	return <Outlet />
}

export default Prefetch