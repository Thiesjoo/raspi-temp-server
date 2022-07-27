import { Static, Type } from "@sinclair/typebox";

export const Ingest = Type.Object({
	hostname: Type.String(),
	sensors: Type.Array(
		Type.Object({
			name: Type.String(),
			value: Type.Number(),
		})
	),
});

export type IngestType = Static<typeof Ingest>;
