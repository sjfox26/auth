import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import { compose } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../../actions';

class Signin extends Component {

    onSubmit = formProps => {
        this.props.signin(formProps, () => {
            this.props.history.push('/feature');
        });
    }; //by making it an arrow function, we don't have to worry about binding the contents of onSubmit

    render() {

        const { handleSubmit } = this.props; //destructuring...handleSubmit provided by redux-form

        return(
            <form onSubmit={handleSubmit(this.onSubmit)}>
                <fieldset>
                    <label>Email</label>
                    <Field
                        name="email"
                        type="text"
                        component="input"
                        autoComplete="none"
                    />
                </fieldset>
                <fieldset>
                    <label>Password</label>
                    <Field
                        name="password"
                        type="password"
                        component="input"
                        autoComplete="none"
                    />

                </fieldset>
                <div>
                    {this.props.errorMessage}
                </div>
                <button>Sign in!</button>
            </form>
        );
    }
}


function mapStateToProps (state) {
    return { errorMessage: state.auth.errorMessage };
}

export default compose (
    connect(mapStateToProps, actions),
    reduxForm({ form: 'signin' })
)(Signin);