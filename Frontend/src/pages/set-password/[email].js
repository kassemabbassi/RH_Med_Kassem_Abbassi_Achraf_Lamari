import { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { useAuth } from "@/context/AuthContext";


export default function SetPassword() {
    const { api } = useAuth();
    const router = useRouter();
    const { email } = router.query; // Email récupéré depuis l'URL
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/user/set-password', {
                email,
                password,
            });
            alert('Password set successfully!');
            router.push('/'); // Redirection après succès
        } catch (error) {
            console.error(error);
            alert('Error setting password.');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h1>Set Your Password</h1>
            <label>Password:</label>
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            <button type="submit">Set Password</button>
        </form>
    );
}
