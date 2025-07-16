import { forwardRef } from 'react'

const Card = forwardRef(({ 
  children, 
  variant = 'default', 
  className = '', 
  hover = true,
  ...props 
}, ref) => {
  const baseClasses = 'border border-white/10 transition-smooth'
  
  const variants = {
    default: 'bg-black/80 rounded-xl',
    glassmorphism: 'glassmorphism rounded-xl',
    contact: 'bg-black/80 rounded-xl text-center',
    blog: 'bg-black/80 rounded-xl overflow-hidden cursor-pointer',
    project: 'bg-black/80 rounded-lg relative overflow-hidden',
    skill: 'bg-black/80 rounded-md'
  }
  
  const hoverEffects = hover ? {
    default: 'hover:bg-black/90 hover:border-white/20 hover:-translate-y-1',
    glassmorphism: 'hover:bg-black/30 hover:border-accent-primary/20 hover:-translate-y-1',
    contact: 'hover:bg-black/90 hover:border-accent-primary/30 hover:-translate-y-1.5',
    blog: 'hover:bg-black/90 hover:border-accent-primary/20 hover:-translate-y-1.5 hover:shadow-[0_10px_30px_rgba(0,0,0,0.4),0_0_20px_rgba(0,255,136,0.2)]',
    project: 'hover:bg-black/90 hover:border-purple-400/30 hover:-translate-y-2.5 hover:shadow-[0_15px_30px_rgba(0,0,0,0.4),0_0_20px_rgba(139,92,246,0.2)]',
    skill: 'hover:bg-black/90 hover:border-purple-400/30 hover:-translate-y-1.5 hover:shadow-[0_10px_25px_rgba(0,0,0,0.4),0_0_20px_rgba(139,92,246,0.2)]'
  } : {}
  
  const classes = `${baseClasses} ${variants[variant]} ${hoverEffects[variant] || ''} ${className}`
  
  return (
    <div
      ref={ref}
      className={classes}
      {...props}
    >
      {children}
    </div>
  )
})

Card.displayName = 'Card'

export default Card 