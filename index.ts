import express, { Express, Request, Response } from "express";
import * as database from "./config/database";
import * as dotenv from "dotenv";
import { ApolloServer } from "apollo-server-express";
import { typeDefs } from "./typeDefs/index.typeDefs";
import { resolvers } from "./relsovers/index.resolver";
import { requireAuth } from "./middewares/auth.middleware";
const startSverver = async () => {
    dotenv.config();
    database.connect();
    const app: Express = express();
    const port: string | number = process.env.PORT || 3000;

    app.use("/graphql",requireAuth)
    const apolloServer = new ApolloServer({
        typeDefs: typeDefs,
        resolvers: resolvers,
        introspection: true,
        context: ({ req, res }) => req,
    });

    await apolloServer.start();

   

    apolloServer.applyMiddleware({
        app: app,
        path: "/graphql"
    })

    app.listen(port, () => {
        console.log(`App running on port ${port}`);
    });
}

startSverver();
// query{
//     getListArticle(sortKey: "title",
//     sortValue: "asc",
//     currentPage: 1 ,
//     limitItems: 5,
//     filterKey: "categoryId",
//     filterValue: "65468d5f834f8b56a156e56a",
//     keyword: "strcpy") {
//       avatar
//       title
//       category {
//         avatar
//         title
  
//       }
//     }
//   }
  

// mutation{
//     loginUser(user:{
//       email:"phuc@gmail.com",
//       password:"123"
//     }) {
//       fullName,
//       email,
//       token,
//       code,
//       message,
//       id
//   }
//   }

// query {
//     getUser {
//       code
//       email
//       message
//       token
//       fullName
//     }
//   }