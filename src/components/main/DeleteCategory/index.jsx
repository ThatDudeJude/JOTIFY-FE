import React from 'react';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Modal from '@mui/material/Modal';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Box from '@mui/material/Box';
import { useMediaQuery } from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { client } from '../../../App';
import { ModalDialogStack } from '../NoteForm';
import { Delete } from '@mui/icons-material';

// Utilities

const deleteNoteCategory = async (client, token, categoryId) => {
  client.defaults.headers.common['Authorization'] = `Token ${token}`;
  return await client.delete(`/notes/note-categories/${categoryId}/`);
};

// Variants
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

export const DeleteCategory = ({
  userCategories,
  showDeleteCategoryModal,
  setShowDeleteCategoryModal,
  setCurrentCategory,
  setSelectedCategory,
}) => {
  const small = useMediaQuery('(max-width: 600px)');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [currentNoteCategory, setCurrentNoteCategory] = React.useState(
    userCategories[0]
  );
  const [confirmCategoryDelete, setConfirmCategoryDelete] =
    React.useState(false);

  const handleCategorySelect = (event) => {
    const selectedCategory = userCategories.filter(
      (category) => category.id === event.target.value
    );
    setCurrentNoteCategory(selectedCategory[0]);
  };

  const handleDeleteCategorySelection = () => {
    const categoryId = currentNoteCategory.id;
    deleteNoteCategory(client, token, categoryId)
      .then(() => {
        setShowDeleteCategoryModal(false);
        setSelectedCategory(0);
        setCurrentCategory({id: 0, name: 'All'})
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 401) {
            localStorage.setItem('token', '');
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
    <Modal
      open={showDeleteCategoryModal}
      onClose={() => setShowDeleteCategoryModal(false)}
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
        {confirmCategoryDelete ? (
          <Stack spacing={3}>
            <Typography
              variant='body1'
              sx={{ fontSize: small ? '1.2rem' : '1.5rem', color: '#ffffff' }}
            >
              Confirm delete category:{' '}
              <b style={{ fontWeight: 'bold', fontStyle: 'italic' }}>
                "{currentNoteCategory.category}"
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
                onClick={() => setConfirmCategoryDelete(false)}
                sx={{ marginRight: '15px' }}
              >
                Back
              </Button>
              <Button
                variant='warning'
                onClick={() => handleDeleteCategorySelection()}
              >
                Delete
              </Button>
            </Box>
          </Stack>
        ) : (
          <>
            {' '}
            <Typography
              id='modal-modal-title'
              variant='h4'
              sx={{
                marginBottom: '1.5rem',
                textAlign: 'center',
              }}
            >
              Delete Note Category
            </Typography>
            <Stack spacing={3} id='modal-modal-description'>
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
                    value={currentNoteCategory.id}
                    onChange={(e) => handleCategorySelect(e)}
                    sx={{
                      fontSize: small && '1.0rem',
                      height: small && '2.5rem',
                      color: '#ffffff',
                      width: '65%',
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
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'end',
                  justifyContent: 'right',
                }}
              >
                <Button
                  onClick={() => setShowDeleteCategoryModal(false)}
                  sx={{ marginRight: '15px' }}
                >
                  Cancel
                </Button>
                <Button
                  variant='warning'
                  onClick={() => setConfirmCategoryDelete(true)}
                >
                  <Delete />
                </Button>
              </Box>
            </Stack>{' '}
          </>
        )}
      </ModalDialogStack>
    </Modal>
  );
};
