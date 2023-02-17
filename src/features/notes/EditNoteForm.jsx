import React from 'react';
import { useUpdateNoteMutation, useDeleteNoteMutation } from './notesApiSlice';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import useAuth from '../../hooks/useAuth';

const EditNoteForm = ({ note, users }) => {
	const { isManager, isAdmin } = useAuth();

	const [updateNote, {
		isLoading,
		isSuccess,
		isError,
		error
	}] = useUpdateNoteMutation();

	const [deleteNote, {
		isSuccess: delNoteIsSuccess,
		isError: delNoteIsError,
		error: delNoteError
	}] = useDeleteNoteMutation();



	const navigate = useNavigate();

	const NOTE_TITLE_REGEX = /^[A-z0-9 ]{3,20}$/
	const NOTE_TEXT_REGEX = /^[A-z0-9 ]{3,256}$/

	const [noteTitle, setNoteTitle] = React.useState(note.title);
	const [validNoteTitle, setValidNoteTitle] = React.useState(false);
	const [noteText, setNoteText] = React.useState(note.text);
	const [validNoteText, setValidNoteText] = React.useState(false);
	const [userId, setUserId] = React.useState(note.user);
	const [completed, setCompleted] = React.useState(note.completed);

	React.useEffect(() => {
		setValidNoteTitle(NOTE_TITLE_REGEX.test(noteTitle));
	}, [noteTitle])

	React.useEffect(() => {
		setValidNoteText(NOTE_TEXT_REGEX.test(noteText));
	}, [noteText])

	React.useEffect(() => {
		if (isSuccess || delNoteIsSuccess) {
			setNoteTitle('');
			setNoteText('');
			setCompleted(false);
			navigate('/dash/notes');
		}
	}, [isSuccess, delNoteIsSuccess, navigate]);

	const options = users.map(user => {
		return (
				<option
						key={user.id}
						value={user.id}
				> {user.username}</option >
		)
	})

	const onNoteTitleChanged = e => setNoteTitle(e.target.value);
	const onNoteTextChanged = e => setNoteText(e.target.value);

	const onCompletedChanged = () => setCompleted(prev => !prev);

	const canSave = [validNoteTitle, validNoteText].every(Boolean) && !isLoading;

	const onUserIdChanged = (e) => setUserId(e.target.value);
	
	const onSaveNoteClicked = async (e) => {
		e.preventDefault();
		if (canSave) {
			const user = users.find(user => user.id === userId);
			await updateNote({ id: note.id, username: user.username, user: userId, title: noteTitle, text: noteText, completed });
		}
	}

	const onDeleteNoteClicked = async () => {
		await deleteNote({ id: note.id })
	}

	const created = new Date(note.createdAt).toLocaleString('en-US', { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' })
	const updated = new Date(note.updatedAt).toLocaleString('en-US', { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' })

	const errClass = isError ? "errmsg" : "offscreen";
	const validNoteTitleClass = !validNoteTitle ? 'form__input--incomplete' : '';
	const validNoteTextClass = !validNoteText ? 'form__input--incomplete' : '';

	const errContent = (error?.data?.message || delNoteError?.data?.message) ?? '';

	let deleteButton = null;
	if (isManager || isAdmin) {
		deleteButton = (
			<button
				className="icon-button"
				title="Delete"
				onClick={onDeleteNoteClicked}
			>
				<FontAwesomeIcon icon={faTrashCan} />
			</button>
		)
	}

	const content = (
		<>
				<p className={errClass}>{errContent}</p>

				<form className="form" onSubmit={onSaveNoteClicked}>
					<div className="form__title-row">
						<h2>Edit Note</h2>
						<div className="form__action-buttons">
							<button
								className="icon-button"
								title="Save"
								disabled={!canSave}
							>
								<FontAwesomeIcon icon={faSave} />
							</button>
							{deleteButton}
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
					<div className="form__row">
						<div className="form__divider">
							<label className="form__label form__checkbox-container" htmlFor="note-completion">
								WORK COMPLETED:
								<input
									className="form__checkbox"
									id="note-completion"
									name="note-completion"
									type="checkbox"
									checked={completed}
									onChange={onCompletedChanged}
								/>
							</label>

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
						</div>
						<div className="form__divider">
						<p className="form__created">Created:<br />{created}</p>
						<p className="form__updated">Updated:<br />{updated}</p>
						</div>
					</div>

				</form>
		</>
	)

	return content
}

export default EditNoteForm