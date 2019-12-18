import React, { Component } from 'react';
import { Button } from 'reactstrap';
import 'react-toastify/dist/ReactToastify.css';
import '../index.css';
import { checkIfLogged } from '../common.js'

class SupervizorHome extends Component {

    constructor(props) {
        super(props);

        checkIfLogged().then(resp => {
            if (!resp) {
                this.props.history.push('/')
            }
        });
        this.logOut=this.logOut.bind(this);
        this.show=this.show.bind(this);
       
        console.log(localStorage.getItem('data') );
       
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
        window.close("/supervizor");
        window.open("/adminData","_self");
       
    }
    userPage() {
        window.close("/supervizor");
        window.open("/userData","_self");
    }
    destinationPage() {
        window.close("/supervizor");
        window.open("/destinationData","_self");
    }
    aircompanyPage() {
        window.close("/supervizor");
        window.open("/aircompanyData","_self");
    }

    airplanePage() {
        window.close("/supervizor");
        window.open("/airplaneData","_self");
    }
    flightPage() {
        window.close("/supervizor");
        window.open("/flightData","_self");
    }

 
    show() {
        var x = document.getElementById("prikaz1");
        console.log(localStorage.getItem('data') );
       var uloga=localStorage.getItem('data');
        if (uloga === "ADMINISTARTOR") {
          x.style.display = "";
        } else {
          x.style.display = "none";        
        }    localStorage.removeItem('data');
        localStorage.setItem('data', uloga);
      } 

    render() {
        return (
            <div id="prikaz1" style={{ backgroundColor: '#923cb5', backgroundImage: `linear-gradient(150deg, #000000 30%, #923cb5 70%)`, margin: 0, height: '100vh', width: '100%', justifyContent: 'center', alignItems: 'center', }}>
                <h1  style={{ color: "#923cb5" }}>Supervizor Page</h1><br></br>
                <Button className="buttonSupervizor" onClick={() => this.userPage()} >Rad sa korisnicima </Button><br></br><br></br>
                <Button className="buttonSupervizor" onClick={() => this.adminPage()} >Rad sa administartorom </Button><br></br><br></br>
                <Button className="buttonSupervizor" onClick={() => this.destinationPage()} >Rad sa destinacijama </Button><br></br><br></br>
                <Button className="buttonSupervizor" onClick={() => this.flightPage()} >Rad sa letovima </Button><br></br><br></br>
                <Button className="buttonSupervizor" onClick={() => this.aircompanyPage()} >Rad sa aviokompanijama </Button><br></br><br></br>
                
                <Button className="buttonSupervizor" id="prikaz" onLoad={() => this.show()} onClick={() => this.airplanePage()} >Rad sa avionima </Button><br></br><br></br>
            
                <Button style={{ backgroundColor: "#42378F", left: "50px", width: "200px",position: "absolute" }} onClick={this.logOut}>Log out</Button>
                           
                     
                   
               
            </div>
        );
    };
}

export default SupervizorHome;