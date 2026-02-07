export type FlowType = 'simple' | 'checkout' | 'full'
export type AutomationTone = 'professional' | 'friendly' | 'playful'
export type AutomationScope = 'always_on' | 'live_only'

export interface Automation {
    id: number
    shop_id: number
    name: string
    is_active: boolean
    flow_type: FlowType
    tone: AutomationTone
    scope: AutomationScope
    keywords: string[]
    trigger_count: number
    created_at: string
}

export interface CreateAutomationInput {
    name: string
    flow_type: FlowType
    tone: AutomationTone
    scope: AutomationScope
    keywords?: string[]
}

export interface AutomationsResponse {
    automations: Automation[]
}

export function useAutomation() {
    const config = useRuntimeConfig()
    const apiUrl = config.public.apiUrl

    const fetchAutomations = async (): Promise<Automation[]> => {
        const response = await $fetch<AutomationsResponse>(`${apiUrl}/api/automations`, {
            credentials: 'include'
        })
        return response.automations || []
    }

    const createAutomation = async (data: CreateAutomationInput): Promise<Automation> => {
        return await $fetch<Automation>(`${apiUrl}/api/automations`, {
            method: 'POST',
            credentials: 'include',
            body: data
        })
    }

    const updateAutomation = async (id: number, data: Partial<Automation>): Promise<Automation> => {
        return await $fetch<Automation>(`${apiUrl}/api/automations/${id}`, {
            method: 'PUT',
            credentials: 'include',
            body: data
        })
    }

    const deleteAutomation = async (id: number): Promise<void> => {
        await $fetch(`${apiUrl}/api/automations/${id}`, {
            method: 'DELETE',
            credentials: 'include'
        })
    }

    const getFlowLabel = (flowType: FlowType): string => {
        const labels: Record<FlowType, string> = {
            simple: 'Энгийн',
            checkout: 'Checkout',
            full: 'Бүрэн'
        }
        return labels[flowType] || flowType
    }

    const getFlowDescription = (flowType: FlowType): string => {
        const descriptions: Record<FlowType, string> = {
            simple: 'Захиалга үүсгэж, текст мессеж илгээнэ',
            checkout: 'Захиалга үүсгэж, checkout товчтой template илгээнэ',
            full: 'Захиалга үүсгэж, бараа carousel + checkout template илгээнэ'
        }
        return descriptions[flowType] || ''
    }

    const getToneLabel = (tone: AutomationTone): string => {
        const labels: Record<AutomationTone, string> = {
            professional: 'Албан ёсны',
            friendly: 'Найрсаг',
            playful: 'Хөгжилтэй'
        }
        return labels[tone] || tone
    }

    const getScopeLabel = (scope: AutomationScope): string => {
        const labels: Record<AutomationScope, string> = {
            always_on: 'Үргэлж идэвхтэй',
            live_only: 'Зөвхөн Live үед'
        }
        return labels[scope] || scope
    }

    const getFlowColor = (flowType: FlowType): 'info' | 'warning' | 'success' => {
        const colors: Record<FlowType, 'info' | 'warning' | 'success'> = {
            simple: 'info',
            checkout: 'warning',
            full: 'success'
        }
        return colors[flowType] || 'info'
    }

    const getToneColor = (tone: AutomationTone): 'neutral' | 'info' | 'warning' => {
        const colors: Record<AutomationTone, 'neutral' | 'info' | 'warning'> = {
            professional: 'neutral',
            friendly: 'info',
            playful: 'warning'
        }
        return colors[tone] || 'neutral'
    }

    return {
        fetchAutomations,
        createAutomation,
        updateAutomation,
        deleteAutomation,
        getFlowLabel,
        getFlowDescription,
        getToneLabel,
        getScopeLabel,
        getFlowColor,
        getToneColor
    }
}
