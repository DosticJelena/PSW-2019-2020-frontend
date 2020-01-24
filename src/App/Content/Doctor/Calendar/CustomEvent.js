import React from 'react';
import './DoctorCalendar.css'
import OverlayTrigger from 'react-overlay-trigger'
import {Popover} from 'reactstrap';

class CustomEvent extends React.Component {
    constructor(props){
        super(props)
    }


    render(){
      console.log(this.props);

      let popoverClickRootClose = (
        <Popover id="popover-trigger-click-root-close" style={{zIndex:10000}}>
          <strong>Holy guacamole!</strong> Check this info.
        </Popover>
      );

        return (
          <div>
            <OverlayTrigger id="help" trigger="click" rootClose container={this} placement="bottom" overlay={popoverClickRootClose}>
              <div>{this.props.event.title}</div>
            </OverlayTrigger>

          </div>
        );
    }
}

export default CustomEvent