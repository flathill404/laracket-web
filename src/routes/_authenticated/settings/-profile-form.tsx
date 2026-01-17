import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { ImageCropDialog } from "@/components/image-crop-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { FieldLabel } from "@/components/ui/field";
import { formContext, useAppForm } from "@/hooks/use-app-form";
import { useAuth } from "@/hooks/use-auth";
import {
	deleteAvatar,
	updateAvatar,
	updateProfileInformation,
} from "@/lib/api/auth";

export function ProfileForm() {
	const { user } = useAuth();
	const queryClient = useQueryClient();
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [cropDialogOpen, setCropDialogOpen] = useState(false);
	const [selectedImageSrc, setSelectedImageSrc] = useState<string | null>(null);

	const updateProfileMutation = useMutation({
		mutationFn: updateProfileInformation,
		onSuccess: () => {
			toast.success("Profile updated");
			queryClient.invalidateQueries({ queryKey: ["user"] });
		},
		onError: () => {
			toast.error("Failed to update profile");
		},
	});

	const updateAvatarMutation = useMutation({
		mutationFn: updateAvatar,
		onSuccess: () => {
			toast.success("Avatar updated");
			queryClient.invalidateQueries({ queryKey: ["user"] });
		},
		onError: () => {
			toast.error("Failed to update avatar");
		},
	});

	const deleteAvatarMutation = useMutation({
		mutationFn: deleteAvatar,
		onSuccess: () => {
			toast.success("Avatar deleted");
			queryClient.invalidateQueries({ queryKey: ["user"] });
			if (fileInputRef.current) {
				fileInputRef.current.value = "";
			}
		},
		onError: () => {
			toast.error("Failed to delete avatar");
		},
	});

	const form = useAppForm({
		defaultValues: {
			display_name: user?.display_name ?? "",
			email: user?.email ?? "",
		},
		onSubmit: async ({ value }) => {
			await updateProfileMutation.mutateAsync(value);
		},
	});

	const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			if (file.size > 20 * 1024 * 1024) {
				toast.error("File size must be less than 20MB");
				return;
			}
			const reader = new FileReader();
			reader.onload = () => {
				setSelectedImageSrc(reader.result as string);
				setCropDialogOpen(true);
			};
			reader.readAsDataURL(file);
			// Reset input so valid change triggers again if needed
			e.target.value = "";
		}
	};

	const handleCropComplete = async (croppedFile: File) => {
		await updateAvatarMutation.mutateAsync(croppedFile);
	};

	const handleDeleteAvatar = async () => {
		if (confirm("Are you sure you want to delete your avatar?")) {
			await deleteAvatarMutation.mutateAsync();
		}
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>Profile Information</CardTitle>
				<CardDescription>
					Update your account's profile information and email address.
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-6">
				{/* Avatar Section */}
				<div className="flex items-center gap-6">
					<div className="relative">
						<Avatar className="h-20 w-20">
							<AvatarImage src={user?.avatarUrl} alt={user?.name} />
							<AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
						</Avatar>
						{user?.avatarUrl && (
							<Button
								variant="destructive"
								size="icon"
								className="absolute -right-2 -top-2 h-6 w-6 rounded-full shadow-sm"
								onClick={handleDeleteAvatar}
								disabled={deleteAvatarMutation.isPending}
							>
								<X className="h-3 w-3" />
								<span className="sr-only">Delete avatar</span>
							</Button>
						)}
					</div>
					<div className="flex flex-col gap-2">
						<FieldLabel>Avatar</FieldLabel>
						<div className="flex items-center gap-2">
							<Button
								variant="outline"
								size="sm"
								onClick={() => fileInputRef.current?.click()}
								disabled={updateAvatarMutation.isPending}
							>
								{updateAvatarMutation.isPending
									? "Uploading..."
									: "Select New Photo"}
							</Button>
							<input
								ref={fileInputRef}
								type="file"
								className="hidden"
								accept="image/*"
								onChange={handleFileChange}
							/>
						</div>
						<p className="text-[0.8rem] text-muted-foreground">
							JPG, GIF or PNG. 20MB max.
						</p>
					</div>
				</div>

				<formContext.Provider value={form}>
					<form
						onSubmit={(e) => {
							e.preventDefault();
							e.stopPropagation();
							form.handleSubmit();
						}}
						className="space-y-4"
					>
						<div className="space-y-2">
							<FieldLabel>Name</FieldLabel>
							<div className="p-2 border rounded-md bg-muted text-muted-foreground text-sm">
								{user?.name || "No name"}
							</div>
							<p className="text-[0.8rem] text-muted-foreground">
								Username cannot be changed.
							</p>
						</div>

						<form.AppField
							name="display_name"
							children={(field) => (
								<field.InputField
									label="Display Name"
									placeholder="Your Display Name"
								/>
							)}
						/>
						<form.AppField
							name="email"
							children={(field) => (
								<field.InputField
									label="Email"
									placeholder="name@example.com"
									type="email"
								/>
							)}
						/>
						<div className="flex justify-end">
							<form.SubscribeButton label="Save" />
						</div>
					</form>
				</formContext.Provider>

				<ImageCropDialog
					isOpen={cropDialogOpen}
					onClose={() => setCropDialogOpen(false)}
					imageSrc={selectedImageSrc}
					onCropComplete={handleCropComplete}
				/>
			</CardContent>
		</Card>
	);
}
