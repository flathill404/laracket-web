import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X } from "lucide-react";
import { useRef } from "react";
import { toast } from "sonner";
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
import { useAppForm, formContext } from "@/hooks/use-app-form";
import { useAuth } from "@/hooks/use-auth";
import {
	deleteAvator,
	updateAvator,
	updateProfileInformation,
} from "@/lib/api/auth";

export function ProfileForm() {
	const { user } = useAuth();
	const queryClient = useQueryClient();
	const fileInputRef = useRef<HTMLInputElement>(null);

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

	const updateAvatorMutation = useMutation({
		mutationFn: updateAvator,
		onSuccess: () => {
			toast.success("Avator updated");
			queryClient.invalidateQueries({ queryKey: ["user"] });
		},
		onError: () => {
			toast.error("Failed to update avator");
		},
	});

	const deleteAvatorMutation = useMutation({
		mutationFn: deleteAvator,
		onSuccess: () => {
			toast.success("Avator deleted");
			queryClient.invalidateQueries({ queryKey: ["user"] });
			if (fileInputRef.current) {
				fileInputRef.current.value = "";
			}
		},
		onError: () => {
			toast.error("Failed to delete avator");
		},
	});

	const form = useAppForm({
		defaultValues: {
			name: user?.name ?? "",
			email: user?.email ?? "",
		},
		onSubmit: async ({ value }) => {
			await updateProfileMutation.mutateAsync(value);
		},
	});

	const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			await updateAvatorMutation.mutateAsync(file);
		}
	};

	const handleDeleteAvator = async () => {
		if (confirm("Are you sure you want to delete your avator?")) {
			await deleteAvatorMutation.mutateAsync();
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
				{/* Avator Section */}
				<div className="flex items-center gap-6">
					<div className="relative">
						<Avatar className="h-20 w-20">
							<AvatarImage src={user?.avator_url} alt={user?.name} />
							<AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
						</Avatar>
						{user?.avator_url && (
							<Button
								variant="destructive"
								size="icon"
								className="absolute -right-2 -top-2 h-6 w-6 rounded-full shadow-sm"
								onClick={handleDeleteAvator}
								disabled={deleteAvatorMutation.isPending}
							>
								<X className="h-3 w-3" />
								<span className="sr-only">Delete avator</span>
							</Button>
						)}
					</div>
					<div className="flex flex-col gap-2">
						<FieldLabel>Avator</FieldLabel>
						<div className="flex items-center gap-2">
							<Button
								variant="outline"
								size="sm"
								onClick={() => fileInputRef.current?.click()}
								disabled={updateAvatorMutation.isPending}
							>
								{updateAvatorMutation.isPending
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
							JPG, GIF or PNG. 1MB max.
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
						<form.AppField
							name="name"
							children={(field) => (
								<field.InputField label="Name" placeholder="Your Name" />
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
			</CardContent>
		</Card>
	);
}
