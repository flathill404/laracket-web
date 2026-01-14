import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_guest/")({ component: App });

function App() {
	return <div className="">top</div>;
}
