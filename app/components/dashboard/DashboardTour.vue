<script setup lang="ts">
import { driver } from 'driver.js'
import 'driver.js/dist/driver.css'

const { hasSeenTour, markTourSeen } = useTour()

const startTour = () => {
    const driverObj = driver({
        showProgress: true,
        animate: true,
        overlayColor: 'rgba(0, 0, 0, 0.6)',
        stagePadding: 8,
        stageRadius: 12,
        popoverClass: 'tour-popover',
        nextBtnText: 'Дараах',
        prevBtnText: 'Өмнөх',
        doneBtnText: 'Ойлголоо!',
        onDestroyed: () => markTourSeen(),
        steps: [
            {
                element: '[data-tour-greeting]',
                popover: {
                    title: 'Тавтай морил!',
                    description: 'Энэ бол таны дэлгүүрийн удирдлагын самбар. Бид танд платформын гол боломжуудыг танилцуулъя!'
                }
            },
            {
                element: '[data-tour-stats]',
                popover: {
                    title: 'Статистик',
                    description: 'Захиалга, орлого, бараа, хэрэглэгчийн тоо зэрэг мэдээллээ энд хянана.'
                }
            },
            {
                element: 'a[href="/dashboard/live"]',
                popover: {
                    title: 'Facebook Live худалдаа',
                    description: 'Facebook Live дамжуулан бараагаа шууд худалдаарай! Үзэгчид коммент бичихэд захиалга автоматаар үүснэ — та ганц ч захиалга гараар авах шаардлагагүй.'
                }
            },
            {
                element: 'a[href="/dashboard/automation"]',
                popover: {
                    title: 'Автоматжуулалт',
                    description: 'Коммент илрүүлэх, захиалга үүсгэх, мессеж илгээх зэрэг бүх үйлдлийг автоматжуулна. Та зөвхөн Live хийхэд анхаарна!'
                }
            },
            {
                element: 'a[href="/dashboard/products"]',
                popover: {
                    title: 'Бараа бүтээгдэхүүн',
                    description: 'Барааны мэдээлэл, үнэ, нөөцийг энд удирдана. Бараа бүртгээд Live-д шууд нэмэх боломжтой.'
                }
            },
            {
                element: 'a[href="/dashboard/orders"]',
                popover: {
                    title: 'Захиалга',
                    description: 'Live-ээс автоматаар үүссэн болон гараар оруулсан бүх захиалгыг энд харна.'
                }
            },
            {
                element: '[data-tour-shop]',
                popover: {
                    title: 'Таны дэлгүүр',
                    description: 'Дэлгүүрийн тохиргоо, QPay холболт зэргийг эндээс хийнэ. Эхлээд дэлгүүрээ бэлэн болгоод Live худалдаагаа эхлүүлээрэй!'
                }
            }
        ]
    })

    driverObj.drive()
}

defineExpose({ startTour })

onMounted(() => {
    if (!hasSeenTour.value) {
        nextTick(() => {
            setTimeout(() => startTour(), 500)
        })
    }
})
</script>

<template>
    <div />
</template>

<style>
.tour-popover {
    --driver-theme-bg-color: #fff;
    --driver-theme-text-color: #1f2937;
    --driver-theme-border-color: #e5e7eb;
    --driver-theme-btn-text-color: #fff;
}

.driver-popover {
    max-width: 360px !important;
}

.driver-popover-title {
    font-size: 1rem !important;
    font-weight: 700 !important;
}

.driver-popover-description {
    font-size: 0.875rem !important;
    line-height: 1.5 !important;
    color: #4b5563 !important;
}
</style>
