import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { checkIfLogged } from '../common.js'
import { Button} from 'reactstrap';
import '../App.css';
import '../index.css';

class Home extends Component {

    constructor(props) {
        super(props);
      //  this.logOut = this.logOut.bind(this);

        this.state = { authenticated: false };
   /*     checkIfLogged().then(resp => {
            if (resp) {
                this.setState({ authenticated: true });
            }
            else {
                this.setState({ authenticated: false });
            }
        });*/
    }

   /* logOut(event) {
        fetch('/auth/logout',
            {
                method: 'GET',
                mode: 'cors',
                headers:
                {
                    credentials: 'include'
                },
            }
        ).catch(() => this.setState({ authenticated: false }));
    }*/



    render() {
     /*   if (this.state.authenticated) {
            return (
                <div style={{ backgroundColor: '#923cb5', backgroundImage: `linear-gradient(150deg, #000000 30%, #923cb5 70%)`, margin: 0, height: '100vh', width: '100%', justifyContent: 'center', alignItems: 'center', }}>
                    <h1 style={{ color: "#923cb5" }}>HomePage</h1>
                    <p style={{ color: "#923cb5" }}>There are so many great things on this page, but first... please log in:</p>
                    <Button style={{ backgroundColor: "#42378F" }} onClick={this.logOut}>Log out</Button>
                </div>
            );
        }
        else {*/
            return (
                <div className="App-header">
                    <h1 >HomePage</h1>
                    <p >There are so many great things on this page, but first... please log in:</p>
                    <Link to="/login" className="m-2 btn btn-primary">Login</Link>
                    <button className='button'>Moje dugme</button>
                </div>
            );
     //   }

    };

}

export default Home;