import type { PostConfirmationTriggerHandler } from 'aws-lambda';
import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/api';
import { getAmplifyDataClientConfig } from '@aws-amplify/backend/function/runtime';
import { env } from '$amplify/env/post-confirmation';
import { createUserProfile } from './graphql/mutations';

export const handler: PostConfirmationTriggerHandler = async (event) => {
  const { resourceConfig, libraryOptions } =
    await getAmplifyDataClientConfig(env);

  Amplify.configure(resourceConfig, libraryOptions);

  const client = generateClient({
    authMode: 'iam',
  });

  const result = await client.graphql({
    query: createUserProfile,
    variables: {
      input: {
        email: event.request.userAttributes.email,
        profileOwner: event.request.userAttributes.sub,
      },
    },
  });

  if (result.errors?.length) {
    throw new Error(JSON.stringify(result.errors));
  }

  return event;
};
