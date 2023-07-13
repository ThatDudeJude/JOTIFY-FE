import React from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import { styled as muistyled } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { motion } from 'framer-motion';
import { ArrowBack, Delete, AddCircle } from '@mui/icons-material';
import apiClient from '../../../apiClient';
import { deleteNote } from '../Note';

// Styles

const NoteFormBoxContainer = muistyled(Box)(({ theme }) => ({
  color: '#ffffff',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  alignItems: 'center',
  position: 'relative',
  //   backgroundColor: '#000000',
  height: '100vh',
  width: '100vw',
  overflowY: 'hidden',
  padding: '0px 32px',
}));

const NoteFormGrid = muistyled(Grid)(({ theme }) => ({
  border: '5px solid #ffc000',
  borderRadius: '15px',
  padding: '0px 0px',
  margin: '5vh 0',
  alignContent: 'flex-start',
  //   backgroundColor: '#0d192c',
}));

const NoteFormActionBox = muistyled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'start',
  backgroundColor: '#ffc000',
  height: 'fit-content',
}));

export const ModalDialogStack = muistyled(Stack)(({ theme }) => ({
  position: 'absolute',
  backgroundColor: '#000000',
  color: '#ffc000',
  border: '3px solid #ffc000',
  borderRadius: '10px',
  boxShadow: '0px 0px 15px #ffc000cc',
}));
// Utilities

const defaultFormNoteValues = {
  value: '',
  error: false,
  message: 'Please fill out this field',
};

const createNote = async (client, token, noteData) => {
  apiClient.defaults.headers.common['Authorization'] = `Token ${token}`;

  return await apiClient.post(`/notes/create/new/`, noteData);
};

const updateNote = async (client, token, noteId, noteCategoryId, noteData) => {
  apiClient.defaults.headers.common['Authorization'] = `Token ${token}`;

  return await apiClient.put(
    noteCategoryId === 1
      ? `/notes/quick-note/update/${noteId}/`
      : `/notes/categorized-note/update/${noteId}/`,
    noteData
  );
};
// Variant
const noteFormVariant = {
  hidden: {
    y: -1000,
  },
  show: {
    y: 0,
    transition: {
      ease: 'easeIn',
      duration: 0.5,
    },
  },
  exit: {
    y: 1500,
  },
};

const viewModalVariant = {
  hidden: {
    left: '50%',
    top: '-150%',
    transform: 'translate(-50%, 0%)',
  },
  show: {
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    transition: {
      ease: 'easeIn',
      duration: 0.5,
    },
  },
};

