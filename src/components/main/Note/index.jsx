import React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import ButtonGroup from '@mui/material/ButtonGroup';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { styled as muistyled } from '@mui/material/styles';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getDate } from '../Notes';
import apiClient from '../../../apiClient';
import useMediaQuery from '@mui/material/useMediaQuery';
import { ArrowBack, Edit, Delete } from '@mui/icons-material';
import { ModalDialogStack } from '../NoteForm';
import NoteForm from '../NoteForm';
import { getAllUserCategories } from '../Notes';

// Styles

const NoteBoxContainer = muistyled(Box)(({ theme }) => ({
  color: 'white',
  display: 'flex',
  justifyContent: 'center',
  position: 'relative',
  backgroundColor: '#000000',
  height: '100vh',
  width: '100vw',
  overflowY: 'hidden',
}));

const NoteGrid = muistyled(Grid)(({ theme }) => ({
  border: '5px solid #ffc000',
  borderRadius: '15px',
  padding: '0px 0px',
  margin: '5vh 0',
  alignContent: 'flex-start',
  backgroundColor: '#0d192c',
}));

const NoteActionBox = muistyled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  backgroundColor: '#ffc000',
  height: 'fit-content',
}));

//  Utilities
const getNote = async (client, token, categoryId, noteId) => {
  client.defaults.headers.common['Authorization'] = `Token ${token}`;
  if (Number(categoryId) === 1)
    return await client.get(`/notes/quick-note/${noteId}`);
  else if (categoryId > 1)
    return await client.get(`/notes/categorized-note/${noteId}`);
};

export const deleteNote = async (client, token, categoryId, noteId) => {
  client.defaults.headers.common['Authorization'] = `Token ${token}`;
  if (Number(categoryId) === 1)
    return await client.delete(`/notes/quick-note/delete/${noteId}/`);
  else return await client.delete(`/notes/categorized-note/delete/${noteId}/`);
};

// Variants

