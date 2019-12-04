import React, { Component } from 'react';
import { Button } from 'reactstrap';
import 'react-toastify/dist/ReactToastify.css';
import '../App.css';
import { checkIfLogged } from '../common.js'

class SupervizorHome extends Component {

    constructor(props) {
        super(props);

        checkIfLogged().then(resp => {
            if (!resp) {
                this.props.history.push('/')
            }
        });
   }

    logOut() {
        fetch('/auth/logout',
            {
                method: 'GET',
                mode: 'cors',
                headers:
                {
                    credentials: 'include'
                },
            }
        ).catch(() => this.props.history.push('/'));
    }

    adminPage() {
        //    (() => this.props.history.push('/'));
        window.close("/supervizor");
        window.open("/adminData");
       
    }
    userPage() {
        //    (() => this.props.history.push('/'));
        window.close("/supervizor");
        window.open("/userData");
       
    }


    render() {
        return (
            <div style={{ backgroundColor: '#923cb5', backgroundImage: `linear-gradient(150deg, #000000 30%, #923cb5 70%)`, margin: 0, height: '100vh', width: '100%', justifyContent: 'center', alignItems: 'center', }}>
                <h1 style={{ color: "#923cb5" }}>Supervizor Page</h1><br></br>
                <Button className="buttonSupervizor" onClick={() => this.userPage()} >Rad sa korisnicima </Button><br></br><br></br>
                <Button className="buttonSupervizor" onClick={() => this.adminPage()} >Rad sa administartorom </Button><br></br><br></br>
                <Button className="buttonSupervizor" onClick={() => this.adminPage()} >Rad sa destinacijama </Button><br></br><br></br>
                <Button className="buttonSupervizor" onClick={() => this.adminPage()} >Rad sa letovima </Button><br></br><br></br>
                <Button className="buttonSupervizor" onClick={() => this.adminPage()} >Rad sa aviokompanijama </Button><br></br><br></br>
                <Button className="buttonSupervizor" onClick={() => this.adminPage()} >Rad sa avionima </Button><br></br><br></br>
                <Button style={{ backgroundColor: "#42378F", left: "50px", width: "200px",position: "absolute" }} onClick={this.logOut}>Log out</Button>
                           
                     
                   
               
            </div>
        );
    };
}

export default SupervizorHome