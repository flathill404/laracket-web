import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ImageCropDialog } from "./ImageCropDialog";

// Mock react-easy-crop
vi.mock("react-easy-crop", () => ({
	default: ({
		image,
		onCropComplete,
	}: {
		image: string;
		onCropComplete: (crop: unknown, pixelCrop: unknown) => void;
	}) => (
		<div data-testid="mock-cropper">
			<img src={image} alt="crop-mock" />
			<button
				type="button"
				onClick={() =>
					onCropComplete(
						{ x: 0, y: 0, width: 100, height: 100 },
						{ x: 0, y: 0, width: 100, height: 100 },
					)
				}
			>
				Trigger Crop Complete
			</button>
		</div>
	),
}));

// Mock canvas and image API
vi.stubGlobal(
	"Image",
	class {
		onload: (() => void) | null = null;
		src = "";
		constructor() {
			setTimeout(() => this.onload?.(), 0);
		}
		addEventListener(event: string, cb: () => void) {
			if (event === "load") this.onload = cb;
		}
	},
);

describe("ImageCropDialog", () => {
	const defaultProps = {
		isOpen: true,
		onClose: vi.fn(),
		imageSrc: "mock-image-src",
		onCropComplete: vi.fn(),
	};

	beforeEach(() => {
		vi.clearAllMocks();
		vi.restoreAllMocks();

		vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockImplementation(
			function (this: HTMLCanvasElement, contextId: string) {
				if (contextId === "2d") {
					return {
						drawImage: vi.fn(),
					} as unknown as CanvasRenderingContext2D;
				}
				return null;
			},
		);

		vi.spyOn(HTMLCanvasElement.prototype, "toBlob").mockImplementation(
			function (this: HTMLCanvasElement, callback: BlobCallback) {
				callback(new Blob(["test-blob"], { type: "image/webp" }));
			},
		);
	});

	it("renders dialog with cropper", () => {
		render(<ImageCropDialog {...defaultProps} />);
		expect(screen.getByText("Crop Image")).toBeInTheDocument();
		expect(screen.getByTestId("mock-cropper")).toBeInTheDocument();
	});

	it("calls onClose when clicking Cancel", () => {
		render(<ImageCropDialog {...defaultProps} />);
		const cancelButton = screen.getByRole("button", { name: "Cancel" });
		fireEvent.click(cancelButton);
		expect(defaultProps.onClose).toHaveBeenCalled();
	});

	it("handles saving cropped image", async () => {
		render(<ImageCropDialog {...defaultProps} />);

		// Trigger crop complete in mock
		const triggerButton = screen.getByText("Trigger Crop Complete");
		fireEvent.click(triggerButton);

		const saveButton = screen.getByRole("button", { name: "Save" });
		fireEvent.click(saveButton);

		await waitFor(() => {
			expect(defaultProps.onCropComplete).toHaveBeenCalledWith(
				expect.any(File),
			);
		});
		expect(defaultProps.onClose).toHaveBeenCalled();
	});
});
