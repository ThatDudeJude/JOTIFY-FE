import { createTheme } from '@mui/material/styles';
// import { purple } from '@mui/material/colors';

// "MuiInputBase-input MuiOutlinedInput-input MuiInputBase-inputMultiline css-1sqnrkk-MuiInputBase-input-MuiOutlinedInput-input"
// MuiInputBase-root MuiOutlinedInput-root MuiInputBase-colorPrimary MuiInputBase-fullWidth MuiInputBase-formControl MuiInputBase-multiline css-wga5ul-MuiInputBase-root-MuiOutlinedInput-root

export const JotifyTextFieldOutlinedStyling = {"&.jotify-authtextfield": {
    "& fieldset": {
        border: "2px solid #ffc000",
        borderRadius: '2px',                            
    }, 
    "& .MuiInputBase-input:hover + fieldset": {
        border: "3px solid #ffc000",
        borderRadius: '3px',                            
    }, 
    '& .MuiInputBase-input:focus': {
        fontSize: '1.1rem',                        
        fontWeight: '600'
    },
    '& .MuiInputBase-input:focus + fieldset': {
        border: "4px solid #ffc000",
        borderRadius: '5px',                            
        fontWeight: '700'
    },
    '& input': {
        color: '#ffffff'
    },
    '& textarea': {
        color: '#ffffff'
    },
    '& textarea.MuiInputBase-inputMultiline:hover ~ fieldset' : {
        border: "3px solid #ffc000",
        borderRadius: '3px',        
    },
    '& textarea.MuiInputBase-inputMultiline:focus ~ fieldset' : {
        border: "4px solid #ffc000",
        borderRadius: '5px',                            
        fontWeight: '700'
    },
    '& textarea.MuiInputBase-inputMultiline:focus': {
        fontSize: '1.2rem',                        
        fontWeight: '700'
    },
    '& label': {
        color: '#ffc000'
    },          
    '& .Mui-error .MuiInputBase-input:focus + fieldset': {                            
        border: "4px solid #d32f2f",
        borderRadius: '5px',                            
        fontWeight: '700'
    },              
    '& .MuiInputBase-input.Mui-disabled': {
        border: '1px solid #ff7100',
    },   
    // '& .Mui-disabled ~ label': {
    //     color: 'rgba(255,113,0, 0.7)'                                                        

    // },
    '& .MuiInputBase-input.Mui-disabled:hover + fieldset': {
        border: '1px solid #ff7100',
        borderRadius: '1px',                            
    }

}}

const JotifyTextFieldStandardStyling = {'&.jotifyModalInput' :{ 
    "& .MuiInputBase-input": {
        border: 'none',
        borderBottom: "2px solid #ffc000",       
    }, 
    "& .MuiInputBase-input:hover + fieldset": {
        borderBottom: "3px solid #ffc000",        
    }, 
    '& .MuiInputBase-input:focus + fieldset': {
        borderBottom: "4px solid #ffc000",        
        fontWeight: '700'
    },
    '& input': {
        color: '#ffffff'
    },
    '& textarea': {
        color: '#ffffff'
    },
    '& label': {
        color: '#ffc000'
    },          
    '& .Mui-error .MuiInputBase-input:focus + fieldset': {                            
        borderBottom: "4px solid #d32f2f",        
        fontWeight: '700'
    },              
    '& .MuiInputBase-input.Mui-disabled': {
        borderBottom: '1px solid #ff7100',
    },   
    // '& .Mui-disabled ~ label': {
    //     color: 'rgba(255,113,0, 0.7)'                                                        

    // },
    '& .MuiInputBase-input.Mui-disabled:hover + fieldset': {
        borderBottom: '1px solid #ff7100',        
    }
}}

