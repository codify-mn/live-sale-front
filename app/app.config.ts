export default defineAppConfig({
  ui: {
    colors: {
      primary: 'blue',
      neutral: 'zinc'
    },
    input: {
      slots: {
        root: 'w-full',
        base: [
          'rounded-lg',
          'bg-gray-100/80 dark:bg-gray-800/50',
          'border border-gray-200 dark:border-gray-700/50',
          'placeholder:text-gray-400 dark:placeholder:text-gray-500',
          'focus:bg-white dark:focus:bg-gray-800',
          'focus:border-primary-500 dark:focus:border-primary-500',
          'focus:ring-1 focus:ring-primary-500/30',
          'transition-all duration-150'
        ]
      }
    },
    select: {
      slots: {
        base: [
          'rounded-lg',
          'bg-gray-100/80 dark:bg-gray-800/50',
          'border border-gray-200 dark:border-gray-700/50',
          'focus:bg-white dark:focus:bg-gray-800',
          'focus:border-primary-500 dark:focus:border-primary-500',
          'focus:ring-1 focus:ring-primary-500/30',
          'transition-all duration-150'
        ]
      }
    },
    textarea: {
      slots: {
        base: [
          'rounded-lg',
          'bg-gray-100/80 dark:bg-gray-800/50',
          'border border-gray-200 dark:border-gray-700/50',
          'placeholder:text-gray-400 dark:placeholder:text-gray-500',
          'focus:bg-white dark:focus:bg-gray-800',
          'focus:border-primary-500 dark:focus:border-primary-500',
          'focus:ring-1 focus:ring-primary-500/30',
          'transition-all duration-150'
        ]
      }
    },
    card: {
      slots: {
        root: [
          'rounded-xl',
          'bg-white dark:bg-gray-900/80',
          'border border-gray-200 dark:border-gray-800',
          'shadow-sm'
        ],
        header: 'px-5 py-4 border-b border-gray-100 dark:border-gray-800',
        body: 'px-5 py-4',
        footer: 'px-5 py-4 border-t border-gray-100 dark:border-gray-800'
      }
    },
    button: {
      defaultVariants: {
        color: 'primary'
      }
    }
  }
})
