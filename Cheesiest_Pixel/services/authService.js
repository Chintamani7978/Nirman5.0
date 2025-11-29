import { UserRole } from '../types';

// Mock users for easy login during demo
export const MOCK_USERS = {
    patient: {
        id: 'p1',
        name: 'Rahul Sharma',
        email: 'rahul@example.com',
        role: UserRole.PATIENT,
        avatar: 'https://picsum.photos/200/200?random=1'
    },
    doctor: {
        id: 'd1',
        name: 'Dr. Anjali Gupta',
        email: 'anjali@hospital.com',
        role: UserRole.DOCTOR,
        avatar: 'https://picsum.photos/200/200?random=2'
    },
    researcher: {
        id: 'r1',
        name: 'Dr. Vikram Singh',
        email: 'vikram@research.org',
        role: UserRole.RESEARCHER,
        avatar: 'https://picsum.photos/200/200?random=3'
    },
    admin: {
        id: 'a1',
        name: 'Admin Hospital',
        email: 'admin@samhita.com',
        role: UserRole.ADMIN,
        avatar: 'https://picsum.photos/200/200?random=4'
    }
};

export const login = async (role) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const user = Object.values(MOCK_USERS).find(u => u.role === role);
    if (user) return user;

    throw new Error('User not found');
};

export const logout = async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
};
