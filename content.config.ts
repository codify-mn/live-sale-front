import { defineCollection, defineContentConfig, z } from '@nuxt/content'

// Shared schema builders
const linkSchema = z.object({
    label: z.string(),
    to: z.string().optional(),
    icon: z.string().optional(),
    target: z.string().optional(),
    color: z
        .enum(['primary', 'secondary', 'neutral', 'error', 'warning', 'success', 'info'])
        .optional(),
    variant: z.enum(['solid', 'outline', 'soft', 'subtle', 'ghost', 'link']).optional(),
    size: z.enum(['xs', 'sm', 'md', 'lg', 'xl']).optional()
})

const featureSchema = z.object({
    title: z.string(),
    description: z.string(),
    icon: z.string().optional()
})

const imageSchema = z.object({
    src: z.string(),
    alt: z.string().optional(),
    loading: z.enum(['lazy', 'eager']).optional()
})

export default defineContentConfig({
    collections: {
        // Landing page content
        index: defineCollection({
            type: 'page',
            source: '0.index.yml',
            schema: z.object({
                title: z.string(),
                description: z.string(),
                hero: z
                    .object({
                        title: z.string(),
                        description: z.string(),
                        links: z.array(linkSchema).optional()
                    })
                    .optional(),
                sections: z
                    .array(
                        z.object({
                            title: z.string(),
                            description: z.string().optional(),
                            features: z.array(featureSchema).optional(),
                            orientation: z.enum(['horizontal', 'vertical']).optional()
                        })
                    )
                    .optional(),
                features: z.array(featureSchema).optional(),
                testimonials: z
                    .object({
                        title: z.string(),
                        description: z.string().optional(),
                        items: z
                            .array(
                                z.object({
                                    quote: z.string(),
                                    user: z.object({
                                        name: z.string(),
                                        description: z.string().optional(),
                                        avatar: imageSchema.optional()
                                    })
                                })
                            )
                            .optional()
                    })
                    .optional(),
                cta: z
                    .object({
                        title: z.string(),
                        description: z.string().optional(),
                        links: z.array(linkSchema).optional()
                    })
                    .optional()
            })
        }),

        // Pricing page content
        pricing: defineCollection({
            type: 'page',
            source: '2.pricing.yml',
            schema: z.object({
                title: z.string(),
                description: z.string(),
                plans: z
                    .array(
                        z.object({
                            title: z.string(),
                            description: z.string().optional(),
                            price: z.object({
                                month: z.string(),
                                year: z.string()
                            }),
                            features: z.array(z.string()).optional(),
                            button: linkSchema.optional(),
                            highlight: z.boolean().optional()
                        })
                    )
                    .optional(),
                faq: z
                    .object({
                        title: z.string(),
                        description: z.string().optional(),
                        items: z
                            .array(
                                z.object({
                                    label: z.string(),
                                    content: z.string()
                                })
                            )
                            .optional()
                    })
                    .optional()
            })
        }),

        // Documentation pages
        docs: defineCollection({
            type: 'page',
            source: '1.docs/**/*'
        })
    }
})
