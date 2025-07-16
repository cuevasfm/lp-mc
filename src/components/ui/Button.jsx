import { forwardRef } from 'react'

const Button = forwardRef(({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  disabled = false,
  loading = false,
  ...props 
}, ref) => {
  const baseClasses = 'inline-flex items-center justify-center font-semibold transition-smooth relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed'
  
  const variants = {
    primary: 'gradient-bg-primary text-white glow-primary hover:shadow-[0_0_40px_rgba(0,255,136,0.4)] hover:-translate-y-0.5',
    outline: 'bg-transparent border-2 border-accent-primary text-accent-primary hover:bg-accent-primary hover:text-black glow-primary hover:-translate-y-0.5',
    ghost: 'bg-transparent text-gray-300 hover:text-accent-primary hover:bg-white/5',
    secondary: 'bg-gray-800 text-white border border-gray-600 hover:bg-gray-700 hover:border-gray-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 glow-tertiary'
  }
  
  const sizes = {
    sm: 'px-4 py-2 text-sm rounded-md min-w-[120px]',
    md: 'px-6 py-3 text-base rounded-lg min-w-[160px]',
    lg: 'px-8 py-4 text-lg rounded-xl min-w-[200px]'
  }
  
  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`
  
  return (
    <button
      ref={ref}
      className={classes}
      disabled={disabled || loading}
      {...props}
    >
      {/* Shine effect */}
      <span className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-all duration-500 group-hover:left-[100%]"></span>
      
      {loading && (
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
          <span>Cargando...</span>
        </div>
      )}
      
      {!loading && children}
    </button>
  )
})

Button.displayName = 'Button'

export default Button 