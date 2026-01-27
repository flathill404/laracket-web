import { useMutation, useQueryClient } from "@tanstack/react-query";

import { authQueries } from "@/features/auth/utils/queries";
import {
	deleteAvatar,
	updateAvatar,
	updateProfileInformation,
} from "../api/profile";

export const useProfileActions = () => {
	const queryClient = useQueryClient();

	const updateProfile = useMutation({
		mutationFn: updateProfileInformation,
		onSuccess: async () => {
			await queryClient.invalidateQueries(authQueries.user());
		},
	});

	const updateAvatarMutation = useMutation({
		mutationFn: updateAvatar,
		onSuccess: async () => {
			await queryClient.invalidateQueries(authQueries.user());
		},
	});

	const deleteAvatarMutation = useMutation({
		mutationFn: deleteAvatar,
		onSuccess: async () => {
			await queryClient.invalidateQueries(authQueries.user());
		},
	});

	return {
		updateProfile,
		updateAvatar: updateAvatarMutation,
		deleteAvatar: deleteAvatarMutation,
	};
};
