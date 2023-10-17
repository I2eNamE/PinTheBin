import { useEffect } from 'react';
import { useRouter } from 'next/router';

import { useRouter } from 'next/navigation'

const router = useRouter()

export default function useAuthentication() {
    const router = useRouter();

    useEffect(() => {
        router.push('/');
    })
}