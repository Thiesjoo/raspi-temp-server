import ds18b20 from "ds18b20";
//@ts-ignore
import isRPI from "detect-rpi";
import { execSync } from "child_process";

export function getTemperatureSensor() {
	if (isRPI()) {
		return ds18b20.temperatureSync("28-0215011c09ff");
	} else {
		return +(20.0 + (Math.random() - 0.5) * 10).toFixed(2);
	}
}

const tempMatchRegex = /[0-9]*\.[0-9]*/;

export function getCPUTemperature() {
	try {
		let result = execSync("vcgencmd measure_temp", { encoding: "utf-8" });
		return +(tempMatchRegex.exec(result)?.[0] || NaN);
	} catch (e) {
		console.error(e);
		return NaN;
	}
}
