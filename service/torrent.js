import { qb } from "./qb.js";
import config from "../config/config.js";



export async function getTorrents() {
  const { data } = await qb.get("/api/v2/torrents/info");
 let total


total =0
for (const x of data){
  if(x.state == 'queuedDL' || x.state=='downloading' || x.state=='stalledDL' ||x.state=='metaDL'){
    total = total+1;
  }
}

 return total
}


