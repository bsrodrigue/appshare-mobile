import { z } from 'zod';

// ==========================================
// Enums
// ==========================================

export const RoleEnum = z.enum(['client', 'delivery_man', 'seller']);
export const ProductStatusEnum = z.enum(['active', 'inactive', 'out_of_stock']);
export const OrderStatusLabelEnum = z.enum([
    'En attente de paiement',
    'Confirmée',
    'En préparation',
    'Prête',
    'En livraison',
    'Livrée',
    'Annulée'
]);
export const DeliveryTypeEnum = z.enum(['pickup', 'delivery']);
export const PaymentStatusEnum = z.enum(['completed', 'failed']);

export const JobTypeEnum = z.enum(['Emploi', 'Stage']);
export const ContractTypeEnum = z.enum(['CDI', 'CDD', 'Stage', 'Freelance', 'Temporaire']);
export const ExperienceLevelEnum = z.enum([
    'Débutant (0-1 an)',
    'Junior (1-3 ans)',
    'Intermédiaire (3-5 ans)',
    'Senior (5-10 ans)',
    'Expert / Lead (10+ ans)'
]);
export const WorkModeEnum = z.enum(['Présentiel', 'Hybride', 'Télétravail']);

// ==========================================
// Auth Schemas
// ==========================================

export const LoginRequestSchema = z.object({
    login: z.string().min(1, "Login requis"),
    password: z.string().min(1, "Mot de passe requis"),
});

export const RegisterRequestSchema = z.object({
    role: RoleEnum,
    email: z.string().email("Email invalide"),
    phone: z.string().min(1, "Téléphone requis"),
    first_name: z.string().max(100),
    last_name: z.string().max(100),
    date_of_birth: z.string().datetime(),
    password: z.string().min(8, "Mot de passe trop court"),
    password_confirmation: z.string(),
    promo_code: z.string().max(50).nullable().optional(),
    shop_name: z.string().max(255).nullable().optional(),
    // Binary fields like images are typically handled separately or as 'any' in Zod for API responses/requests unless specifically validated
    cnib_recto: z.any().optional(),
    cnib_verso: z.any().optional(),
    business_register: z.string().max(10240).nullable().optional(),
}).refine((data) => data.password === data.password_confirmation, {
    message: "Les mots de passe ne correspondent pas",
    path: ["password_confirmation"],
});

export const VerifyPhoneRequestSchema = z.object({
    code: z.string().length(6, "Le code doit contenir 6 chiffres"), // Assuming 6 digits based on typical OTP
});

export const ResendOTPRequestSchema = z.object({
    phone: z.string().min(1, "Téléphone requis"),
});

// ==========================================
// User & Resources
// ==========================================

export const UserResourceSchema = z.object({
    id: z.number(),
    first_name: z.string(),
    last_name: z.string(),
    email: z.string().email(),
    phone: z.string(),
    role: z.string(), // or RoleEnum if strict
    avatar_url: z.string().nullable(),
    is_verified: z.boolean(),
});

// ==========================================
// Shop & Product Schemas
// ==========================================

export const TownResourceSchema = z.object({
    id: z.number(),
    name: z.string(),
});

export const SellerSimpleResourceSchema = z.object({
    first_name: z.string(),
    last_name: z.string(),
});

export const ShopSimpleResourceSchema = z.object({
    id: z.number(),
    name: z.string(),
});

export const ShopResourceSchema = z.object({
    id: z.number(),
    name: z.string(),
    description: z.string().nullable(),
    phone: z.string().nullable(),
    email: z.string().nullable(),
    address: z.string().nullable(),
    latitude: z.number().nullable(),
    longitude: z.number().nullable(),
    logo_url: z.string(),
    town: TownResourceSchema.nullable(),
    seller: SellerSimpleResourceSchema.optional(), // Optional in some contexts?
});

export const SellerShopResourceSchema = ShopResourceSchema.extend({
    status: z.string(),
    is_primary: z.boolean(),
});

export const CategoryResourceSchema = z.object({
    id: z.number(),
    name: z.string(),
});

export const CategoryDetailResourceSchema = CategoryResourceSchema.extend({
    slug: z.string(),
    description: z.string(),
    icon: z.string(),
});

export const ProductResourceSchema = z.object({
    id: z.number(),
    name: z.string(),
    slug: z.string(),
    description: z.string().nullable(),
    price: z.number(),
    quantity: z.number(),
    image_url: z.string(),
    category: CategoryResourceSchema.nullable(),
    shop: ShopSimpleResourceSchema,
});

export const SellerProductResourceSchema = z.object({
    id: z.number(),
    name: z.string(),
    slug: z.string(),
    description: z.string(),
    price: z.number(),
    quantity: z.number(),
    status: z.string(),
    image_url: z.string(),
    category: CategoryDetailResourceSchema.nullable(),
    created_at: z.string(),
    updated_at: z.string(),
});