const viewNoteVariant = {
  hidden: {
    x: -1000,
  },
  show: {
    x: 0,
    transition: {
      //   type: 'spring',
      //   dampness: '2000',
      //   stiffness: '500',
      ease: 'easeIn',
      duration: 0.5,
    },
  },
  exit: {
    x: 1000,
    transition: {
      ease: 'easeOut',
      duration: 0.5,
    },
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

const Note = ({ token, setToken }) => {
  const params = useParams();
  const navigate = useNavigate();
  const action = params.action;
  const noteId = params.id;
  const categoryId = params.category;
  const [note, setNote] = React.useState({});
  const [userCategories, setUserCategories] = React.useState([]);
  const [openDeleteNoteModal, setOpenDeleteNoteModal] = React.useState(false);
  const mid = useMediaQuery('(max-width: 1100px)');
  const small = useMediaQuery('(max-width: 600px)');

  React.useEffect(() => {
    if (categoryId >= 1) {
      getNote(apiClient, token, categoryId, noteId)
        .then((response) => {
          if (response.status === 200 && response.statusText === 'OK')
            setNote(response.data);
        })
        .catch((error) => {
          if (error.response) {
            if (error.response.status === 401) {
              setToken('');
              navigate('/');
            }
          } else if (error.request) {
            // The request was made but no response was received
            console.log(error.request);
          } else {
            // Something happened in setting up the request that triggered an Error
            console.log('Error', error.message);
          }
        });
    }
    if (action !== 'view') {
      console.log('Not iew');
      getAllUserCategories(apiClient, token)
        .then((categoriesResponse) => {
          console.log(
            'Got user categories response',
            'status',
            categoriesResponse
          );
          if (
            categoriesResponse.status === 200 &&
            categoriesResponse.statusText === 'OK'
          ) {
            const userNoteTypes = categoriesResponse.data.all_user_note_types;
            console.log('userNoteTypes', userNoteTypes);
            setUserCategories(userNoteTypes);
          }
        })
        .catch((error) => {
          if (error.response) {
            if (error.response.status === 401) {
              setToken('');
              navigate('/');
            }
          } else if (error.request) {
            // The request was made but no response was received
            console.log(error.request);
          } else {
            // Something happened in setting up the request that triggered an Error
            console.log('Error', error.message);
          }
        });
    }
  }, [action]);

  const handleDeleteNote = () => {
    deleteNote(apiClient, token, categoryId, noteId)
      .then((res) => {
        navigate('/app');
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 401) {
            setToken('');
            navigate('/');
          }
        } else if (error.request) {
          // The request was made but no response was received
          console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error', error.message);
        }
      });
  };

  return (
    <AnimatePresence>
      <NoteBoxContainer>
        {action === 'view' ? (
          note.id && (
            // <NoteBoxContainer>
            <NoteGrid
              container
              spacing={0}
              sx={{ width: small ? '95vw' : mid ? '70vw' : '55vw' }}
              variants={viewNoteVariant}
              initial='hidden'
              animate='show'
              exit={{ y: 1000 }}
              component={motion.div}
            >
              <Grid item xs={12} sx={{ padding: '0px' }}>
                <NoteActionBox>
                  <Box>
                    <IconButton
                      color='secondary'
                      aria-label='back'
                      onClick={() => navigate('/app')}
                    >
                      {' '}
                      <ArrowBack sx={{ fontSize: '2rem' }} />{' '}
                    </IconButton>
                  </Box>
                  <Box>
                    <ButtonGroup>
                      <IconButton
                        color='secondary'
                        aria-label='edit'
                        onClick={() =>
                          navigate(`/app/note/edit/${categoryId}/${noteId}`)
                        }
                        sx={{ marginRight: '25px' }}
                      >
                        {' '}
                        <Edit />{' '}
                      </IconButton>
                      <IconButton
                        color='secondary'
                        aria-label='delete'
                        onClick={() => setOpenDeleteNoteModal(true)}
                      >
                        {' '}
                        <Delete />{' '}
                      </IconButton>
                    </ButtonGroup>
                  </Box>
                </NoteActionBox>
              </Grid>
              <Grid
                item
                xs={12}
                sx={{
                  padding: '10px 32px',
                  backgroundColor: '#242e3d',
                  borderBottom: '1px dashed #43392a',
                }}
              >
                <Stack sx={{ height: 'fit-content' }}>
                  <Box sx={{ marginBottom: '1rem' }}>
                    <Typography
                      id='modal-note-title'
                      variant={small ? 'h5' : 'h4'}
                    >
                      {note.note_title}
                    </Typography>
                  </Box>
                  <Box>
                    <Stack>
                      <Typography variant='h6'>
                        Category:{' '}
                        <Typography variant='body1' component='span'>
                          {note.note_category.name}
                        </Typography>
                      </Typography>
                      <Typography variant='h6'>
                        Modified:{' '}
                        <Typography variant='body1' component='span'>
                          {getDate(note)}
                        </Typography>
                      </Typography>
                    </Stack>
                  </Box>
                </Stack>
              </Grid>
              <Grid
                item
                xs={12}
                sx={{ padding: '10px 32px', paddingTop: '40px' }}
              >
                <Typography
                  id='modal-note-body'
                  variant='p'
                  sx={{
                    whiteSpace: 'pre-wrap',
                    lineHeight: small ? '1.5rem' : '2rem',
                    fontSize: '1.3rem',
                  }}
                >
                  {note.note_body}
                </Typography>
              </Grid>
            </NoteGrid>
            // </NoteBoxContainer>
          )
        ) : action === 'edit' ? (
          userCategories.length !== 0 &&
          note.id && (
            <NoteForm
              type={action}
              note={note}
              userCategories={userCategories}
              setUserCategories={setUserCategories}
              token={token}
              setToken={setToken}
            />
          )
        ) : (
          <NoteForm
            userCategories={userCategories}
            setUserCategories={setUserCategories}
            token={token}
            setToken={setToken}
          />
        )}
        <Modal
          open={openDeleteNoteModal}
          onClose={() => setOpenDeleteNoteModal(false)}
          aria-labelledby='modal-modal-title'
          aria-describedby='modal-modal-description'
        >
          <ModalDialogStack
            sx={{
              width: small ? '85vw' : '60vw',
              padding: small ? '1rem 2rem' : '2rem 3rem',
            }}
            component={motion.div}
            variants={viewModalVariant}
            initial='hidden'
            animate='show'
          >
            <Typography
              id='modal-modal-title'
              variant='h4'
              sx={{
                marginBottom: '1.5rem',
                textAlign: 'center',
              }}
            >
              Delete Note
            </Typography>
            <Stack spacing={3}>
              <Typography
                variant='body1'
                sx={{ fontSize: small ? '1rem' : '1.5rem', color: '#ffffff' }}
              >
                Delete{' '}
                <b style={{ fontWeight: 'bold', fontStyle: 'italic' }}>
                  "{note.note_title}"
                </b>{' '}
                ?
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'end',
                  justifyContent: 'right',
                }}
              >
                <Button
                  onClick={() => setOpenDeleteNoteModal(false)}
                  sx={{ marginRight: '15px' }}
                >
                  Cancel
                </Button>
                <Button variant='warning' onClick={() => handleDeleteNote()}>
                  Delete
                </Button>
              </Box>
            </Stack>
          </ModalDialogStack>
        </Modal>
      </NoteBoxContainer>
    </AnimatePresence>
  );
};

export default Note;
