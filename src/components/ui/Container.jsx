import { forwardRef } from 'react'

const Container = forwardRef(({ 
  children, 
  className = '', 
  ...props 
}, ref) => {
  // Asegurar que siempre esté centrado
  // Base: padding lateral, centrado automático
  // md (768px+): 90% width máximo
  // lg (1024px+): 1200px width máximo
  
  const containerClasses = `
    w-full max-w-none px-4 mx-auto
    md:max-w-[90%] md:px-5
    lg:max-w-[1200px] lg:px-5
    ${className}
  `.trim().replace(/\s+/g, ' ')
  
  return (
    <div
      ref={ref}
      className={containerClasses}
      {...props}
    >
      {children}
    </div>
  )
})

Container.displayName = 'Container'

export default Container 