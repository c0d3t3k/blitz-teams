import * as microsoftTeams from "@microsoft/teams-js";
import crypto from 'crypto';
import { useEffect } from "react";

interface Props { }

function AuthStart(props: Props) {
    useEffect(() => {
        if(!window){
            return;
        }

        // Initialize the Microsoft Teams SDK
        microsoftTeams.initialize();

        // Get the user context in order to extract the tenant ID
        microsoftTeams.getContext((context) => {

            let tenant = context['tid']; //Tenant ID of the logged in user
            // let client_id = process.env.REACT_APP_AZURE_APP_REGISTRATION_ID; //Client ID of the Azure AD app registration ( may be from different tenant for multitenant apps)
            let client_id = process.env.CLIENT_ID;

            //Form a query for the Azure implicit grant authorization flow
            //https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-oauth2-implicit-grant-flow      
            let queryParams: any = {
                tenant: `${tenant}`,
                client_id: `${client_id}`,
                response_type: "token", //token_id in other samples is only needed if using open ID
                scope: "https://graph.microsoft.com/User.Read",
                redirect_uri: window.location.origin + "/authEnd",
                nonce: btoa((Math.random() * 1000000).toString())
            }

            console.log("RedirectURL", window.location.origin + "/authEnd");

            let url = `https://login.microsoftonline.com/${tenant}/oauth2/v2.0/authorize?`;
            queryParams = (new URLSearchParams(queryParams)).toString();
            let authorizeEndpoint = url + queryParams;

            //Redirect to the Azure authorization endpoint. When that flow completes, the user will be directed to auth-end
            //Go to ClosePopup.js
            window.location.assign(authorizeEndpoint);

        });

    });


    return (
        <div>
            <h1>Redirecting to consent page...</h1>
        </div>
    );

}

export default AuthStart
