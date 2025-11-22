"use client"

import { useState, useEffect } from "react"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface DraggableItemProps {
  id: string
  children: React.ReactNode
  className?: string
}

function DraggableItem({ id, children, className }: DraggableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    scale: isDragging ? 0.95 : 1,
  }

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      className={cn("relative group", className)}
      whileHover={{ scale: 1.01 }}
    >
      <div
        {...attributes}
        {...listeners}
        className="absolute -left-2 top-1/2 -translate-y-1/2 z-10 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-muted/50 backdrop-blur-sm"
        title="Glisser pour réorganiser"
      >
        <GripVertical className="h-5 w-5 text-muted-foreground" />
      </div>
      {children}
    </motion.div>
  )
}

interface DraggableDashboardProps {
  leftColumn: string[]
  rightColumn: string[]
  onLayoutChange: (leftColumn: string[], rightColumn: string[]) => void
  children: Record<string, React.ReactNode>
}

export function DraggableDashboard({
  leftColumn: initialLeftColumn,
  rightColumn: initialRightColumn,
  onLayoutChange,
  children,
}: DraggableDashboardProps) {
  const [leftColumn, setLeftColumn] = useState<string[]>(initialLeftColumn)
  const [rightColumn, setRightColumn] = useState<string[]>(initialRightColumn)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  useEffect(() => {
    // Load saved layout from localStorage
    const savedLayout = localStorage.getItem("dashboard-layout")
    if (savedLayout) {
      try {
        const parsed = JSON.parse(savedLayout)
        if (parsed.leftColumn && parsed.rightColumn) {
          // Validate that all saved IDs exist in children
          const validLeft = parsed.leftColumn.filter((id: string) => id in children)
          const validRight = parsed.rightColumn.filter((id: string) => id in children)
          
          // Add missing IDs from initial layout
          const allIds = new Set([...validLeft, ...validRight])
          initialLeftColumn.forEach((id) => {
            if (!allIds.has(id) && id in children) {
              validLeft.push(id)
            }
          })
          initialRightColumn.forEach((id) => {
            if (!allIds.has(id) && id in children) {
              validRight.push(id)
            }
          })
          
          setLeftColumn(validLeft.length > 0 ? validLeft : initialLeftColumn)
          setRightColumn(validRight.length > 0 ? validRight : initialRightColumn)
        }
      } catch (error) {
        console.error("Error loading saved layout:", error)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (!over || active.id === over.id) {
      return
    }

    const activeId = active.id as string
    const overId = over.id as string

    // Find which column contains the active item
    const activeInLeft = leftColumn.includes(activeId)
    const activeInRight = rightColumn.includes(activeId)
    const overInLeft = leftColumn.includes(overId)
    const overInRight = rightColumn.includes(overId)

    let newLeftColumn = [...leftColumn]
    let newRightColumn = [...rightColumn]

    // Same column reordering
    if (activeInLeft && overInLeft) {
      const oldIndex = leftColumn.indexOf(activeId)
      const newIndex = leftColumn.indexOf(overId)
      newLeftColumn = arrayMove(leftColumn, oldIndex, newIndex)
    } else if (activeInRight && overInRight) {
      const oldIndex = rightColumn.indexOf(activeId)
      const newIndex = rightColumn.indexOf(overId)
      newRightColumn = arrayMove(rightColumn, oldIndex, newIndex)
    }
    // Cross-column move
    else if (activeInLeft && overInRight) {
      newLeftColumn = leftColumn.filter((id) => id !== activeId)
      const overIndex = rightColumn.indexOf(overId)
      newRightColumn = [
        ...rightColumn.slice(0, overIndex),
        activeId,
        ...rightColumn.slice(overIndex),
      ]
    } else if (activeInRight && overInLeft) {
      newRightColumn = rightColumn.filter((id) => id !== activeId)
      const overIndex = leftColumn.indexOf(overId)
      newLeftColumn = [
        ...leftColumn.slice(0, overIndex),
        activeId,
        ...leftColumn.slice(overIndex),
      ]
    }

    setLeftColumn(newLeftColumn)
    setRightColumn(newRightColumn)

    // Save to localStorage
    const layoutToSave = {
      leftColumn: newLeftColumn,
      rightColumn: newRightColumn,
    }
    localStorage.setItem("dashboard-layout", JSON.stringify(layoutToSave))

    // Notify parent
    onLayoutChange(newLeftColumn, newRightColumn)
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
          className="lg:col-span-2 space-y-6 min-h-[200px]"
        >
          <SortableContext items={leftColumn} strategy={verticalListSortingStrategy}>
            {leftColumn.map((id) => (
              <DraggableItem key={id} id={id}>
                {children[id]}
              </DraggableItem>
            ))}
          </SortableContext>
        </motion.div>

        {/* Right Column */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
          className="space-y-6 min-h-[200px]"
        >
          <SortableContext items={rightColumn} strategy={verticalListSortingStrategy}>
            {rightColumn.map((id) => (
              <DraggableItem key={id} id={id}>
                {children[id]}
              </DraggableItem>
            ))}
          </SortableContext>
        </motion.div>
      </div>
    </DndContext>
  )
}

