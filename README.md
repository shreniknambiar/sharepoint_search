# How to run the completed project

## Prerequisites

To run the completed project in this folder, you need the following:

- [Node.js](https://nodejs.org) installed on your development machine. If you do not have Node.js, visit the previous link for download options. (**Note:** This tutorial was written with Node version 14.x)
- Either a personal Microsoft account with a mailbox on Outlook.com, or a Microsoft work or school account.

If you don't have a Microsoft account, there are a couple of options to get a free account:

- You can [sign up for a new personal Microsoft account](https://signup.live.com/signup?wa=wsignin1.0&rpsnv=12&ct=1454618383&rver=6.4.6456.0&wp=MBI_SSL_SHARED&wreply=https://mail.live.com/default.aspx&id=64855&cbcxt=mai&bk=1454618383&uiflavor=web&uaid=b213a65b4fdc484382b6622b3ecaa547&mkt=E-US&lc=1033&lic=1).
- You can [sign up for the Office 365 Developer Program](https://developer.microsoft.com/office/dev-program) to get a free Office 365 subscription.

## Register a web application with the Azure Active Directory admin center

1. Open a browser and navigate to the [Azure Active Directory admin center](https://aad.portal.azure.com). Login using a **personal account** (aka: Microsoft Account) or **Work or School Account**.

1. Select **Azure Active Directory** in the left-hand navigation, then select **App registrations** under **Manage**.

    ![A screenshot of the App registrations ](/tutorial/images/aad-portal-app-registrations.png)

1. Select **New registration**. On the **Register an application** page, set the values as follows.

    - Set **Name** to `Node.js Graph Tutorial`.
    - Set **Supported account types** to **Accounts in any organizational directory and personal Microsoft accounts**.
    - Under **Redirect URI**, set the first drop-down to `Web` and set the value to `http://localhost:3000/auth/callback`.

1. Choose **Register**. On the **Node.js Graph Tutorial** page, copy the value of the **Application (client) ID** and save it, you will need it in the next step.


1. Select **Certificates & secrets** under **Manage**. Select the **New client secret** button. Enter a value in **Description** and select one of the options for **Expires** and choose **Add**.


1. Copy the client secret value before you leave this page. You will need it in the next step.

    > [!IMPORTANT]
    > This client secret is never shown again, so make sure you copy it now.


## Configure the sample

1. Edit the `.env` file and make the following changes.
    1. Replace `OAUTH_APP_ID` with the **Application Id** you got from the App Registration Portal.
    1. Replace `OAUTH_APP_SECRET` with the Client sexret password you got from the App Registration Portal.
1. In your command-line interface (CLI), navigate to this directory and run the following command to install requirements by running npm install.

This is to run locally. I have configured everything in docker-compose.yml file which will be easier to run.

## Local Deployment with Docker

Make sure ports 3000, 9200 and 5601 are not running.

Port 3000 : Application server containing the graph and elasticsearch apis. 
Port 9200 : Elasticsearch will be running
Port 5601 : Kibana dashboard will be running  

Before running the below steps please upload few files with similar file names (so that you can see how search works) in your Microsoft Account. For this application I had uploaded 3 files.

To run the application using docker, follow the below steps

1. Navigate to the directory `docker`

2. Once that is done, run the following command

    ```bash
    docker-compose up
    ```

3. When you are running the application for the first time, It will take some time initially to download the image and install the dependencies

Please refer to the screenshots folder for more clarity.

4. Open a browser and browse to `http://localhost:3000`.

The home page will appear with a Sign-in button. Click on it and sign in with your credentials (Refer to home_page.png). I used a personal Microsoft account as I don't have an organization account. In case you want to use an organization account you need to replace OAUTH_AUTHORITY=https://login.microsoftonline.com/consumers/ in .env with OAUTH_AUTHORITY=https://login.microsoftonline.com/organizations/

For more details please refer to this link (`https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-oauth2-auth-code-flow`) and navigate to "Request an authorization code" section.

5. You will be requested to give certain permissions to the application so that it can read the files from Sharepoint.

6. Once you give permissions you will redirected to this screen (`screenshots/redirected_page.png`) with your account name.

7. Click on `Documents` on the navbar. You will get all the documents which are saved in your logged Microsoft Account.

8. All these files are automatically indexed in Elasticsearch. To validate if they are indexed, open `http://localhost:5601` and you will reach the kibana dashboard. (Refer `screenshots/Kibana.png`)

9. Click on "Dev tools". You will find this on top right corner. Refer `screenshots/document_all.png)

10. Run the first query (refer to `kibana_queries.txt` file) which I have included for validation purposes. All the data in sharepoint are indexed in "documents" index.

11. The second query is the search api. I have also included the corresponding node api in `routes/search.js`. You can enter any document name (you can spell it wrong also and it should still return the nearest search results). I have run one such search query with "elas" as the search_term. Please refer to document_search.png to see the results. This api can also be testing in Postman. Refer to `Postman Collection` below.

12. `graph.js` file contains the connector for Microsoft Graph API.

13. `elasticsearch_sharepoint.js` contains all the elasticsearch functionalities like creating the document indexes, checking if index is present or not and adding the sharepoint documents to the "documnents" index.

14. You can modify the index mapping of the "documents" index. The mapping function is createSharepointDosIndex() in `elasticsearch_sharepoint.js`. I have used ngram tokenizer for search purposes. This can be tweaked accordingly. Refer to this link for modifying the tokenizers, `https://www.elastic.co/guide/en/elasticsearch/reference/current/analysis-tokenizers.html`

15. `search.js` contains the api for saerching the document by their file name. To test this api import the postman_collection in the docs folder

16. `routes/auth.js` contains the authentication and authorization apis. Here all the scopes and callback functionalities are implemented.

17. `views` folders are all server side rendered pages.

18. `public` contains a styles.css for styling the html contents.

19. I have used N gram tokenizer for partial matching of document names. 

20. You can add few more documents in the microsoft account and it will automatically get indexed in the "documents" index. After saving new documents navigate to Kibana dashboard and run the first query again and you will see the newly added documents have been saved in elasticsearch.

21. No duplicates are saved in elasticsearch as all the documents are saved with unique id's.

## Postman Collection

1. Import the postman collection (contains only the search api).

2. In `search_term` params field enter the name of the file you want to search.
