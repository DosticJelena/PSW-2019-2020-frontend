import React from 'react';
import './Modal.css';
import Backdrop from '../Backdrop/Backdrop';
import Wrap from '../WrapComponent/Wrap';

const modal = (props) => (
    <Wrap>
        <Backdrop show={props.show} click={props.modalClosed} />
        <div 
            style={{
                transform: props.show ? 'translateY(0)' : 'translateY(-100vh)',
                opacity: props.show ? '1' : '0'
            }}
            className='Modal'>
            {props.children}
        </div>
    </Wrap>
);

export default modal;