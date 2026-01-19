import React from 'react'

interface TagProps {
  name: string
  className?: string
}

// Deterministic color assignment
const getTagColorClass = (name: string): string => {
  if (!name) return 'tag-cyan'

  // Simple string hash
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }

  // Map to 4 styles
  const variants = ['tag-cyan', 'tag-purple', 'tag-green', 'tag-yellow']
  const index = Math.abs(hash) % variants.length

  return variants[index]
}

export const Tag: React.FC<TagProps> = ({ name, className = '' }) => {
  const colorClass = getTagColorClass(name)

  return (
    <span className={`tag ${colorClass} ${className}`}>
      <span style={{ opacity: 0.6 }}>#</span>
      {name}
    </span>
  )
}