// ==========================================
// Cart & Order Schemas
// ==========================================

export const AddToCartRequestSchema = z.object({
    product_id: z.number(),
    quantity: z.number().min(1),
});

export const UpdateCartItemRequestSchema = z.object({
    quantity: z.number().min(1),
});

export const CartItemResourceSchema = z.object({
    id: z.number(),
    product_id: z.number(),
    quantity: z.number(),
    product: ProductResourceSchema,
});

export const OrderItemResourceSchema = z.object({
    id: z.number(),
    product_id: z.number(),
    product_name: z.string(),
    product_image: z.string().nullable(),
    quantity: z.number(),
    unit_price: z.number(),
    total_price: z.number(),
});

export const OrderResourceSchema = z.object({
    id: z.number(),
    reference: z.string(),
    status: z.string(),
    status_label: OrderStatusLabelEnum,
    subtotal: z.number(),
    delivery_fee: z.number(),
    total: z.number(),
    delivery_type: z.string(),
    delivery_address: z.any().nullable(), // Complex object or array based on schema
    payment_status: z.string(),
    payment_method: z.string().nullable(),
    created_at: z.string(),
    shop: ShopSimpleResourceSchema.optional(),
    items: z.array(OrderItemResourceSchema).optional(),
});

export const CheckoutRequestSchema = z.object({
    orders: z.array(z.object({
        shop_id: z.number(),
        delivery_type: DeliveryTypeEnum,
        delivery_address: z.object({
            address: z.string(),
            latitude: z.number(),
            longitude: z.number(),
        }).optional(),
    })).min(1),
});

// ==========================================
// Job Schemas
// ==========================================

export const JobCategoryResourceSchema = z.object({
    id: z.number(),
    name: z.string(),
    slug: z.string(),
    icon: z.string().nullable(),
    description: z.string().nullable(),
    jobs_count: z.number(),
});

export const CompanyResourceSchema = z.object({
    id: z.number(),
    name: z.string(),
    slug: z.string(),
    logo_url: z.string().nullable(),
    description: z.string().nullable(),
    city: z.string().nullable(),
    is_verified: z.boolean(),
    active_jobs_count: z.number().optional(),
});

export const CompanyDetailResourceSchema = z.object({
    id: z.number(),
    name: z.string(),
    slug: z.string(),
    logo_url: z.string(),
    description: z.string(),
    website: z.string(),
    email: z.string(),
    phone: z.string(),
    address: z.string(),
    city: z.string(),
    is_verified: z.boolean(),
    active_jobs_count: z.number(),
});

export const SalaryRangeSchema = z.object({
    min: z.union([z.number(), z.string()]).nullable(), // API spec shows mixed types in different places
    max: z.union([z.number(), z.string()]).nullable(),
    currency: z.string(),
    formatted: z.string(),
});

export const JobPostResourceSchema = z.object({
    id: z.number(),
    reference: z.string(),
    title: z.string(),
    slug: z.string(),
    company: z.object({
        id: z.number(),
        name: z.string(),
        slug: z.string(),
        logo_url: z.string().nullable(),
        is_verified: z.boolean(),
    }),
    category: z.object({
        id: z.number(),
        name: z.string(),
        slug: z.string(),
        icon: z.string().nullable(),
    }),
    type: z.string(),
    type_label: JobTypeEnum,
    contract_type: z.string(),
    contract_type_label: ContractTypeEnum,
    experience_level: z.string(),
    experience_level_label: ExperienceLevelEnum,
    work_mode: z.string(),
    work_mode_label: WorkModeEnum,
    location: z.string(),
    city: z.string(),
    salary_range: SalaryRangeSchema,
    deadline: z.string(),
    days_remaining: z.number(),
    is_online_application_enabled: z.boolean(),
    posted_at: z.string(),
    views_count: z.number(),
    has_applied: z.boolean(),
});

export const JobPostDetailResourceSchema = z.object({
    id: z.number(),
    reference: z.string(),
    title: z.string(),
    slug: z.string(),
    company: CompanyDetailResourceSchema,
    category: z.object({
        id: z.number(),
        name: z.string(),
        slug: z.string(),
        icon: z.string(),
    }),
    type: z.string(),
    type_label: z.string(),
    contract_type: z.string(),
    contract_type_label: z.string(),
    experience_level: z.string(),
    experience_level_label: z.string(),
    work_mode: z.string(),
    work_mode_label: z.string(),
    work_mode_description: z.string(),
    education_level: z.string(),
    education_level_label: z.string(),
    location: z.string(),
    city: z.string(),
    description: z.string(),
    requirements: z.array(z.string()).or(z.string()), // Handle potential array or string
    responsibilities: z.array(z.string()).or(z.string()),
    benefits: z.array(z.string()).or(z.string()),
    required_documents: z.array(z.string()).or(z.string()),
    submission_address: z.string(),
    submission_email: z.string(),
    deadline: z.string(),
    days_remaining: z.number(),
    is_online_application_enabled: z.boolean(),
    salary_range: SalaryRangeSchema,
    status: z.string(),
    status_label: z.string(),
    published_at: z.string(),
    views_count: z.number(),
    applications_count: z.number(),
    has_applied: z.boolean().or(z.string()), // Spec showed string|boolean
    created_at: z.string(),
    updated_at: z.string(),
});

