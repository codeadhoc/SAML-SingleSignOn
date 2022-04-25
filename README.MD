#Single SingleOn: Service Provide (SP) Client

## Pre-requisite

Ensure below tools are installed in your environment as those are mandatory to run the client app. 

#### NodeJs
```
https://nodejs.org/en/download/
```

#### Docker (incase to deploy app in container)
``` 
https://www.docker.com/get-started/
```

#### Open SSL
```
https://www.openssl.org/source/
```

## Usage
Clone the source code over https
```
git clone https://github.com/codeadhoc/SAML-SingleSignOn.git
```

#### Generate Self-Sign SSL Certificate to run the app in HTTPS mode
```
openssl req -newkey rsa:2048 -nodes -keyout {private_key_name}.key.pem -x509 -days 3650 -out {public_certi_name}.cert.pem
```

#### Configurations

Navigate to sp-pub-cert.pem and replace the string from newly generate {public_certi_name}.cert.pem and sp-pvt-key.pem string  with {private_key_name}.key.pem

Navigate to App.js and update the configures as per IDP provider you're using
```
/** SAML Configurations attributes 
* callbackurl : apps url for IDP to response post authentication 
* signout: apps url for IDP to notify app post sign out 
* entrypoint: IDP url to redirect for authentication 
* entityId : Apps Id 
*/ 
const samlConfig = {
  issuer: "Client-ID", 
  entityId: "realm name/entity name", 
  callbackUrl: "https://{IP-Address}:{PORT}/login/callback", 
  signOut: "https://{IP-Address}:{PORT}/signout/callback", 
  entryPoint: "{saml 2.0 login Url}"
};
```

#### Run app in container
Build Docker Image
```
docker build -t ImageName:TagName dir
```

Run in Container
```
docker run --name <name-of-container> -p <hostport>:<containerport> -d <image-name>
```

Run locally Non-Container
```
//install dependency module
npm install 

//ensure it app root directory
node app.js
```

- Go the browser and navigate to home page : http://localhost:8080/
- Navigate to login page: http://localhost:8080/login app will redirect to IDP for login process and post login it will redirect to call back url with SAML assertion token with claims container user details

## License
[MIT](https://choosealicense.com/licenses/mit/)
