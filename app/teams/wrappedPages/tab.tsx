import React, { useEffect, useRef, useState } from 'react'
import * as microsoftTeams from "@microsoft/teams-js";
import { Avatar, Loader } from '@fluentui/react-northstar'
import { proxy, useProxy } from 'valtio';

interface Props { }

const state = proxy({
    context: {},
    ssoToken: "",
    consentRequired: false,
    consentProvided: false,
    graphAccessToken: "",
    photo: "",
    error: false
});

function tab(props: Props) {

    const stateProxy = useProxy(state);

    // const stateRef = useRef({
    //     context: {},
    //     ssoToken: "",
    //     consentRequired: false,
    //     consentProvided: false,
    //     graphAccessToken: "",
    //     photo: "",
    //     error: false
    // }),
    // setState = (state) => stateRef.current = state;

    // const state = () => stateRef.current;

    //Generic error handler ( avoids having to do async fetch in try/catch block )
    const unhandledFetchError = (err) => {
        console.error("Unhandled fetch error: ", err);
        state.error = true;
    }

    const ssoLoginSuccess = async (result) => {
        state.ssoToken = result;
        exchangeClientTokenForServerToken(result);
    }

    const ssoLoginFailure = (error) => {
        console.error("SSO failed: ", error);
        state.error = true;
    }

    useEffect(() => {
        if (!window) {
            return;
        }

        // Initialize the Microsoft Teams SDK
        microsoftTeams.initialize();

        // Get the user context from Teams and set it in the state
        microsoftTeams.getContext((context) => {
            console.log("AD Context", context, { ...state, context: context })
            state.context = context;
        });

        //Perform Azure AD single sign-on authentication
        let authTokenRequestOptions = {
            successCallback: (result) => { ssoLoginSuccess(result) }, //The result variable is the SSO token.
            failureCallback: (error) => { ssoLoginFailure(error) }
        };

        microsoftTeams.authentication.getAuthToken(authTokenRequestOptions);
    }, [])

    useEffect(() => {
        if ((state.graphAccessToken !== "")) {
            callGraphFromClient();
        }
    }, [stateProxy.graphAccessToken])



    //Exchange the SSO access token for a Graph access token
    //Learn more: https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-oauth2-on-behalf-of-flow
    const exchangeClientTokenForServerToken = async (token) => {

        let serverURL = `${process.env.REACT_APP_BASE_URL}/api/auth/getGraphAccessToken?ssoToken=${token}`;

        console.log("[BlitzTeams]: Server URL", serverURL);

        let response:any = await fetch(serverURL).catch(unhandledFetchError); //This calls getGraphAccessToken route in /api-server/app.js
        console.log("[BlitzTeams]: Server Response", response);
        let data = await response.json().catch(unhandledFetchError);

        if (!response.ok && data.error === 'consent_required') {
            //A consent_required error means it's the first time a user is logging into to the app, so they must consent to sharing their Graph data with the app.
            //They may also see this error if MFA is required.
            state.consentRequired = true; //This displays the consent required message.
            showConsentDialog(); //Proceed to show the consent dialogue.
        } else if (!response.ok) {
            //Unknown error
            console.error(data);
            state.error = true;
        } else {
            //Server side token exchange worked. Save the access_token to state, so that it can be picked up and used by the componentDidMount lifecycle method.
            state.graphAccessToken = data['access_token'];
        }
    }

    //Show a popup dialogue prompting the user to consent to the required API permissions. This opens ConsentPopup.js.
    //Learn more: https://docs.microsoft.com/en-us/microsoftteams/platform/tabs/how-to/authentication/auth-tab-aad#initiate-authentication-flow
    const showConsentDialog = () => {

        microsoftTeams.authentication.authenticate({
            url: window.location.origin + "/authStart",
            width: 600,
            height: 535,
            successCallback: (result) => { consentSuccess(result) },
            failureCallback: (reason) => { consentFailure(reason) }
        });
    }

    //Callback function for a successful authorization
    const consentSuccess = (result) => {
        //Save the Graph access token in state
        state.graphAccessToken = result
        state.consentProvided = true;
    }

    const consentFailure = (reason) => {
        console.error("Consent failed: ", reason);
        state.error = true;
    }



    // Fetch the user's profile photo from Graph using the access token retrieved either from the server 
    // or microsoftTeams.authentication.authenticate
    const callGraphFromClient = async () => {

        let upn = state.context['upn'];
        let graphPhotoEndpoint = `https://graph.microsoft.com/v1.0/users/${upn}/photo/$value`;
        let graphRequestParams = {
            method: 'GET',
            headers: {
                'Content-Type': 'image/jpg',
                "authorization": "bearer " + state.graphAccessToken
            }
        }

        let response:any = await fetch(graphPhotoEndpoint, graphRequestParams).catch(unhandledFetchError);
        if (!response.ok) {
            console.error("ERROR: ", response);
            state.error = true
        }

        let imageBlog = await response.blob().catch(unhandledFetchError); //Get image data as raw binary data

        console.log('ImageBlog', imageBlog)

        
        state.photo = URL.createObjectURL(imageBlog) //Convert binary data to an image URL and set the url in state
    }

    const currentState = stateProxy;

    let title = Object.keys(currentState.context).length > 0 ?
        'Congratulations ' + currentState.context['upn'] + '! This is your tab' : <Loader />;

    let ssoMessage = currentState.ssoToken === "" ?
        <Loader label='Performing Azure AD single sign-on authentication...' /> : null;

    let serverExchangeMessage = (currentState.ssoToken !== "") && (!currentState.consentRequired) && (currentState.photo === "") ?
        <Loader label='Exchanging SSO access token for Graph access token...' /> : null;

    let consentMessage = (currentState.consentRequired && !currentState.consentProvided) ?
        <Loader label='Consent required.' /> : null;

    let avatar = currentState.photo !== "" ?
        <Avatar image={currentState.photo} size='largest' /> : null;

    let content;
    if (currentState.error) {
        console.log("[BlitzTeams]: State ERROR", currentState)
        content = <h1>ERROR: Please ensure pop-ups are allowed for this website and retry</h1>
    } else {
        content =
            <div>
                <h1>{title}</h1>
                <h3>{ssoMessage}</h3>
                <h3>{serverExchangeMessage}</h3>
                <h3>{consentMessage}</h3>
                <h1>{avatar}</h1>
            </div>
    }

    return (
        <div>
            {content}
        </div>
    );
}

export default tab
