import React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { styled as muistyled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import { motion } from 'framer-motion';
import {
  AddCircle,
  NoteAdd,
  Delete,
  PlaylistRemove,
} from '@mui/icons-material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Link, useNavigate } from 'react-router-dom';
import apiClient from '../../../apiClient';
import { DeleteCategory } from '../DeleteCategory';

// NoteAdd, AddCircle, AddCircleOutlined
// Styles

const NotesBox = muistyled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  padding: '0.5rem',
  maxHeight: `calc((${window.innerHeight}px * ${
    window.innerHeight < 741 ? 0.0021 : 0.0024
  }) * 255)`,
  width: '100%',
  overflowY: 'auto',
  overflowX: 'hidden',
  flexWrap: 'wrap',
  justifyContent: 'space-evenly',
  //   '&::-webkit-scrollbar': {
  //     display: 'none',
  //   },
}));

const NoteCard = muistyled(Card)(({ theme }) => ({
  //   backgroundColor: '#eaff6b',
  backgroundColor: '#ffaa2f',
  color: '#000000',
  minWidth: '320px',
  maxWidth: '320px',
  margin: '0.5rem',
  //   padding: '0.5rem 0rem 0rem 0rem',
  boxShadow: '0.5rem 0.5rem 0.3rem #ffc00070',
}));

const AddNoteBox = muistyled(Box)(({ theme }) => ({
  position: 'fixed',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  bottom: '30px',
  right: '20px',
  width: 'fit-content',
  height: '60px',
  padding: '0.5rem 4px',
  borderRadius: '30px',
  backgroundColor: '#2d0132',
}));

const RemoveCategoryBox = muistyled(Box)(({ theme }) => ({
  position: 'fixed',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  bottom: '30px',
  left: '20px',
  width: 'fit-content',
  height: '60px',
  padding: '0.5rem 4px',
  borderRadius: '30px',
  backgroundColor: '#2d0132',
}));
<div>Tasks</div>;
// Utilities

const getTitle = (note) => {
  const title = note.note_title.split('\n')[0];

  if (title.length > 45) return title.slice(0, 45) + '...';

  return `Title: ${title}`;
};

export const getDate = (note) => {
  return new Date(note.time_modified).toLocaleString();
};

const getSubHeading = (note) => {
  return `Category: ${note.note_category.name} \n Modified: ${getDate(note)}`;
};

const getContent = (note) => {
  let content = note.note_body.replace(/\n/g, ' ');

  if (content.length > 60) {
    return content.slice(0, 60) + '...';
  } else {
    return content;
  }
};

const getMatchingNotes = (string, notes) => {
  return notes.filter((note) => {
    return (
      note.note_title.toLowerCase().includes(string) ||
      note.note_body.toLowerCase().includes(string)
    );
  });
};

export const getAllUserCategories = async (client, token) => {
  client.defaults.headers.common['Authorization'] = `Token ${token}`;
  return await client.get('/notes/user-note-types/');
};

// Variants
const notesBoxVariant = {
  hidden: {
    opacity: 0,
    transition: {
      when: 'afterChildren',
    },
  },
  show: {
    opacity: 1,
    transition: {
      when: 'beforeChildren',
      staggerChildren: 1,
      delayChildren: 4,
    },
  },
};

const noteCardVariant = {
  hidden: {
    opacity: 0,
    x: -1500,
    y: 1000,
  },
  show: {
    x: 0,
    y: 0,
    opacity: 1,
    transition: {
      type: 'tween',
      ease: 'easeIn',
      duration: 1,
    },
  },
};

const noteCardVariantMobile = {
  hidden: {
    opacity: 0,
    x: -160,
  },
  view: {
    opacity: 1,
    x: 0,
    transition: {
      type: 'tween',
      ease: 'easeIn',
      duration: 0.9,
    },
  },
};