const NoteForm = ({
  type,
  note,
  token,
  setToken,
  userCategories,
  setUserCategories,
}) => {
  const small = useMediaQuery('(max-width: 600px)');
  const mid = useMediaQuery('(max-width: 1100px)');
  const navigate = useNavigate();
  const trackNote = React.useRef({
    originalCategoryId: type === 'edit' ? note.note_category.id : 1,
    currentOperation: type,
  });
  const [noteTitle, setNoteTitle] = React.useState({
    ...defaultFormNoteValues,
    value: type === 'edit' ? note.note_title : '',
  });
  const [noteCategory, setNoteCategory] = React.useState({
    id: type === 'edit' ? note.note_category.id : 1,
    name: type === 'edit' ? note.note_category.name : 'Quick Note',
  });
  const [noteBody, setNoteBody] = React.useState({
    ...defaultFormNoteValues,
    value: type === 'edit' ? note.note_body : '',
  });

  const [formError, setFormError] = React.useState({
    error: false,
    errorMessage: '',
  });

  const [openAddCategory, setOpenAddCategory] = React.useState(false);
  const [newCategory, setNewCategory] = React.useState('');
  const [addCategoryErrorMessage, setAddCategoryErrorMessage] =
    React.useState('');
  const [hideAddCategoryButton, setHideAddCategoryButton] =
    React.useState(true);

  //   handlers
  const noteTitleHandler = (value) => {
    if (value === '') {
      setNoteTitle({
        ...noteTitle,
        value: value,
        error: true,
        message: 'Please fill out this field.',
      });
    } else if (value) {
      setNoteTitle({ ...noteTitle, value: value, error: false, message: '' });
    }
  };

  const noteBodyHandler = (value) => {
    if (value === '') {
      setNoteBody({
        ...noteBody,
        value: value,
        error: true,
        message: 'Please fill out this field.',
      });
    } else if (value) {
      setNoteBody({ ...noteBody, value: value, error: false, message: '' });
    }
  };

  const handleNoteCategorySelect = (value) => {
    const selectedCategory = userCategories.filter(
      (category) => category.id === value
    )[0];
    if (selectedCategory) {
      setNoteCategory({
        id: selectedCategory.id,
        name: selectedCategory.category,
      });
    } else {
      throw new Error('Update category failed');
    }
  };

  const handleNoteFormChange = (e) => {
    if (e.target.name === 'note_title') {
      noteTitleHandler(e.target.value);
    } else if (e.target.name === 'note_body') {
      noteBodyHandler(e.target.value);
    } else if (e.target.name === 'note_category') {
      handleNoteCategorySelect(e.target.value);
    }
  };

  const handleNoteFormSubmit = async (e) => {
    e.preventDefault();
    const noteData = {
      note_category: noteCategory.id,
      note_title: noteTitle.value,
      note_body: noteBody.value,
    };
    if (type === 'edit' && trackNote.current.originalCategoryId === 1) {
      if (noteCategory.id !== 1) {
        trackNote.current.currentOperation = 'new';
        const token = localStorage.getItem('token');
        await deleteNote(
          client,
          token,
          trackNote.current.originalCategoryId,
          note.id
        );
      } else trackNote.current.currentOperation = 'edit';
    }
    if (type === 'edit' && trackNote.current.originalCategoryId !== 1) {
      if (noteCategory.id === 1) {
        trackNote.current.currentOperation = 'new';
        const token = localStorage.getItem('token');
        await deleteNote(
          client,
          token,
          trackNote.current.originalCategoryId,
          note.id
        );
      } else trackNote.current.currentOperation = 'edit';
    }
    if (trackNote.current.currentOperation === 'edit') {
      updateNote(client, token, note.id, noteCategory.id, noteData)
        .then((response) => {
          const note = response.data;
          navigate(`/app/note/view/${note.note_category.id}/${note.id}`);
        })
        .catch((error) => {
          if (error.response) {
            if (error.response.status === 401) {
              setToken('');
              navigate('/');
            } else if (error.response.status === 400) {
              setFormError({
                ...formError,
                error: true,
                errorMessage: error.response.data.error,
              });
            }
          } else if (error.request) {
            setFormError({
              ...formError,
              error: true,
              errorMessage: 'No response received!',
            });
          } else {
            setFormError({
              ...formError,
              error: true,
              errorMessage: 'Something went wrong!',
            });
          }
        });
    } else {
      createNote(client, token, noteData)
        .then((response) => {
          const note = response.data;
          navigate(`/app/note/view/${note.note_category.id}/${note.id}`);
        })
        .catch((error) => {
          if (error.response) {
            if (error.response.status === 401) {
              setToken('');
              navigate('/');
            } else if (error.response.status === 400) {
              setFormError({
                ...formError,
                error: true,
                errorMessage: error.response.data.error,
              });
            }
          } else if (error.request) {
            setFormError({
              ...formError,
              error: true,
              errorMessage: 'No response received!',
            });
          } else {
            setFormError({
              ...formError,
              error: true,
              errorMessage: 'Something went wrong!',
            });
          }
        });
    }
  };

  const handleNewCategoryChange = (e) => {
    const newValue = e.target.value;
    const categoryExists = userCategories.some((category) =>
      new RegExp(`^${category.category}$`, 'i').test(newValue)
    );
    setNewCategory(newValue);
    // console.log(userCategories, newValue);
    if (categoryExists) {
      setHideAddCategoryButton(true);
      setAddCategoryErrorMessage(`${newValue} already exists!`);
    } else {
      if (addCategoryErrorMessage) setAddCategoryErrorMessage('');
      setHideAddCategoryButton(false);
    }
  };

  const handleNewCategoryFormSubmit = (e) => {
    e.preventDefault();
    if (newCategory)
      client
        .post(`/notes/note-categories/`, { category: newCategory })
        .then((response) => {
          const categoryData = response.data;
          setUserCategories([...userCategories, categoryData]);
          setNoteCategory({
            id: categoryData.id,
            name: categoryData.category,
          });
          setOpenAddCategory(false);
        })
        .catch((error) => {
          if (error.response && error.response.status === 400) {
            setFormError({
              ...formError,
              error: true,
              errorMessage: error.response.data.error,
            });
          } else if (error.request) {
            setFormError({
              ...formError,
              error: true,
              errorMessage: 'No response received!',
            });
          } else {
            setFormError({
              ...formError,
              error: true,
              errorMessage: 'Something went wrong!',
            });
          }
        });
  };

  return (
    <NoteFormBoxContainer>
      <NoteFormGrid
        container
        spacing={0}
        sx={{ width: small ? '95vw' : mid ? '80vw' : '55vw' }}
        variants={noteFormVariant}
        animate='show'
        initial='hidden'
        component={motion.div}
      >
        <Grid item xs={12} sx={{ padding: '0px' }}>
          <NoteFormActionBox>
            <Box>
              <IconButton
                color='secondary'
                aria-label='back'
                onClick={() => {
                  navigate(
                    type === 'edit'
                      ? `/app/note/view/${noteCategory.id}/${note.id}`
                      : '/app'
                  );
                }}
                sx={{ padding: '0px' }}
              >
                {' '}
                <ArrowBack sx={{ fontSize: '2rem' }} />{' '}
              </IconButton>
            </Box>
          </NoteFormActionBox>
        </Grid>
        <Grid item xs={12} sx={{ padding: '0px 24px 10px 24px' }}>
          <Typography
            variant={small ? 'h4' : 'h3'}
            component='h1'
            sx={{
              width: '100%',
              textAlign: 'center',
              marginTop: small ? '1rem' : '2rem',
            }}
          >
            {type === 'edit' ? 'Edit Note' : 'New Note'}
          </Typography>
        </Grid>

        <Grid item xs={12} sx={{ padding: '10px 24px 20px 24px' }}>
          <form
            action=''
            onChange={(e) => handleNoteFormChange(e)}
            onSubmit={(e) => handleNoteFormSubmit(e)}
          >
            <Stack spacing={small ? 1 : 3}>
              <Box sx={{ color: '#ffffff' }}>
                <TextField
                  fullWidth
                  multiline
                  maxRows={3}
                  name='note_title'
                  label='Note Title'
                  required
                  type='text'
                  inputProps={{ maxLength: 50 }}
                  variant='outlined'
                  className='jotify-authtextfield'
                  value={noteTitle.value}
                  error={noteTitle.error}
                  helperText={noteTitle.error && noteTitle.message}
                />
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  flexDirection: small ? 'column' : 'row',
                  alignItems: 'center',
                }}
              >
                <FormControl
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    height: 'fit-content',
                    marginBottom: small && '10px',
                  }}
                >
                  <FormLabel
                    sx={{
                      color: '#ffffff',
                      fontSize: small ? '1.0rem' : '1.5rem',
                      marginRight: '20px',
                    }}
                  >
                    Category:
                  </FormLabel>
                  {userCategories.length && (
                    <Select
                      name='note_category'
                      value={userCategories.length && noteCategory.id}
                      onChange={(e) => handleNoteCategorySelect(e.target.value)}
                      sx={{
                        fontSize: small && '1.0rem',
                        height: small && '2.5rem',
                        color: '#ffffff',
                      }}
                    >
                      {userCategories.map((category) => (
                        <MenuItem key={category.id} value={category.id}>
                          {category.category}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                </FormControl>
                <Button
                  variant='contained'
                  onClick={() => setOpenAddCategory(true)}
                  sx={{ height: 'fit-content' }}
                >
                  <AddCircle
                    sx={{
                      fontSize: '1.5rem',
                      marginRight: '8px',
                      color: '#000000',
                    }}
                  />
                  Add Category
                </Button>
              </Box>
              <Box>
                <TextField
                  fullWidth
                  multiline
                  minRows={small ? 4 : 8}
                  name='note_body'
                  label='Note Body'
                  required
                  type='text'
                  variant='outlined'
                  inputProps={{ maxLength: 100 }}
                  className='jotify-authtextfield'
                  value={noteBody.value}
                  error={noteBody.error}
                  helperText={noteBody.error && noteBody.message}
                />
              </Box>
              <Button
                variant='contained'
                type='submit'
                component='button'
                sx={{ maxWidth: '200px', alignSelf: 'center' }}
                disabled={
                  !(
                    noteTitle.value &&
                    !noteTitle.error &&
                    noteBody.value &&
                    !noteBody.error
                  )
                }
              >
                Save Note
              </Button>
              {formError.error && (
                <Typography
                  variant='p'
                  sx={{
                    color: 'red',
                    fontSize: '1rem',
                    marginTop: '1rem',
                    marginBottom: '1rem',
                    width: '100%',
                  }}
                >
                  {formError.errorMessage}
                </Typography>
              )}
            </Stack>
          </form>
        </Grid>
      </NoteFormGrid>
      <Modal
        open={openAddCategory}
        onClose={() => setOpenAddCategory(false)}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
      >
        <ModalDialogStack
          sx={{
            width: small ? '85vw' : mid ? '65vw' : '55vw',
            padding: small ? '1rem 2rem' : '2rem 3rem',
          }}
          component={motion.div}
          variants={viewModalVariant}
          animate='show'
          initial='hidden'
        >
          <Typography
            id='modal-modal-title'
            variant='h5'
            sx={{
              color: '#ffffff',
              marginBottom: '1.5rem',
              textAlign: 'center',
            }}
          >
            Add New Category
          </Typography>
          <form
            action=''
            id='modal-modal-description'
            onSubmit={(e) => handleNewCategoryFormSubmit(e)}
          >
            <Stack spacing={2}>
              <TextField
                label='Category Name'
                className='jotifyModalInput'
                variant='standard'
                fullWidth
                inputProps={{ maxLength: 25 }}
                value={newCategory}
                onChange={(e) => handleNewCategoryChange(e)}
                error={addCategoryErrorMessage !== ''}
                helperText={
                  addCategoryErrorMessage !== '' && addCategoryErrorMessage
                }
              />
              {/* <Typography
              variant='p'
              sx={{
                color: 'red',
                fontSize: '1rem',
                marginTop: '1rem',
                marginBottom: '1rem',
                width: '100%',
              }}
            >
              {formError.errorMessage}
            </Typography> */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'end',
                  justifyContent: 'right',
                }}
              >
                <Button
                  onClick={() => setOpenAddCategory(false)}
                  sx={{ marginRight: '15px' }}
                >
                  Cancel
                </Button>
                <Button
                  disabled={hideAddCategoryButton}
                  type='submit'
                  component='button'
                >
                  Add
                </Button>
              </Box>
            </Stack>
          </form>
        </ModalDialogStack>
      </Modal>
    </NoteFormBoxContainer>
  );
};

export default NoteForm;
