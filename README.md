# Client + Server
## Pre requirements:
- Installed .NET 8 environment
- Installed Node.js
- Installed and running MSSQL Server

## To run development environment:
1. Clone repository
2. Open cloned repository root directory from terminal
3. Execute command:
```shell
dotnet run --project .\AnotherBlogSite.Presentation\AnotherBlogSite.Presentation.csproj --launch-profile 'AnotherBlogSite'
```

## Configuration
Need to update CORS policy for production.

### Server
- Database connection string configuration in the `appsettings` of corresponding environment:
```json
"ConnectionStrings": {
  "BlogSiteContext": ""
}
```
- JWT's parameters Audience, Issuer, Key - section `Jwt` in `appsettings` of corresponding environment:
```json
"Jwt": {
  "Audience": "",
  "Issuer": "",
  "Key": ""
}
```
- .NET launches client's development server on the url provided in `AnotherBlogSite.Presentation.csproj` file:
```xml
<SpaProxyServerUrl>https://localhost:44435</SpaProxyServerUrl>
```
- To change server's url for AnotherBlogSite launch profile, update `.\AnotherBlogSite.Presentation\Properties\launchSettings.json` file:
```json
"AnotherBlogSite": {
    ...
    "applicationUrl": "https://localhost:7281;http://localhost:5125",
    ...
    }
},
```


### Client
Client application placed in the `.\AnotherBlogSite.Presentation\ClientApp`
- To set server's address set variable `VITE_SERVER_URL` in `.env` of corresponding environment

```
VITE_SERVER_URL=https://localhost:7281
```

- To set dev server's port change `server.port` in the `vite.config.ts`:
```ts
export default defineConfig({
    plugins: [react(), basicSsl()],
    server: {
        port: 44435,
    },
})
```

# Amortization Schedule procedure
In the root of the repository there is a file named `AmortizationScheduleProcedure.sql` it drops if exist and creates function `GenerateAmortizationSchedule` and procedure `GenerateReportForTestExercise` than executes procedure.
The procedure is used to generate schedule for a loan of 36000 and interest of 8% for 36 monthly payments and then recycles after the 12th payment on the remaining amount with a fixed interest of 4.5% for an additional 48 payments.

To rerun procedure execute following query:
```tsql
EXEC [GenerateReportForTestExercise]
GO
```