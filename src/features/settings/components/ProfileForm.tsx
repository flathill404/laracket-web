import { revalidateLogic } from "@tanstack/react-form";
import { X } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import z from "zod";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { FieldGroup, FieldLabel } from "@/components/ui/field";
import {
	deleteAvatar,
	updateAvatar,
	updateProfileInformation,
} from "@/features/auth/api";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useAppForm } from "@/hooks/useAppForm";
import { useMutationWithToast } from "@/hooks/useMutationWithToast";
import { queryKeys } from "@/lib/queryKeys";
import { ImageCropDialog } from "./ImageCropDialog";

export function ProfileForm() {
	const { user } = useAuth();
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [cropDialogOpen, setCropDialogOpen] = useState(false);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [selectedImageSrc, setSelectedImageSrc] = useState<string | null>(null);

	const updateProfileMutation = useMutationWithToast({
		mutationFn: updateProfileInformation,
		successMessage: (_, variables) => {
			if (variables.email !== user?.email) {
				return "Profile updated. We've sent a verification link to your new email address.";
			}
			return "Profile updated";
		},
		errorMessage: "Failed to update profile",
		invalidateKeys: [queryKeys.user()],
	});

	const updateAvatarMutation = useMutationWithToast({
		mutationFn: updateAvatar,
		successMessage: "Avatar updated",
		errorMessage: "Failed to update avatar",
		invalidateKeys: [queryKeys.user()],
	});

	const deleteAvatarMutation = useMutationWithToast({
		mutationFn: deleteAvatar,
		successMessage: "Avatar deleted",
		errorMessage: "Failed to delete avatar",
		invalidateKeys: [queryKeys.user()],
		onSuccess: () => {
			setDeleteDialogOpen(false);
			if (fileInputRef.current) {
				fileInputRef.current.value = "";
			}
		},
	});

	const profileFormSchema = z.object({
		displayName: z.string().min(1),
		email: z.email(),
	});

	const form = useAppForm({
		defaultValues: {
			displayName: user?.displayName ?? "",
			email: user?.email ?? "",
		},
		validationLogic: revalidateLogic(),
		validators: {
			onDynamic: profileFormSchema,
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
							<AvatarImage
								src={user?.avatarUrl ?? undefined}
								alt={user?.name}
							/>
							<AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
						</Avatar>
						{user?.avatarUrl && (
							<Dialog
								open={deleteDialogOpen}
								onOpenChange={setDeleteDialogOpen}
							>
								<DialogTrigger asChild>
									<Button
										variant="destructive"
										size="icon"
										className="absolute -top-2 -right-2 h-6 w-6 rounded-full shadow-sm"
									>
										<X className="h-3 w-3" />
										<span className="sr-only">Delete avatar</span>
									</Button>
								</DialogTrigger>
								<DialogContent>
									<DialogHeader>
										<DialogTitle>Delete Avatar</DialogTitle>
										<DialogDescription>
											Are you sure you want to delete your avatar?
										</DialogDescription>
									</DialogHeader>
									<DialogFooter>
										<DialogClose asChild>
											<Button variant="outline">Cancel</Button>
										</DialogClose>
										<Button
											variant="destructive"
											onClick={() => deleteAvatarMutation.mutate()}
											disabled={deleteAvatarMutation.isPending}
										>
											{deleteAvatarMutation.isPending
												? "Deleting..."
												: "Delete"}
										</Button>
									</DialogFooter>
								</DialogContent>
							</Dialog>
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
						<div className="rounded-md border bg-muted p-2 text-muted-foreground text-sm">
							{user?.name || "No name"}
						</div>
						<p className="text-[0.8rem] text-muted-foreground">
							Username cannot be changed.
						</p>
					</div>

					<FieldGroup>
						<form.AppField
							name="displayName"
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
					</FieldGroup>
					<div className="flex justify-end">
						<form.AppForm>
							<form.SubscribeButton label="Save" />
						</form.AppForm>
					</div>
				</form>

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
