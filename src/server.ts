import app from "./app";
import { prisma } from "./lib/prisma";
import config from "./config";
const PORT = config.port;
export default app;

// async function main(){
//     try {
//         await prisma.$connect();
//         app.listen(PORT, ()=>{
//             console.log(`prisma express server is running on port ${PORT}`)
//         })
//     } catch (error) {
//         console.error("Error starting the server :", error);
//         await prisma.$disconnect();
//         process.exit(1);
//     }
// }
// main();