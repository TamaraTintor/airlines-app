import React, { Component } from 'react';
import '../index.css';

class ComboDestinacije extends Component {
    constructor(props) {
        super(props)

        this.state = { destination: [] }

        this.loadDataAktivni = this.loadDataAktivni.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    loadData() {
        fetch('/api/destination')
            .then(response => response.json())
            .then(data => { console.log(this.state); this.setState({ destination: data }) });
    }

    loadDataAktivni() {
        fetch('/api/destination/aktivni')
            .then(response => response.json())
            .then(data => { console.log(this.state); this.setState({ destination: data }) });
    }

    handleChange = (event) => {
        let selectedValue = event.target.value;
        this.props.onSelectChange(selectedValue);
    }

    componentDidMount() {
        this.loadDataAktivni();
    }

    render() {
        let destination = [...this.state.destination];
        return (
            <select name="customSearch" className="combo" onChange={this.handleChange}>
                <option value="" selected disabled hidden>Izaberite destinaciju: </option>
                {
                    destination.map((destinacije) =>                   
                        <option key={destinacije.id} value={destinacije.name}>
                            {destinacije.name}
                        </option>
                    )}
            </select>
        )
    }
}

export default ComboDestinacije;