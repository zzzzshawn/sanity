import dotenv from "dotenv";
import { Resend } from "resend";
import { env } from "./env";

dotenv.config();

export const resend = new Resend(env.RESEND_API_KEY);
