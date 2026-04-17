import { yup, validateYupSchema } from '@strapi/utils';

export interface RegisterExpertPayload {
    // User fields
    email: string;
    password: string;
    username?: string;
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    zipcode?: string;
    image?: number | string | null;

    // Expert fields - required
    name: string;
    title: string;
    specialty: string;
    experience: number;
    Duration: number;
    consultationAvailable: boolean;

    // Expert fields - optional
    bio?: string;
    bio_long?: string;
    expertise?: any;
    credentials?: any;
    certifications?: any;
    consultationFee?: number;
    availability?: any;
    languages?: any;
    verified?: boolean;
    verificationDocument?: number | string | null;
    profileBanner?: number | string | null;
}

// Helper for media fields that can be id:number or id:string or null
const mediaSchema = yup.mixed<number | string>().nullable().optional();

const registerExpertSchema = yup.object().shape({
    // User fields
    email: yup
        .string()
        .email('Invalid email format')
        .min(6, 'Email must be at least 6 characters')
        .required('Email is required'),

    password: yup
        .string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required'),

    username: yup
        .string()
        .min(3, 'Username must be at least 3 characters')
        .optional(),

    firstName: yup.string().optional(),
    lastName: yup.string().optional(),
    phoneNumber: yup.string().optional(),
    address: yup.string().optional(),
    city: yup.string().optional(),
    state: yup.string().optional(),
    country: yup.string().optional(),
    zipcode: yup.string().optional(),
    image: mediaSchema,

    // Expert fields - required
    name: yup.string().required('Expert name is required'),
    title: yup.string().required('Title is required'),
    specialty: yup.string().required('Specialty is required'),
    experience: yup
        .number()
        .integer('Experience must be an integer')
        .min(0, 'Experience cannot be negative')
        .default(0)
        .required('Experience is required'),
    Duration: yup
        .number()
        .integer('Duration must be an integer')
        .default(1)
        .required('Duration is required'),
    consultationAvailable: yup
        .boolean()
        .default(true)
        .required('consultationAvailable is required'),

    // Expert fields - optional
    bio: yup.string().optional(),
    bio_long: yup.string().optional(),
    expertise: yup.mixed().optional(),
    credentials: yup.mixed().optional(),
    certifications: yup.mixed().optional(),
    consultationFee: yup.number().min(0, 'Fee cannot be negative').optional(),
    availability: yup.mixed().optional(),
    languages: yup.mixed().optional(),
    verified: yup.boolean().optional(),
    verificationDocument: mediaSchema,
    profileBanner: mediaSchema,
});

export async function validateRegisterExpert(body: unknown): Promise<RegisterExpertPayload> {
    try {
        const data = await validateYupSchema(registerExpertSchema)(body);

        if (!data.username) {
            data.username = data.email;
        }

        if (data.expertise && !Array.isArray(data.expertise) && typeof data.expertise !== 'object') {
            throw new Error('expertise must be an array or object');
        }

        if (data.languages && !Array.isArray(data.languages)) {
            throw new Error('languages must be an array');
        }

        return data as RegisterExpertPayload;
    } catch (error) {
        if (error instanceof yup.ValidationError) {
            const errors = error.inner.reduce((acc, err) => {
                if (err.path) acc[err.path] = err.message;
                return acc;
            }, {} as Record<string, string>);
            throw new Error(`Validation failed: ${JSON.stringify(errors)}`);
        }
        throw error;
    }
}