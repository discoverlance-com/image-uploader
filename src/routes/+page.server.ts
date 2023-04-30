import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';

import { v2 as cloudinary } from 'cloudinary';
import { env } from '$env/dynamic/private';

export const actions = {
	default: async ({ request, fetch }) => {
		const data = await request.formData();
		const file = data.get('file');

		if (!file || !(file instanceof File)) {
			return fail(422, { error: true, message: 'Please upload a file' });
		}
		const timestamp = String(Math.round(new Date().getTime() / 1000));
		const folder = 'devchallenges/image-uploader';
		// get signature
		const signature = cloudinary.utils.api_sign_request(
			{ timestamp: timestamp, folder },
			env.CLOUDINARY_API_SECRET
		);

		const formData = new FormData();
		formData.append('file', file);
		formData.append('api_key', env.CLOUDINARY_API_KEY);
		formData.append('timestamp', timestamp);
		formData.append('signature', signature);
		formData.append('folder', folder);

		try {
			const request = await fetch(
				`https://api.cloudinary.com/v1_1/${env.CLOUDINARY_CLOUD_NAME}/image/upload`,
				{
					method: 'POST',
					body: formData
				}
			);

			const response = await request.json();
			return { success: true, image_url: response.secure_url };
		} catch (error) {
			console.log(error);
			return fail(400, { error: true, message: 'Error uploading file. Please try again later.' });
		}
	}
} satisfies Actions;
