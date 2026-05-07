import axios from "axios";
import config from "../config/config.js"
import { wrapper } from "axios-cookiejar-support";
import { CookieJar } from "tough-cookie";
import dotenv from "dotenv";
dotenv.config();


const jar = new CookieJar();

export const qb = wrapper(axios.create({
  baseURL: config.QBITIP,
  jar,
  withCredentials: true
}));

export async function loginQB() {
  await qb.post("/api/v2/auth/login", 
    new URLSearchParams({
      username: config.QBITUSER,
      password: config.QBITPASS
    })
  );
}
