// Helper function to format date
export const formatDate = (dateString: string) => {
    const dt = new Date(dateString)
    return (
        dt.getFullYear() +
        '-' +
        (dt.getMonth() + 1 < 10 ? '0' + (dt.getMonth() + 1) : dt.getMonth() + 1) +
        '-' +
        (dt.getDate() < 10 ? '0' + dt.getDate() : dt.getDate()) +
        ' ' +
        (dt.getHours() < 10 ? '0' + dt.getHours() : dt.getHours()) +
        ':' +
        (dt.getMinutes() < 10 ? '0' + dt.getMinutes() : dt.getMinutes())
    )
}

// Helper function to format currency
export const formatCurrency = (amount: number, currency: string = 'MNT') => {
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency === 'MNT' ? 'MNT' : 'USD',
        minimumFractionDigits: currency === 'MNT' ? 0 : 2
    })
    return formatter.format(amount)
}
