export default defineAppConfig({
  ui: {
    colors: {
      primary: 'primary',
      neutral: 'zinc'
    },
    input: {
      slots: {
        root: 'w-full',
        base: [
          'rounded-xl',
          'bg-gray-50 dark:bg-gray-800/50',
          'border border-gray-200 dark:border-gray-700/50',
          'placeholder:text-gray-400 dark:placeholder:text-gray-500',
          'focus:bg-white dark:focus:bg-gray-800',
          'focus:border-primary-500 dark:focus:border-primary-400',
          'focus:ring-2 focus:ring-primary-500/20',
          'transition-all duration-200'
        ]
      }
    },
    select: {
      slots: {
        base: [
          'rounded-xl',
          'bg-gray-50 dark:bg-gray-800/50',
          'border border-gray-200 dark:border-gray-700/50',
          'focus:bg-white dark:focus:bg-gray-800',
          'focus:border-primary-500 dark:focus:border-primary-400',
          'focus:ring-2 focus:ring-primary-500/20',
          'transition-all duration-200'
        ]
      }
    },
    textarea: {
      slots: {
        base: [
          'rounded-xl',
          'bg-gray-50 dark:bg-gray-800/50',
          'border border-gray-200 dark:border-gray-700/50',
          'placeholder:text-gray-400 dark:placeholder:text-gray-500',
          'focus:bg-white dark:focus:bg-gray-800',
          'focus:border-primary-500 dark:focus:border-primary-400',
          'focus:ring-2 focus:ring-primary-500/20',
          'transition-all duration-200'
        ]
      }
    },
    card: {
      slots: {
        root: [
          'rounded-2xl',
          'bg-white dark:bg-gray-900/80',
          'border border-gray-200/80 dark:border-gray-800/80',
          'shadow-sm hover:shadow-md',
          'transition-shadow duration-300'
        ],
        header: 'px-6 py-5 border-b border-gray-100 dark:border-gray-800',
        body: 'px-6 py-5',
        footer: 'px-6 py-5 border-t border-gray-100 dark:border-gray-800'
      }
    },
    button: {
      defaultVariants: {
        color: 'primary'
      },
      slots: {
        base: [
          'font-semibold',
          'transition-all duration-200',
          'active:scale-[0.98]'
        ]
      }
    },
    badge: {
      slots: {
        base: [
          'font-medium',
          'rounded-full'
        ]
      }
    }
  }
})
