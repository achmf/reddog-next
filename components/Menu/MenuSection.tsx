import MenuCard from "@/components/Menu/MenuCard"
import { Utensils } from "lucide-react"

type MenuType = {
  id: string
  name: string
  price: string
  image: string
  category: string
  description?: string
}

type MenuSectionProps = {
  title: string
  items: MenuType[]
  icon?: string
  description?: string
  color?: string
}

export default function MenuSection({ title, items, icon, description, color }: MenuSectionProps) {
  return (
    <div className="mb-16 animate-fadeIn">
      {/* Section Header */}
      <div className="text-center mb-8">
        <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r ${color || 'from-primary to-red-600'} text-white shadow-lg mb-4`}>
          {icon && <span className="text-2xl">{icon}</span>}
          <h2 className="text-2xl md:text-3xl font-bold">{title}</h2>
        </div>
        {description && (
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">{description}</p>
        )}
      </div>

      {/* Menu Grid */}
      {items.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((menu, index) => (
            <div 
              key={menu.id} 
              className="animate-slideUp"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <MenuCard {...menu} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-3 flex justify-center">
            <Utensils size={48} />
          </div>
          <p className="text-lg text-gray-600">Menu {title.toLowerCase()} tidak tersedia.</p>
        </div>
      )}
    </div>
  )
}
