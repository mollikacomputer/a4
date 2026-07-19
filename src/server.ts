import app from "./app";
import { prisma } from "./lib/prisma";
import config from "./config";
const PORT = config.port;
async function main(){
    try {
        await prisma.$connect();
        app.listen(PORT, ()=>{
        })
    } catch (error) {

        await prisma.$disconnect();
        process.exit(1);
    }
}
main();