// Job Application Schemas
export const ApplicationDocumentTypeEnum = z.enum([
    'resume',
    'cover_letter',
    'diploma',
    'certificate',
    'portfolio',
    'id_card',
    'recommendation',
    'other'
]);

export const JobApplicationStatusValueEnum = z.enum([
    'pending',
    'under_review',
    'interview_scheduled',
    'accepted',
    'rejected',
    'withdrawn'
]);

export const JobApplicationStatusLabelEnum = z.enum([
    'En attente',
    'En cours d\'examen',
    'Convocation entretien',
    'Acceptée',
    'Rejetée',
    'Retirée'
]);

export const JobApplicationStatusColorEnum = z.enum([
    'gray',
    'blue',
    'orange',
    'green',
    'red'
]);

export const JobApplicationDocumentResourceSchema = z.object({
    id: z.number(),
    type: z.string(),
    type_label: z.enum([
        'Curriculum Vitae (CV)',
        'Lettre de motivation',
        'Diplôme',
        'Certificat',
        'Portfolio',
        'Pièce d\'identité',
        'Lettre de recommandation',
        'Autre document'
    ]),
    url: z.string(),
});

export const JobApplicationResourceSchema = z.object({
    id: z.number(),
    status: z.object({
        value: JobApplicationStatusValueEnum,
        label: JobApplicationStatusLabelEnum,
        color: JobApplicationStatusColorEnum,
        description: z.string(),
    }),
    cover_letter_text: z.string().nullable(),
    job: z.object({
        id: z.number(),
        reference: z.string(),
        title: z.string(),
        slug: z.string(),
        company: z.object({
            id: z.number(),
            name: z.string(),
            slug: z.string(),
            logo_url: z.string().nullable(),
            is_verified: z.boolean(),
        }),
        category: z.object({
            id: z.number(),
            name: z.string(),
            slug: z.string(),
            icon: z.string().nullable(),
        }),
        deadline: z.string(),
        city: z.string(),
    }),
    documents: z.array(JobApplicationDocumentResourceSchema),
    can_be_withdrawn: z.boolean(),
    interview_scheduled_at: z.string().nullable(),
    applied_at: z.string(),
    updated_at: z.string(),
});

export const ApplyJobRequestSchema = z.object({
    job_post_id: z.number(),
    cover_letter_text: z.string().max(5000).nullable().optional(),
    documents: z.array(z.object({
        type: ApplicationDocumentTypeEnum,
        file: z.any(), // Binary file data
    })).nullable().optional(),
});

// ==========================================
// Pharmacy Schemas
// ==========================================

export const PharmacyResourceSchema = z.object({
    id: z.number(),
    name: z.string(),
    town: z.string(),
    phone: z.string().nullable(),
    latitude: z.number().nullable(),
    longitude: z.number().nullable(),
    address: z.string().nullable(),
    is_on_duty: z.boolean(),
    google_maps_link: z.string(),
    data_source: z.string(),
    scraped_at: z.string(),
    created_at: z.string(),
    updated_at: z.string(),
    distance: z.number().optional(),
});

// ==========================================
// Payment Schemas
// ==========================================

export const InitializePaymentRequestSchema = z.object({
    plan_id: z.number(),
});

export const ProcessPaymentWebhookRequestSchema = z.object({
    transaction_id: z.string(),
    status: PaymentStatusEnum,
    payment_method: z.string(),
});

// ==========================================
// Subscription Schemas
// ==========================================

export const SubscriptionResourceSchema = z.object({
    subscription: z.string(), // Simplified based on spec
});

// ==========================================
// Seller Actions
// ==========================================

export const CreateProductRequestSchema = z.object({
    category_id: z.number(),
    name: z.string().max(255),
    description: z.string().max(5000).nullable().optional(),
    price: z.number().min(1),
    quantity: z.number().min(0),
    image: z.any().optional(), // Binary
});

export const UpdateProductRequestSchema = CreateProductRequestSchema.partial().extend({
    status: ProductStatusEnum.optional(),
});

export const UpdateShopRequestSchema = z.object({
    name: z.string().max(255).optional(),
    description: z.string().max(1000).nullable().optional(),
    phone: z.string().nullable().optional(),
    email: z.string().email().max(255).nullable().optional(),
    address: z.string().max(500).nullable().optional(),
    latitude: z.number().min(-90).max(90).nullable().optional(),
    longitude: z.number().min(-180).max(180).nullable().optional(),
});

export const UploadShopLogoRequestSchema = z.object({
    logo: z.any(), // Binary
});
