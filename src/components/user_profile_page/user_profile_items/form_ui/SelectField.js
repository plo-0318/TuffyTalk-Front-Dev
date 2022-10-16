import Select from 'react-select';
import { useState } from 'react';

import classes from './ui.module.css';

const SelectField = (props) => {
  const [selectedChanged, setSelectedChanged] = useState(false);

  let defaultSelected;

  let options = Object.entries(props.options).map((optionArr) => {
    const k = optionArr[0];
    const v = optionArr[1];

    if (v === props.user.major) {
      defaultSelected = { value: k, label: v };
    }

    return { value: k, label: v };
  });

  //TODO: sort the options

  const changeHandler = (selectedOption, action) => {
    props.onMajorChange(selectedOption.label);

    if (selectedOption.value === defaultSelected.value) {
      if (selectedChanged) {
        setSelectedChanged(false);
      }
      return;
    }

    setSelectedChanged(true);
  };

  const selectStyles = {
    container: (styles) => ({
      ...styles,
      width: '24rem',
      borderRadius: '6px',
      '@media only screen and (max-width: 600px)': {
        ...styles['@media only screen and (max-width: 600px)'],
        width: '20rem',
      },
      '@media only screen and (max-width: 500px)': {
        ...styles['@media only screen and (max-width: 500px)'],
        width: '16rem',
      },
    }),

    control: (styles, state) => ({
      ...styles,
      backgroundColor: 'rgb(250,250,250)',
      border: state.isFocused ? '1px solid #8898b5' : '1px solid #cccccc',
      boxShadow: state.isFocused ? '0px 0px 6px #8898b5' : 'none',
      '&:hover': {
        border: '1px solid #8898b5',
        boxShadow: '0px 0px 6px #8898b5',
      },
    }),

    option: (styles, state) => {
      // const { data, isDisable, isFocused, isSelected } = state;

      return {
        ...styles,
        fontSize: '1.6rem',
        '@media only screen and (max-width: 600px)': {
          ...styles['@media only screen and (max-width: 600px)'],
          fontSize: '1.4rem',
        },
        '@media only screen and (max-width: 500px)': {
          ...styles['@media only screen and (max-width: 500px)'],
          fontSize: '1.2rem',
        },
      };
    },

    singleValue: (styles, state) => {
      // const { data, isDisable, isFocused, isSelected } = state;

      return {
        ...styles,
        fontSize: '1.6rem',
        '@media only screen and (max-width: 600px)': {
          ...styles['@media only screen and (max-width: 600px)'],
          fontSize: '1.4rem',
        },
        '@media only screen and (max-width: 500px)': {
          ...styles['@media only screen and (max-width: 500px)'],
          fontSize: '1.2rem',
        },
      };
    },

    input: (styles) => {
      return {
        ...styles,
        fontSize: '1.4rem',
        color: '#555',
        '@media only screen and (max-width: 600px)': {
          ...styles['@media only screen and (max-width: 600px)'],
          fontSize: '1.2rem',
          color: '#555',
        },
      };
    },
  };

  return (
    <div className={classes['form_select-container']}>
      <label
        htmlFor={props._id}
        className={`${classes['form_label']} ${
          selectedChanged ? classes['form_label__changed'] : ''
        }`}
      >
        {props.label}
      </label>
      <Select
        id={props._id}
        options={options}
        onChange={changeHandler}
        styles={selectStyles}
        defaultValue={defaultSelected}
      />
    </div>
  );
};

export default SelectField;
