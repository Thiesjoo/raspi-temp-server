import { getCPUTemperature, getTemperatureSensor } from "./temperature";
import Fastify from "fastify";
import { AddressInfo } from "net";
import CORSImport from "@fastify/cors";

import { Redis, RedisTimeSeries } from "redis-modules-sdk";
import { Ingest, IngestType } from "./models/ingest";
import ms from "ms";

const isProd = () => process.env.NODE_ENV === "production";
const fastify = Fastify({ logger: true });
const port = 3000;

fastify.register(CORSImport);

const redis = new Redis({
	port: +(process.env.BROKER_PORT || 0) || 6380,
	host: process.env.BROKER_URL || "localhost",
});

redis.redis;
// 	res.send({ ok: true, room: getTemperatureSensor(), pi: getCPUTemperature() }); // fastify.get("/", (req, res) => {
// });

fastify.post<{ Body: IngestType }>(
	"/",
	{
		schema: {
			body: Ingest,
		},
	},
	async (req, res) => {
		let user = req.headers["x-user"];

		if (!user || typeof user !== "string") {
			if (isProd()) {
				throw new Error("Not authenticated");
			}
			user = "sample-user";
		}

		const base_redis_key = `${user}::${req.body.hostname}::`;
		console.log("Redis key for this request:", base_redis_key);

		await Promise.all(
			req.body.sensors.map((x) => {
				return new Promise(async (resolve, reject) => {
					const labels = [
						{ name: "user", value: user as string },
						{ name: "hostname", value: req.body.hostname },
						// TODO: label with unit
						// TODO: store in seperate redis key title for this
					];
					await redis.rts_module_create(base_redis_key + x.name, {
						retention: ms("7d"),
						labels,
					});
					await redis.rts_module_create(base_redis_key + x.name + "::compacted", {
						labels,
					});

					await redis.rts_module_createrule({
						sourceKey: base_redis_key + x.name,
						destKey: base_redis_key + x.name + "::compacted",
						aggregation: "avg",
						timeBucket: ms("1h"),
					});

					// await redis.rts_module_info;
					resolve(true);
				});
			})
		);

		res.send({ ok: true });
	}
);

fastify.get("/redis", (req, res) => {
	console.log("Heyyy", redis);
	res.send({ hoi: true });
});

fastify.listen({ port, host: "0.0.0.0" }, (err) => {
	if (err) throw err;
	console.log(`server listening on ${(fastify.server.address() as AddressInfo)?.port}`);
});
