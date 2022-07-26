import { getCPUTemperature, getTemperatureSensor } from "./temperature";
import Fastify from "fastify";

const fastify = Fastify({ logger: true });
const port = 3000;

fastify.get("/", (req, res) => {
	res.send({ ok: true, room: getTemperatureSensor(), pi: getCPUTemperature() });
});

fastify.listen({ port: 3000, host: "0.0.0.0" }, (err) => {
	if (err) throw err;
	console.log(`server listening on ${fastify.server.address()?.toString()}`);
});
