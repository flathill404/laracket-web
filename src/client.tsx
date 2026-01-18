import { StartClient } from "@tanstack/react-start/client";
import { StrictMode, startTransition } from "react";
import { hydrateRoot } from "react-dom/client";

async function prepare() {
	if (import.meta.env.DEV) {
		const { worker } = await import("./mocks/browser");
		return worker.start({
			onUnhandledRequest: "bypass",
		});
	}
}

prepare().then(() => {
	startTransition(() => {
		hydrateRoot(
			document,
			<StrictMode>
				<StartClient />
			</StrictMode>,
		);
	});
});
