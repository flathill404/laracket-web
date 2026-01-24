import type { z } from "zod";
import { client } from "@/lib/client";
import type { updateProfileInformationInputSchema } from "../types";

/**
 * Updates the user's profile information.
 * @param input - The name and email.
 */
export const updateProfileInformation = async (
	input: z.infer<typeof updateProfileInformationInputSchema>,
) => {
	await client.put("/user/profile-information", input);
};

/**
 * Updates the user's avatar.
 * @param file - The new avatar file.
 */
export const updateAvatar = async (file: File) => {
	const avatar = await new Promise<string>((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => resolve(reader.result as string);
		reader.onerror = (error) => reject(error);
	});

	await client.post("/user/avatar", { avatar });
};

/**
 * Deletes the user's avatar.
 */
export const deleteAvatar = async () => {
	// User said "avatar" for "profile-photo".
	await client.delete("/user/avatar");
};
