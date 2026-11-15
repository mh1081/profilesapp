import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { generateClient } from 'aws-amplify/data';
import { useEffect, useState } from 'react';

const client = generateClient();

function UserProfile({ user, signOut }) {
  const [email, setEmail] = useState(user?.signInDetails?.loginId || '');

  useEffect(() => {
    async function loadProfile() {
      try {
        const { data, errors } = await client.models.UserProfile.list();

        if (errors?.length) {
          console.error('Profile errors:', errors);
        }

        if (data?.length) {
          setEmail(data[0].email);
        }
      } catch (error) {
        console.error('Unable to load profile:', error);
      }
    }

    loadProfile();
  }, []);

  return (
    <main style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Welcome to Profiles App!</h1>
      <p>You are signed in as:</p>
      <h2>{email}</h2>
      <button onClick={signOut}>Sign Out</button>
    </main>
  );
}

export default function App() {
  return (
    <Authenticator>
      {({ signOut, user }) => (
        <UserProfile user={user} signOut={signOut} />
      )}
    </Authenticator>
  );
}
