import { z } from 'zod';
import { type JsonSchema7Type } from 'zod-to-json-schema';
export declare const JOB_DESCRIPTION_SCHEMA_ID = "https://jsonresume.org/schema/job-description";
export declare const JOB_DESCRIPTION_SCHEMA_VERSION = "1.0.0";
export declare const jobDescriptionSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    company: z.ZodOptional<z.ZodString>;
    companyDescription: z.ZodOptional<z.ZodString>;
    department: z.ZodOptional<z.ZodString>;
    companyContext: z.ZodOptional<z.ZodString>;
    location: z.ZodOptional<z.ZodObject<{
        address: z.ZodOptional<z.ZodString>;
        postalCode: z.ZodOptional<z.ZodString>;
        city: z.ZodOptional<z.ZodString>;
        countryCode: z.ZodOptional<z.ZodString>;
        region: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        address?: string | undefined;
        postalCode?: string | undefined;
        city?: string | undefined;
        countryCode?: string | undefined;
        region?: string | undefined;
    }, {
        address?: string | undefined;
        postalCode?: string | undefined;
        city?: string | undefined;
        countryCode?: string | undefined;
        region?: string | undefined;
    }>>;
    position: z.ZodOptional<z.ZodString>;
    type: z.ZodOptional<z.ZodString>;
    salary: z.ZodOptional<z.ZodString>;
    compensation: z.ZodOptional<z.ZodObject<{
        currency: z.ZodOptional<z.ZodString>;
        interval: z.ZodOptional<z.ZodString>;
        minimum: z.ZodOptional<z.ZodNumber>;
        maximum: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        minimum?: number | undefined;
        maximum?: number | undefined;
        currency?: string | undefined;
        interval?: string | undefined;
    }, {
        minimum?: number | undefined;
        maximum?: number | undefined;
        currency?: string | undefined;
        interval?: string | undefined;
    }>>;
    date: z.ZodOptional<z.ZodString>;
    remote: z.ZodOptional<z.ZodString>;
    url: z.ZodOptional<z.ZodString>;
    applicationUrl: z.ZodOptional<z.ZodString>;
    applicationEmail: z.ZodOptional<z.ZodString>;
    contact: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    responsibilities: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    qualifications: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    skills: z.ZodOptional<z.ZodArray<z.ZodObject<{
        name: z.ZodOptional<z.ZodString>;
        level: z.ZodOptional<z.ZodString>;
        keywords: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        name?: string | undefined;
        level?: string | undefined;
        keywords?: string[] | undefined;
    }, {
        name?: string | undefined;
        level?: string | undefined;
        keywords?: string[] | undefined;
    }>, "many">>;
    experience: z.ZodOptional<z.ZodString>;
    education: z.ZodOptional<z.ZodString>;
    benefits: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    schemaVersion: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    type?: string | undefined;
    title?: string | undefined;
    company?: string | undefined;
    companyDescription?: string | undefined;
    department?: string | undefined;
    companyContext?: string | undefined;
    location?: {
        address?: string | undefined;
        postalCode?: string | undefined;
        city?: string | undefined;
        countryCode?: string | undefined;
        region?: string | undefined;
    } | undefined;
    position?: string | undefined;
    salary?: string | undefined;
    compensation?: {
        minimum?: number | undefined;
        maximum?: number | undefined;
        currency?: string | undefined;
        interval?: string | undefined;
    } | undefined;
    date?: string | undefined;
    remote?: string | undefined;
    url?: string | undefined;
    applicationUrl?: string | undefined;
    applicationEmail?: string | undefined;
    contact?: string | undefined;
    description?: string | undefined;
    responsibilities?: string[] | undefined;
    qualifications?: string[] | undefined;
    skills?: {
        name?: string | undefined;
        level?: string | undefined;
        keywords?: string[] | undefined;
    }[] | undefined;
    experience?: string | undefined;
    education?: string | undefined;
    benefits?: string[] | undefined;
    metadata?: Record<string, unknown> | undefined;
    schemaVersion?: string | undefined;
}, {
    type?: string | undefined;
    title?: string | undefined;
    company?: string | undefined;
    companyDescription?: string | undefined;
    department?: string | undefined;
    companyContext?: string | undefined;
    location?: {
        address?: string | undefined;
        postalCode?: string | undefined;
        city?: string | undefined;
        countryCode?: string | undefined;
        region?: string | undefined;
    } | undefined;
    position?: string | undefined;
    salary?: string | undefined;
    compensation?: {
        minimum?: number | undefined;
        maximum?: number | undefined;
        currency?: string | undefined;
        interval?: string | undefined;
    } | undefined;
    date?: string | undefined;
    remote?: string | undefined;
    url?: string | undefined;
    applicationUrl?: string | undefined;
    applicationEmail?: string | undefined;
    contact?: string | undefined;
    description?: string | undefined;
    responsibilities?: string[] | undefined;
    qualifications?: string[] | undefined;
    skills?: {
        name?: string | undefined;
        level?: string | undefined;
        keywords?: string[] | undefined;
    }[] | undefined;
    experience?: string | undefined;
    education?: string | undefined;
    benefits?: string[] | undefined;
    metadata?: Record<string, unknown> | undefined;
    schemaVersion?: string | undefined;
}>;
export type JobDescription = z.infer<typeof jobDescriptionSchema>;
export declare const jobDescriptionJsonSchema: JsonSchema7Type & Record<string, unknown>;
export declare const sampleJobDescription: JobDescription;
export declare function parseJobDescription(data: unknown): JobDescription;
export declare function validateJobDescription(data: unknown): {
    success: true;
    data: JobDescription;
} | {
    success: false;
    errors: string[];
};
export declare const jobDescriptionTool: {
    description: string;
    parameters: z.ZodObject<{
        title: z.ZodOptional<z.ZodString>;
        company: z.ZodOptional<z.ZodString>;
        companyDescription: z.ZodOptional<z.ZodString>;
        department: z.ZodOptional<z.ZodString>;
        companyContext: z.ZodOptional<z.ZodString>;
        location: z.ZodOptional<z.ZodObject<{
            address: z.ZodOptional<z.ZodString>;
            postalCode: z.ZodOptional<z.ZodString>;
            city: z.ZodOptional<z.ZodString>;
            countryCode: z.ZodOptional<z.ZodString>;
            region: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            address?: string | undefined;
            postalCode?: string | undefined;
            city?: string | undefined;
            countryCode?: string | undefined;
            region?: string | undefined;
        }, {
            address?: string | undefined;
            postalCode?: string | undefined;
            city?: string | undefined;
            countryCode?: string | undefined;
            region?: string | undefined;
        }>>;
        position: z.ZodOptional<z.ZodString>;
        type: z.ZodOptional<z.ZodString>;
        salary: z.ZodOptional<z.ZodString>;
        compensation: z.ZodOptional<z.ZodObject<{
            currency: z.ZodOptional<z.ZodString>;
            interval: z.ZodOptional<z.ZodString>;
            minimum: z.ZodOptional<z.ZodNumber>;
            maximum: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            minimum?: number | undefined;
            maximum?: number | undefined;
            currency?: string | undefined;
            interval?: string | undefined;
        }, {
            minimum?: number | undefined;
            maximum?: number | undefined;
            currency?: string | undefined;
            interval?: string | undefined;
        }>>;
        date: z.ZodOptional<z.ZodString>;
        remote: z.ZodOptional<z.ZodString>;
        url: z.ZodOptional<z.ZodString>;
        applicationUrl: z.ZodOptional<z.ZodString>;
        applicationEmail: z.ZodOptional<z.ZodString>;
        contact: z.ZodOptional<z.ZodString>;
        description: z.ZodOptional<z.ZodString>;
        responsibilities: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        qualifications: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        skills: z.ZodOptional<z.ZodArray<z.ZodObject<{
            name: z.ZodOptional<z.ZodString>;
            level: z.ZodOptional<z.ZodString>;
            keywords: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        }, "strip", z.ZodTypeAny, {
            name?: string | undefined;
            level?: string | undefined;
            keywords?: string[] | undefined;
        }, {
            name?: string | undefined;
            level?: string | undefined;
            keywords?: string[] | undefined;
        }>, "many">>;
        experience: z.ZodOptional<z.ZodString>;
        education: z.ZodOptional<z.ZodString>;
        benefits: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        schemaVersion: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        type?: string | undefined;
        title?: string | undefined;
        company?: string | undefined;
        companyDescription?: string | undefined;
        department?: string | undefined;
        companyContext?: string | undefined;
        location?: {
            address?: string | undefined;
            postalCode?: string | undefined;
            city?: string | undefined;
            countryCode?: string | undefined;
            region?: string | undefined;
        } | undefined;
        position?: string | undefined;
        salary?: string | undefined;
        compensation?: {
            minimum?: number | undefined;
            maximum?: number | undefined;
            currency?: string | undefined;
            interval?: string | undefined;
        } | undefined;
        date?: string | undefined;
        remote?: string | undefined;
        url?: string | undefined;
        applicationUrl?: string | undefined;
        applicationEmail?: string | undefined;
        contact?: string | undefined;
        description?: string | undefined;
        responsibilities?: string[] | undefined;
        qualifications?: string[] | undefined;
        skills?: {
            name?: string | undefined;
            level?: string | undefined;
            keywords?: string[] | undefined;
        }[] | undefined;
        experience?: string | undefined;
        education?: string | undefined;
        benefits?: string[] | undefined;
        metadata?: Record<string, unknown> | undefined;
        schemaVersion?: string | undefined;
    }, {
        type?: string | undefined;
        title?: string | undefined;
        company?: string | undefined;
        companyDescription?: string | undefined;
        department?: string | undefined;
        companyContext?: string | undefined;
        location?: {
            address?: string | undefined;
            postalCode?: string | undefined;
            city?: string | undefined;
            countryCode?: string | undefined;
            region?: string | undefined;
        } | undefined;
        position?: string | undefined;
        salary?: string | undefined;
        compensation?: {
            minimum?: number | undefined;
            maximum?: number | undefined;
            currency?: string | undefined;
            interval?: string | undefined;
        } | undefined;
        date?: string | undefined;
        remote?: string | undefined;
        url?: string | undefined;
        applicationUrl?: string | undefined;
        applicationEmail?: string | undefined;
        contact?: string | undefined;
        description?: string | undefined;
        responsibilities?: string[] | undefined;
        qualifications?: string[] | undefined;
        skills?: {
            name?: string | undefined;
            level?: string | undefined;
            keywords?: string[] | undefined;
        }[] | undefined;
        experience?: string | undefined;
        education?: string | undefined;
        benefits?: string[] | undefined;
        metadata?: Record<string, unknown> | undefined;
        schemaVersion?: string | undefined;
    }>;
};
//# sourceMappingURL=index.d.ts.map