export const jotifyTheme = createTheme({
    components: {

        MuiButton: {
            styleOverrides: {
                root: ({ ownerState}) => ({
                    ...(ownerState.variant === 'contained' &&
                    ownerState.color === 'primary' && {
                    fontSize: '1rem !important','&:hover': {backgroundColor: '#ffd966'}, '&.Mui-disabled' :{ backgroundColor: '#a07902'}
                    }), ...(ownerState.variant === 'outlined' &&
                    ownerState.color === 'secondary' && {
                    fontSize: '1rem !important', backgroundColor: '#ffd966', '&:hover': {backgroundColor: '#000000', color: '#ffd966'}
                    }), ...(ownerState.variant === 'text' && {color: '#ffffff', '&:hover': {color: '#ffd966'}, '&.Mui-disabled' :{ color: '#a07902'}}), 
                    ...(ownerState.variant === 'warning' && {color: '#ffffff', backgroundColor: '#d10000', '&:hover': {backgroundColor: '#ff0000'}})
                })
            }, 
            variants: [
                {
                    props: { variant: 'transparent'},
                    style: {
                        color: '#ffc000',
                        border: '2px solid #ffc000',
                        backgroundColor: 'transparent',
                        '&:hover': {
                            color: 'black',
                            backgroundColor: '#ffc000',
                        }
                    }
                },
                {
                    props: { variant: 'jotify-black'},
                    style: {
                        color: '#ffc000',
                        fontSize: '1.5rem',
                        border: '2px solid #ffc000',
                        borderRadius: '5px',
                        backgroundColor: '#000000',
                        '&:hover': {
                            color: 'black',
                            backgroundColor: '#ffc000',
                        }
                    }
                },
                {
                    props: { variant: 'jotify-header-drawer'},
                    style: {
                        color: '#000000',
                        border: '0',
                        borderRadius: '0px 0px 10px 10px',
                        backgroundColor: 'rgba(255, 118, 43, 1)',
                        '&:hover': {
                            color: '#000000',
                            backgroundColor: 'rgba(255, 118, 43, 1)',
                        }
                    }
                },
                {
                    props: { variant: 'jotify-header-button'},
                    style: {
                        color: '#ffc000',
                        border: '2px solid #000000',                        
                        backgroundColor: '#000000',
                        '&:hover': {
                            color: '#000000',
                            backgroundColor: '#ffc000',
                        }
                    }
                },
            ]
        },
        MuiPaper: {
            styleOverrides: {
                root: ({ownerState}) => ({
                  ...(ownerState.variant === 'elevation'   && {
                    backgroundColor: "#ffc000", borderRadius: '5px'
                  }), 
                })
            }
        }, 
        MuiTextField: {
            styleOverrides: {
                root: ({ ownerState}) => ({
                    ...(ownerState.variant === 'outlined' && JotifyTextFieldOutlinedStyling), 
                    ...(ownerState.variant === 'standard' && JotifyTextFieldStandardStyling), 
                })
            }            
        }, 
        MuiTab : {
            styleOverrides: {
                root: {
                    '&.Mui-selected.MuiTab-textColorPrimary': {
                        color: '#000000', 
                        backgroundColor: '#ffc000', 
                        fontSize: '1.8rem',
                        borderRadius: '1rem 1rem 0 0'
                    },
                    '&.MuiTab-textColorPrimary': {
                        color: '#ffc000',
                        fontSize: '1.8rem',
                    }
                }
            }
        }, 
        MuiSelect: {
            styleOverrides : {
                root: ({ownerState}) => ({
                    ...(ownerState.variant === 'outlined' && {
                        color: '#ffc000',
                        fontSize: '1.5rem',
                        width: '200px',
                        border: '1px solid #ffc000',
                        height: 'max-content', 
                        '& .MuiSelect-icon': {
                            color: '#ffc000'
                        }
                    })
                })       
            }
        }, 
        MuiToggleButton: {
            styleOverrides: {
                root: {
                   //maxWidth: '200px', 
                   //minWidth: 'min-content',                  
                   color: '#ffffff',                   
                   '&:hover': {
                    backgroundColor: '#ffc000',
                    color: '#000000'
                   }, 
                   '&.Mui-selected': {
                     backgroundColor: '#ffc000aa',
                     color: '#eeeeee'
                   },
                   '&.Mui-selected:hover': {
                    backgroundColor: '#ffc000',
                    color: '#ffffff'
                   }, 
                   '&.Mui-disabled': {
                    color: '#999999',
                    backgroundColor: '#111111'
                }
                },                 
            }
        }, 
        MuiToggleButtonGroup: {
            styleOverrides: {
                root: {
                    border: 'solid 1px #ffc000',
                    borderRadius: '10px', 
                    
                }
            }
        }, 
        MuiTableCell: {
            styleOverrides: {
                root: ({ownerState}) => ({
                    ...(ownerState.scope === 'header' && {
                        backgroundColor: '#ffc000',                        
                        fontSize: '1.2rem'
                    }), 
                    borderBottom: '2px solid #ffc000', 
                    ...(ownerState.scope === 'row' && {
                       color: '#ffffff',
                       minWidth: 'min-content'
                    }),
                    ...(ownerState.scope === 'inner-header' && {
                        color: '#ffc000',                        
                        fontSize: '1.2rem'
                    })
                }) 
            }
        }, 
        MuiCheckbox: {
            styleOverrides : {
                root: {
                    color: '#ffc000'
                }
            }
        }
    },
    palette: {
        primary: {
            main: '#ffc000'
        },
        secondary: {
            main: '#000000'
        }
    }
})