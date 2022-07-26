import { getCPUTemperature, getTemperatureSensor } from "./temperature";
import Fastify from "fastify";
import { AddressInfo } from "net";
import CORSImport from "@fastify/cors";

import { Redis, RedisTimeSeries } from "redis-modules-sdk";

const fastify = Fastify({ logger: true });
const port = 3000;

console.log("Trying to login to fastify with url: " + process.env.BROKER_URL);

fastify.register(CORSImport);

const redis = new Redis(process.env.BROKER_URL || "");

fastify.get("/", (req, res) => {
	res.send({ ok: true, room: getTemperatureSensor(), pi: getCPUTemperature() });
});

fastify.get("/redis", (req, res) => {
	const { redis } = fastify;

	console.log("Heyyy", redis);
	res.send({ hoi: true });
});

fastify.listen({ port, host: "0.0.0.0" }, (err) => {
	if (err) throw err;
	console.log(`server listening on ${(fastify.server.address() as AddressInfo)?.port}`);
});
