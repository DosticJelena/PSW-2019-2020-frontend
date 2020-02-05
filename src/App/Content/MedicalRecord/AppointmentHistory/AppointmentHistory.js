import React from 'react';
import "react-table/react-table.css";
import Header from '../../Header/Header';
import Footer from '../../Footer/Footer';
import ReactTable from "react-table";
import './AppointmentHistory.css'

class AppointmentHistory extends React.Component{
    render(){

        const columns=[{
            Header:'Type',
            accessor: 'type'
        },{
            Header:'Date',
            accessor: 'date'
        },{
            Header:'Time',
            accessor: 'time'
        },{
            Header:'Ordination',
            accessor: 'ordination'
        }]

        const data=[{
            type:'Pregled',
            date:'28.10.2019.',
            time:'15.00',
            ordination:'1'
        },{
            type:'Operacija',
            date:'22.10.2019.',
            time:'19.00',
            ordination:'2'
        },{
            type:'Vakcinisanje',
            date:'14.3.2019.',
            time:'07.00',
            ordination:'3'
            
        }]


        return(
           
            <div className="AppointmentHistory">
                <Header/>
                    <div className='appointment-history rtable'>
                     <div className="appointment-history-title">History of appointments</div>
              
                    <ReactTable 
                        data={data}
                        columns={columns}
                        defaultPageSize = {10}
                        pageSizeOptions = {[5, 10, 15]}
                    />

                </div>
                <Footer/>
            </div>
        );
    }

}

export default AppointmentHistory;