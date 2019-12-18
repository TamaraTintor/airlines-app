import React, { Component } from 'react';
import '../index.css';

class ComboAvioni extends Component {
    constructor(props) {
        super(props)

        this.state = { airplane: [] }

        this.loadDataAktivni = this.loadDataAktivni.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    loadData() {
        fetch('/api/airplane')
            .then(response => response.json())
            .then(data => { console.log(this.state); this.setState({ airplane: data }) });
    }

    loadDataAktivni() {
        fetch('/api/airplane/aktivni')
            .then(response => response.json())
            .then(data => { console.log(this.state); this.setState({ airplane: data }) });
    }

    handleChange = (event) => {
        let selectedValue = event.target.value;
        this.props.onSelectChange(selectedValue);
    }

    componentDidMount() {
        this.loadDataAktivni();
    }

    render() {
        let airplane = [...this.state.airplane];
        return (
            <select name="customSearch" className="combo" onChange={this.handleChange}>
                <option value="" selected disabled hidden>Izaberite avion: </option>
                {
                    airplane.map((avion) =>                   
                        <option key={avion.id} value={avion.id}>
                            {avion.brand}
                        </option>
                    )}
            </select>
        )
    }
}

export default ComboAvioni;