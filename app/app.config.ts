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
          'bg-white/50 dark:bg-gray-800/50',
          'border border-gray-200/60 dark:border-gray-700/40',
          'placeholder:text-gray-400 dark:placeholder:text-gray-500',
          'focus:bg-white dark:focus:bg-gray-800',
          'focus:border-primary-500 dark:focus:border-primary-400',
          'focus:ring-2 focus:ring-primary-500/20',
          'backdrop-blur-sm',
          'transition-all duration-200'
        ]
      }
    },
    select: {
      slots: {
        base: [
          'rounded-xl',
          'bg-white/50 dark:bg-gray-800/50',
          'border border-gray-200/60 dark:border-gray-700/40',
          'focus:bg-white dark:focus:bg-gray-800',
          'focus:border-primary-500 dark:focus:border-primary-400',
          'focus:ring-2 focus:ring-primary-500/20',
          'backdrop-blur-sm',
          'transition-all duration-200'
        ]
      }
    },
    textarea: {
      slots: {
        base: [
          'rounded-xl',
          'bg-white/50 dark:bg-gray-800/50',
          'border border-gray-200/60 dark:border-gray-700/40',
          'placeholder:text-gray-400 dark:placeholder:text-gray-500',
          'focus:bg-white dark:focus:bg-gray-800',
          'focus:border-primary-500 dark:focus:border-primary-400',
          'focus:ring-2 focus:ring-primary-500/20',
          'backdrop-blur-sm',
          'transition-all duration-200'
        ]
      }
    },
    card: {
      slots: {
        root: [
          'rounded-2xl',
          'bg-white/60 dark:bg-gray-900/60',
          'backdrop-blur-xl',
          'border border-white/20 dark:border-gray-700/30',
          'shadow-sm shadow-gray-200/50 dark:shadow-gray-950/50',
          'hover:shadow-md hover:shadow-gray-200/60 dark:hover:shadow-gray-950/60',
          'transition-all duration-300'
        ],
        header: 'px-6 py-5 border-b border-gray-100/80 dark:border-gray-800/60',
        body: 'px-6 py-5',
        footer: 'px-6 py-5 border-t border-gray-100/80 dark:border-gray-800/60'
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
