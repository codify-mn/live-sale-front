const TOUR_SEEN_KEY = 'dashboard_tour_seen'

export const useTour = () => {
    const hasSeenTour = ref(false)

    onMounted(() => {
        hasSeenTour.value = localStorage.getItem(TOUR_SEEN_KEY) === 'true'
    })

    const markTourSeen = () => {
        hasSeenTour.value = true
        localStorage.setItem(TOUR_SEEN_KEY, 'true')
    }

    const resetTour = () => {
        hasSeenTour.value = false
        localStorage.removeItem(TOUR_SEEN_KEY)
    }

    return { hasSeenTour, markTourSeen, resetTour }
}
