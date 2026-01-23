import { useCallback, useState } from "react";
import Cropper, { type Area } from "react-easy-crop";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";

interface ImageCropDialogProps {
	isOpen: boolean;
	onClose: () => void;
	imageSrc: string | null;
	onCropComplete: (croppedImage: File) => void;
}

export function ImageCropDialog({
	isOpen,
	onClose,
	imageSrc,
	onCropComplete,
}: ImageCropDialogProps) {
	const [crop, setCrop] = useState({ x: 0, y: 0 });
	const [zoom, setZoom] = useState(1);
	const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

	const onCropChange = (crop: { x: number; y: number }) => {
		setCrop(crop);
	};

	const onZoomChange = (zoom: number) => {
		setZoom(zoom);
	};

	const onCropCompleteHandler = useCallback(
		(_croppedArea: Area, croppedAreaPixels: Area) => {
			setCroppedAreaPixels(croppedAreaPixels);
		},
		[],
	);

	const createImage = (url: string): Promise<HTMLImageElement> =>
		new Promise((resolve, reject) => {
			const image = new Image();
			image.addEventListener("load", () => resolve(image));
			image.addEventListener("error", (error) => reject(error));
			image.src = url;
		});

	const getCroppedImg = async (
		imageSrc: string,
		pixelCrop: Area,
	): Promise<File | null> => {
		const image = await createImage(imageSrc);
		const canvas = document.createElement("canvas");
		const ctx = canvas.getContext("2d");

		if (!ctx) {
			return null;
		}

		// Fixed size 512x512 as requested
		canvas.width = 512;
		canvas.height = 512;

		// Draw the image on canvas according to crop
		// We can essentially scale the source image chunk to 512x512
		ctx.drawImage(
			image,
			pixelCrop.x,
			pixelCrop.y,
			pixelCrop.width,
			pixelCrop.height,
			0,
			0,
			512,
			512,
		);

		return new Promise((resolve, reject) => {
			canvas.toBlob(
				(blob) => {
					if (!blob) {
						reject(new Error("Canvas is empty"));
						return;
					}
					// Create a file from blob
					const file = new File([blob], "avatar.webp", {
						type: "image/webp",
					});
					resolve(file);
				},
				"image/webp",
				0.8, // Quality
			);
		});
	};

	const handleSave = async () => {
		if (imageSrc && croppedAreaPixels) {
			try {
				const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
				if (croppedImage) {
					onCropComplete(croppedImage);
					onClose();
				}
			} catch {
				toast.error("Failed to crop image");
			}
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Crop Image</DialogTitle>
					<DialogDescription>
						Adjust the image to fit the avatar area.
					</DialogDescription>
				</DialogHeader>
				<div className="relative h-64 w-full">
					{imageSrc && (
						<Cropper
							image={imageSrc}
							crop={crop}
							zoom={zoom}
							aspect={1}
							cropShape="round"
							onCropChange={onCropChange}
							onZoomChange={onZoomChange}
							onCropComplete={onCropCompleteHandler}
						/>
					)}
				</div>
				<div className="flex items-center gap-4 py-2">
					<span className="w-12 text-muted-foreground text-sm">Zoom</span>
					<Slider
						value={[zoom]}
						min={1}
						max={3}
						step={0.1}
						onValueChange={(val) => setZoom(val[0])}
					/>
				</div>
				<DialogFooter>
					<Button variant="outline" onClick={onClose}>
						Cancel
					</Button>
					<Button onClick={handleSave}>Save</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
