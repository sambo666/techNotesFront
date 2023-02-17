import React from 'react';
import { useAddNewNoteMutation } from './notesApiSlice';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave } from '@fortawesome/free-solid-svg-icons';

const NewNoteForm = ({ users }) => {
	const [addNewNote, {
		isLoading,
		isSuccess,
		isError,
		error
	}] = useAddNewNoteMutation();

	const navigate = useNavigate();

	const NOTE_TITLE_REGEX = /^[A-z0-9 ]{3,20}$/;
	const NOTE_TEXT_REGEX = /^[A-z0-9 ]{3,256}$/;

	const [noteTitle, setNoteTitle] = React.useState('');
	const [validNoteTitle, setValidNoteTitle] = React.useState(false);
	const [noteText, setNoteText] = React.useState('');
	const [validNoteText, setValidNoteText] = React.useState(false);
	const [userId, setUserId] = React.useState(users[0].id);
	const [completed, setCompleted] = React.useState(false);

	React.useEffect(() => {
		setValidNoteTitle(NOTE_TITLE_REGEX.test(noteTitle));
	}, [noteTitle])

	React.useEffect(() => {
		setValidNoteText(NOTE_TEXT_REGEX.test(noteText));
	}, [noteText])

	React.useEffect(() => {
		if (isSuccess) {
			setNoteTitle('');
			setNoteText('');
			setCompleted(false);
			navigate('/dash/notes')
		}
	}, [isSuccess, navigate]);

	const options = users.map(user => {
		return (
			<option key={user.id} value={user.id}>{user.username}</option>
		)
	});

	const onNoteTitleChanged = e => setNoteTitle(e.target.value);
	const onNoteTextChanged = e => setNoteText(e.target.value);

	const onCompletedChanged = () => setCompleted(prev => !prev);

	const canSave = [userId, validNoteTitle, validNoteText].every(Boolean) && !isLoading;

	const onUserIdChanged = (e) => setUserId(e.target.value);

	const onSaveNoteClicked = async (e) => {
		e.preventDefault();
		if (canSave) {
			const user = users.find(user => user.id === userId);
			await addNewNote({ userid: userId, username: user.username, title: noteTitle, text: noteText });
		}
	}

	const errClass = isError ? "errmsg" : "offscreen";
	const validNoteTitleClass = !validNoteTitle ? 'form__input--incomplete' : '';
	const validNoteTextClass = !validNoteText ? 'form__input--incomplete' : '';

	const content = (
		<>
				<p className={errClass}>{error?.data?.message}</p>

				<form className="form" onSubmit={onSaveNoteClicked}>
					<div className="form__title-row">
						<h2>New Note</h2>
						<div className="form__action-buttons">
							<button
								className="icon-button"
								title="Save"
								disabled={!canSave}
							>
								<FontAwesomeIcon icon={faSave} />
							</button>
						</div>
					</div>
					<label className="form__label" htmlFor="notetitle">
						Note Title: <span className="nowrap">[3-20 letters, digits]</span></label>
					<input
						className={`form__input ${validNoteTitleClass}`}
						id="notetitle"
						name="notetitle"
						type="text"
						autoComplete="off"
						value={noteTitle}
						onChange={onNoteTitleChanged}
					/>

					<label className="form__label" htmlFor="notetext">
						Note Text: <span className="nowrap">[3-256 letters, digits]</span></label>
					<textarea
						className={`form__input ${validNoteTextClass}`}
						id="notetext"
						name="notetext"
						type="text"
						autoComplete="off"
						value={noteText}
						onChange={onNoteTextChanged}
					/>

					<label className="form__label" htmlFor="users">
						ASSIGNED TO:</label>
					<select
						id="users"
						name="users"
						className={`form__select`}
						multiple={false}
						value={userId}
						onChange={onUserIdChanged}
					>
						{options}
					</select>

				</form>
		</>
	)

	return content
}

export default NewNoteForm