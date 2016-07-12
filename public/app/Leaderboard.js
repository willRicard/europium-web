import React, { Component } from 'react';

class Leaderboard extends Component {
    render() {
        var results = this.props.results;
        results = results.sort((a,b) => {
            return (a.ring > b.ring) ? 1 : -1;
        });
        var results = this.props.results.map((r,i) => {
            return (
                <tr key={i}>
                    <td>{r.name}</td>
                    <td>{8 - r.ring}</td>
                </tr>
            );
        });
        return (
            <div className="leaderboard">
                <h2>Leaderboard</h2>
                <table className="table table-striped table-border">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Score</th>
                            </tr>
                    </thead>
                    <tbody>
                        {results}
                    </tbody>
                </table>
            </div>
        );
    }
}

export default Leaderboard;
