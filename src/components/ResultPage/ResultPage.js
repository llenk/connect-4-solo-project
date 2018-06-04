import React, { Component } from 'react';
import { connect } from 'react-redux';

import { USER_ACTIONS } from '../../redux/actions/userActions';
import { triggerLogout } from '../../redux/actions/loginActions';

import { Grid, Button } from '@material-ui/core';

const mapStateToProps = state => ({
    user: state.user,
});

class ResultPage extends Component {
    componentDidMount() {
        this.props.dispatch({ type: USER_ACTIONS.FETCH_USER });
    }

    componentDidUpdate() {
        if (!this.props.user.isLoading && this.props.user.userName === null) {
            this.props.history.push('');
        }
    }

    logout = () => {
        this.props.dispatch(triggerLogout());
        // this.props.history.push('home');
    }

    render() {
        let content = null;

        if (this.props.user.userName) {
            content = (
                <div>
                    <Grid container>
                        <Grid item xs={11}>
                        </Grid>
                        <Grid item xs={1}>
                            <Button
                                onClick={this.logout}
                            >
                                Log Out
                            </Button>
                        </Grid>
                    </Grid>
                    <Grid container>
                        <Grid item xs={7}>

                        </Grid>
                        <Grid item xs={5}>
                        </Grid>
                    </Grid>
                </div>
            );
        }

        return (
            <div>
                {content}
            </div>
        );
    }
}

// this allows us to use <App /> in index.js
export default connect(mapStateToProps)(ResultPage);

