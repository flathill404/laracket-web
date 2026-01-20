import type { SVGProps } from "react";

export function RocketMascot(props: SVGProps<SVGSVGElement>) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 200 200"
			fill="none"
			{...props}
		>
			<title>Rocket Mascot</title>
			<circle cx="100" cy="100" r="90" className="fill-blue-50/50" />
			<path
				d="M100 40C100 40 70 70 70 110C70 150 80 160 80 160H120C120 160 130 150 130 110C130 70 100 40 100 40Z"
				className="fill-white stroke-slate-900 stroke-2"
			/>
			<path
				d="M100 40C100 40 130 70 130 110"
				className="stroke-slate-900 stroke-2 opacity-10"
			/>
			<path
				d="M100 80C100 80 115 80 115 95C115 110 100 110 100 110"
				className="fill-blue-200 stroke-slate-900 stroke-2"
			/>
			<path
				d="M70 110L50 140L80 140"
				className="fill-red-400 stroke-slate-900 stroke-2"
			/>
			<path
				d="M130 110L150 140L120 140"
				className="fill-red-400 stroke-slate-900 stroke-2"
			/>
			<path
				d="M90 160V170C90 170 90 180 100 180C110 180 110 170 110 170V160"
				className="fill-orange-400 stroke-slate-900 stroke-2"
			/>
			<path
				d="M60 20L40 30M140 20L160 30M20 100L10 100M190 100L180 100"
				className="stroke-slate-300 stroke-2"
				strokeLinecap="round"
			/>
		</svg>
	);
}
