import React, { Component } from 'react';
import { Link } from 'react-router-dom';
//import { checkIfLogged } from '../common.js'
//import { Button } from 'reactstrap';
import '../App.css';
import '../index.css';
import Slika from '../avion2.jpg';

class Home extends Component {

    constructor(props) {
        super(props);

        this.logOut = this.logOut.bind(this);

        /*
                this.state = { authenticated: false };
                checkIfLogged().then(resp => {
                    if (resp) {
                        this.setState({ authenticated: true });
                    }
                    else {
                        this.setState({ authenticated: false });
                    }
                });*/
    }

    logOut(event) {
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
    }



    render() {
        /*  if (this.state.authenticated) {
              return (
                  <div style={{
                      backgroundColor: '#923cb5', backgroundImage: ` linear-gradient(#7732a8, pink)`,
                      margin: 0, height: '100vh', width: '100%', justifyContent: 'center', alignItems: 'center',
                  }}>
                      <h1 style={{ color: "#923cb5" }}>HomePage</h1>
                      <p style={{ color: "#923cb5" }}>There are so many great things on this page, but first... please log in:</p>
                      <ul>
                          <li><Link style={{ backgroundColor: "#923cb5" }} to="/supervizor" className="m-2 btn btn-primary">Supervizor Page</Link></li>
                      </ul>
                      <Button style={{ backgroundColor: "#42378F" }} onClick={this.logOut}>Log out</Button>
                  </div>
              );
          }
          else {*/
        return (
            <div style={{ backgroundColor: '#923cb5', backgroundImage: ` linear-gradient(#7732a8, pink)`, margin: 0, height: '100vh', width: '100%', justifyContent: 'center', alignItems: 'center', }}>
                <h1 className="naziv">Lanaco Airlines</h1>
                <h2 className="header">Dobro došli!</h2>
                <div className="slika"><img src={Slika} width="100" height="80" alt="Slika se nije ucitala." />
                </div>
                <Link  to="/login" className="buttonLogin">Login </Link>
                    
                </div >
                );
        //     }

    };

}

export default Home;