const Notes = ({
  allNotes,
  allCategories,
  currentCategory,
  setCurrentCategory,
  token,
  setToken,
}) => {
  const small = useMediaQuery('(max-width: 600px)');
  const navigate = useNavigate();
  const [notes, setNotes] = React.useState([]);
  const [selectedCategory, setSelectedCategory] = React.useState(
    currentCategory.id
  );
  const [userCategories, setUserCategories] = React.useState([]);
  const [hideAddNoteButton, setHideAddNoteButton] = React.useState(true);
  const [hideRemoveCategoryButton, setHideRemoveCategoryButton] =
    React.useState(true);
  const [showDeleteCategoryModal, setShowDeleteCategoryModal] =
    React.useState(false);

  React.useEffect(() => {
    setNotes(allNotes);
  }, [allNotes]);

  const searchNotes = React.useCallback(
    (searchString) => {
      searchString = searchString.toLowerCase();
      setNotes(getMatchingNotes(searchString, allNotes));
    },
    [allNotes]
  );

  const handleCategorySelect = (event) => {
    const selectedCategory = allCategories.filter(
      (category) => category.id === event.target.value
    )[0];
    if (selectedCategory) {
      setCurrentCategory({
        id: selectedCategory.id,
        name: selectedCategory.category,
      });
      setSelectedCategory(event.target.value);
    } else {
      throw new Error('Update category failed');
    }
  };

  React.useEffect(() => {
    if (notes.length > 1) {
      getAllUserCategories(apiClient, token)
        .then((categoriesResponse) => {
          const userNoteTypes = categoriesResponse.data.all_user_note_types;
          setUserCategories(userNoteTypes);
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
  }, [notes]);
  //   console.log('notes', notes);
  return (
    <>
      <Grid container spacing={0}>
        <Grid item xs={12}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: small ? 'column' : 'row',
              justifyContent: 'space-around',
              alignItems: 'center',
            }}
          >
            <FormControl>
              <TextField
                placeholder='Search Notes'
                variant='outlined'
                className='jotify-authtextfield'
                sx={{
                  borderRadius: '15px',
                  width: '300px',
                  marginBottom: small && '0.5rem',
                }}
                inputProps={{
                  sx: {
                    fontSize: small && '1.0rem',
                    height: small && '1.5rem',
                    padding: '0.5rem',
                  },
                }}
                defaultValue=''
                onChange={(e) => searchNotes(e.target.value)}
              />
            </FormControl>
            <FormControl
              sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
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
              <Select
                value={selectedCategory}
                onChange={handleCategorySelect}
                sx={{ fontSize: small && '1.0rem', height: '2.5rem' }}
              >
                {allCategories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <NotesBox
            component={motion.div}
            variants={notesBoxVariant}
            initial='hidden'
            animate='show'
            sx={{ margin: small ? '1.0rem 0rem' : '1.5rem 0rem' }}
          >
            {notes.length ? (
              notes.map((note) => {
                return (
                  <NoteCard
                    key={Number(`${note.id}${note.note_category.id}`)}
                    variants={small ? noteCardVariantMobile : noteCardVariant}
                    {...(small
                      ? { whileInView: 'view', initial: 'hidden' }
                      : {})}
                    //   whileInView={small ? 'view' : 'show'}
                    //   viewport={{ once: true }}
                    component={motion.div}
                  >
                    <CardHeader
                      title={getTitle(note)}
                      subheader={getSubHeading(note)}
                      sx={{
                        minHeight: '8rem',
                        maxHeight: '8rem',
                        alignItems: 'start',
                        paddingBottom: '0.2rem',
                        fontSize: '0.4rem',
                        backgroundColor: '#e9a81b',
                        borderBottom: '1px dotted #000000',
                        whiteSpace: 'pre-line',
                      }}
                      titleTypographyProps={{
                        sx: {
                          height: '3rem',
                          letterSpacing: '0.07rem',
                          lineHeight: '1.3rem',
                          marginBottom: '0.1rem',
                          borderBottom: '1px dotted #000000',
                        },
                        variant: 'h6',
                      }}
                    />
                    <CardContent
                      sx={{
                        height: '4rem',
                        paddingTop: '1rem',
                        paddingBottom: '1rem',
                      }}
                    >
                      <Box>
                        <Typography
                          sx={{
                            height: '100%',
                            margin: '0rem',
                            letterSpacing: '0.07rem',
                          }}
                          paragraph
                        >
                          {getContent(note)}
                          {/* Content Here */}
                        </Typography>
                      </Box>
                    </CardContent>
                    <CardActions sx={{ justifyContent: 'end' }}>
                      <Button
                        variant='transparent'
                        sx={{ color: '#000000' }}
                        component={Link}
                        to={`/app/note/view/${note.note_category.id}/${note.id}`}
                      >
                        View Note
                      </Button>
                    </CardActions>
                  </NoteCard>
                );
              })
            ) : (
              //   <p>Fuck</p>
              <Box sx={{ padding: '1rem 1.2rem' }}>
                <Stack
                  spacing={2}
                  sx={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center',
                    color: '#ffc000',
                  }}
                >
                  <Box>
                    <Typography variant='h6' component='p'>
                      No notes available.
                    </Typography>
                  </Box>
                  <Box>
                    <Button
                      variant='contained'
                      component={Link}
                      to={`/app/note/new`}
                    >
                      Add Note
                    </Button>
                  </Box>
                </Stack>
              </Box>
            )}
          </NotesBox>
        </Grid>
      </Grid>
      {notes && (
        <AddNoteBox
          onMouseEnter={() => setHideAddNoteButton(false)}
          onMouseLeave={() => setHideAddNoteButton(true)}
        >
          {hideAddNoteButton ? (
            <AddCircle
              sx={{ fontSize: '50px', color: '#ffc000', width: '50px' }}
            />
          ) : (
            <Button
              variant='text'
              sx={{ fontWeight: '800', margin: '0px 10px' }}
              component={Link}
              to={`/app/note/new`}
            >
              <NoteAdd
                sx={{ fontSize: '3rem', color: '#ffc000', width: '50px' }}
              />
              Add Note{' '}
            </Button>
          )}
        </AddNoteBox>
      )}
      {userCategories.length > 1 && (
        <RemoveCategoryBox
          onMouseEnter={() => setHideRemoveCategoryButton(false)}
          onMouseLeave={() => setHideRemoveCategoryButton(true)}
        >
          {hideRemoveCategoryButton ? (
            <Delete
              sx={{ fontSize: '50px', color: '#ffc000', width: '50px' }}
            />
          ) : (
            <Button
              variant='text'
              sx={{ fontWeight: '800', margin: '0px 10px' }}
              onClick={() => setShowDeleteCategoryModal(true)}
            >
              <PlaylistRemove
                sx={{ fontSize: '3rem', color: '#ffc000', width: '50px' }}
              />
              Delete Category{' '}
            </Button>
          )}
        </RemoveCategoryBox>
      )}
      {userCategories.length > 0 && (
        <DeleteCategory
          userCategories={userCategories.filter(
            (category) => category.id !== 1
          )}
          showDeleteCategoryModal={showDeleteCategoryModal}
          setShowDeleteCategoryModal={setShowDeleteCategoryModal}
          setCurrentCategory={setCurrentCategory}
          setSelectedCategory={setSelectedCategory}
        />
      )}
    </>
  );
};

export default Notes;
