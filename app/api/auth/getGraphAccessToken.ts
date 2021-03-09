import jwt from 'jsonwebtoken'
import db from "db"

// const graphScopes = 'https://graph.microsoft.com/' + process.env.GRAPH_SCOPES;
const graphScopes = 'https://graph.microsoft.com/' + '["user.read"]';

const handleQueryError = function (err) {
    console.log("handleQueryError called: ", err);
    return new Response(JSON.stringify({
        code: 400,
        message: 'Network Error'
    }));
};

const getGraphAccessToken = async (req,res) => {

    let tenantId = (jwt as any).decode(req.query.ssoToken)['tid']; //Get the tenant ID from the decoded token
    let accessTokenEndpoint = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;

    //Create your access token query parameters
    //Learn more: https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-oauth2-on-behalf-of-flow#first-case-access-token-request-with-a-shared-secret
    let accessTokenQueryParams:any = {
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        assertion: req.query.ssoToken,
        scope: graphScopes,
        requested_token_use: "on_behalf_of",
    };

    accessTokenQueryParams = new URLSearchParams(accessTokenQueryParams).toString();

    let accessTokenReqOptions = {
        method:'POST',
        headers: {
            Accept: "application/json",
            "Content-Type": "application/x-www-form-urlencoded"},
        body: accessTokenQueryParams
    }; 

    console.log('AccessTokenEndpoint',accessTokenEndpoint)
    console.log('accessTokenQueryParams',accessTokenQueryParams)
    console.log('accessTokenQueryParams',accessTokenQueryParams)

    let response = await fetch(accessTokenEndpoint,accessTokenReqOptions).catch(handleQueryError);

    let data = await response.json();
    console.log("Response data: ",data);
    if(!response.ok) {
        if( (data.error === 'invalid_grant') || (data.error === 'interaction_required') ) {
            //This is expected if it's the user's first time running the app ( user must consent ) or the admin requires MFA
            console.log("User must consent or perform MFA. You may also encouter this error if your client ID or secret is incorrect.");
            res.status(403).json({ error: 'consent_required' }); //This error triggers the consent flow in the client.
        } else {
            //Unknown error
            console.log('Could not exchange access token for unknown reasons.');
            res.status(500).json({ error: 'Could not exchange access token' });
        }
    } else {
        try{
            //The on behalf of token exchange worked. Return the token (data object) to the client.
            const email = data.context['upn']
            console.log('Email', email)
            let user = await db.user.findFirst({ where: { email: email } })
            if (!user) {
            user  = await db.user.create({
                data: { email: email.toLowerCase(), role: "USER", name: email },
                select: { id: true, name: true, email: true, role: true },
            }) as any
            }
            res.send(data);
        }catch(e){
            res.status(500).json({ error: e });
        }
    }
};

export default getGraphAccessToken;