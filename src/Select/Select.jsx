import React from 'react';
import { Select } from '@mui/material';
import './select.css';

const select = (props) => (
    <Select
        displayEmpty={props.displayEmpty}
        multiple={props.multiple}
        value={props.value}
        variant={props.variant}
        renderValue={props.renderValue}
        inputProps={props.inputProps}
        onChange={props.changed}
        MenuProps={props.MenuProps}
        className={`select-form-control ${props.className}`}
        onClose={props.onClose}
        onOpen={props.onOpen}
        open={props.open}
    >
        {props.children}
    </Select>
);

export default React.memo(select);
