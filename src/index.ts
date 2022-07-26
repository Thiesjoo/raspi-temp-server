import { getCPUTemperature, getTemperatureSensor } from "./temperature";
import Fastify from "fastify";
import { AddressInfo } from "net";
import cors from "@fastify/cors";

const fastify = Fastify({ logger: true });
const port = 3000;

fastify.register(cors);

fastify.get("/", (req, res) => {
	res.send({ ok: true, room: getTemperatureSensor(), pi: getCPUTemperature() });
});

fastify.listen({ port, host: "0.0.0.0" }, (err) => {
	if (err) throw err;
	console.log(`server listening on ${(fastify.server.address() as AddressInfo)?.port}`);
});
